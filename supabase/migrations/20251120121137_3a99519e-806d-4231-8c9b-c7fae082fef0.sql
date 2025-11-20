-- Attribution automatique du rôle admin au premier utilisateur
-- Cette fonction assigne le rôle admin au tout premier compte créé

CREATE OR REPLACE FUNCTION public.assign_admin_to_first_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_count INTEGER;
BEGIN
  -- Compter le nombre d'utilisateurs existants
  SELECT COUNT(*) INTO user_count FROM public.profiles;
  
  -- Si c'est le premier utilisateur, lui attribuer le rôle admin
  IF user_count = 1 THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
  END IF;
  
  RETURN NEW;
END;
$$;

-- Créer le trigger qui s'exécute après la création d'un profil
CREATE TRIGGER assign_admin_on_first_signup
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_admin_to_first_user();