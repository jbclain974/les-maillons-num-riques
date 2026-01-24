-- Fix 1: Restrict profiles table to authenticated users only (remove public access)
DROP POLICY IF EXISTS "Public profiles are viewable by authenticated users" ON public.profiles;

CREATE POLICY "Authenticated users can view profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Fix 2: Remove overly permissive contact_messages SELECT policy
DROP POLICY IF EXISTS "Authenticated users can view messages" ON public.contact_messages;

-- Fix 3: Drop existing storage policies and create secure ones
DROP POLICY IF EXISTS "Authenticated users can upload media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete media" ON storage.objects;

-- Allow authenticated users to INSERT only (upload)
CREATE POLICY "Authenticated users can upload media"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media');

-- Restrict UPDATE to admins and editors only
CREATE POLICY "Admins and editors can update media"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'media' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')));

-- Restrict DELETE to admins and editors only
CREATE POLICY "Admins and editors can delete media"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'media' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')));