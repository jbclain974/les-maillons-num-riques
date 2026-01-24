-- Fix 1: Harden has_role() function to prevent role enumeration
-- Users can only check their own roles, admins can check anyone's
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If checking another user's role, only allow if caller is admin
  IF _user_id != auth.uid() THEN
    -- Check if current user is admin (direct query to avoid recursion)
    IF NOT EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    ) THEN
      RETURN false;
    END IF;
  END IF;
  
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
END;
$$;

-- Fix 2: Fix race condition in admin assignment using atomic operation
CREATE OR REPLACE FUNCTION public.assign_admin_to_first_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Atomically insert admin role only if no admin exists yet
  INSERT INTO public.user_roles (user_id, role)
  SELECT NEW.id, 'admin'::app_role
  WHERE NOT EXISTS (
    SELECT 1 FROM public.user_roles WHERE role = 'admin'
  );
  
  RETURN NEW;
END;
$$;

-- Fix 3: Harden contact_messages INSERT policy
-- Ensure new messages have 'new' status and no notes
DROP POLICY IF EXISTS "Anyone can submit contact messages" ON public.contact_messages;

CREATE POLICY "Anyone can submit contact messages"
ON public.contact_messages
FOR INSERT
TO anon, authenticated
WITH CHECK (
  status = 'new'::message_status
  AND notes IS NULL
);