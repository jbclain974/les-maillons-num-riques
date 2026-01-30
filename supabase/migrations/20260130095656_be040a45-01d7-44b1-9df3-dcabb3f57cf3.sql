-- Create edge function to handle admin user management
-- First, let's ensure profiles table has is_active column for soft delete/inactive status

-- Add is_active column to profiles if not exists (it already exists based on schema)
-- The is_active_member column exists, we'll use that for member status
-- Let's add a separate is_account_active for account-level activation

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_account_active boolean DEFAULT true;

-- Add comment for clarity
COMMENT ON COLUMN public.profiles.is_account_active IS 'Whether the user account is active (can login) - managed by admins';

-- Update RLS policy to allow admins to update all profiles
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles" 
ON public.profiles 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to delete profiles (soft delete via is_account_active, but also hard delete capability)
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;
CREATE POLICY "Admins can delete profiles" 
ON public.profiles 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));