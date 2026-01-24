-- Add 'viewer' role to the app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'viewer';

-- Create trigger to auto-assign 'viewer' role to new users
CREATE OR REPLACE FUNCTION public.assign_default_role_to_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only assign viewer role if no role exists for this user yet
  -- (this preserves the admin assignment for the first user)
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = NEW.id) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'viewer'::app_role);
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger on profiles table (after new user creation)
DROP TRIGGER IF EXISTS on_profile_created_assign_role ON public.profiles;
CREATE TRIGGER on_profile_created_assign_role
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_default_role_to_new_user();

-- Allow viewers to read published content (already covered by existing policies)
-- Add policy for viewers to see their own role
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (user_id = auth.uid());