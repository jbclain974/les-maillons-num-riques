/**
 * Sanitizes database error messages to prevent information leakage.
 * Maps technical database errors to user-friendly French messages.
 */
export const sanitizeError = (error: any): string => {
  // Log full error for debugging (admin can see in console)
  console.error('Database error:', error);

  // Handle Supabase/PostgreSQL error codes
  if (error?.code) {
    switch (error.code) {
      // Unique constraint violation
      case '23505':
        return 'Cette entrée existe déjà';
      // Foreign key constraint violation
      case '23503':
        return 'Opération invalide - dépendance non satisfaite';
      // Not null constraint
      case '23502':
        return 'Un champ obligatoire est manquant';
      // Check constraint violation
      case '23514':
        return 'Les données saisies ne respectent pas les contraintes';
      // Insufficient privilege
      case '42501':
        return 'Vous n\'avez pas les permissions nécessaires';
      // RLS policy violation (PGRST301)
      case 'PGRST301':
        return 'Accès non autorisé à cette ressource';
      // No rows found
      case 'PGRST116':
        return 'Élément introuvable';
      default:
        break;
    }
  }

  // Handle common Supabase error messages
  if (error?.message) {
    const msg = error.message.toLowerCase();
    
    if (msg.includes('row level security') || msg.includes('rls')) {
      return 'Vous n\'avez pas les permissions nécessaires';
    }
    if (msg.includes('duplicate') || msg.includes('unique')) {
      return 'Cette entrée existe déjà';
    }
    if (msg.includes('foreign key')) {
      return 'Opération invalide - dépendance non satisfaite';
    }
    if (msg.includes('not found') || msg.includes('no rows')) {
      return 'Élément introuvable';
    }
    if (msg.includes('unauthorized') || msg.includes('permission')) {
      return 'Vous n\'avez pas les permissions nécessaires';
    }
  }

  // Default generic error message
  return 'Échec de l\'opération. Veuillez réessayer.';
};

/**
 * Validates and sanitizes file uploads
 */
export const validateFileUpload = (
  file: File,
  options: {
    maxSizeMB?: number;
    allowedTypes?: string[];
    allowedExtensions?: string[];
  } = {}
): { valid: boolean; error?: string } => {
  const {
    maxSizeMB = 5,
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif']
  } = options;

  // Check file size
  if (file.size > maxSizeMB * 1024 * 1024) {
    return {
      valid: false,
      error: `Fichier trop volumineux (max ${maxSizeMB} MB)`
    };
  }

  // Check MIME type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Type de fichier non autorisé. Utilisez JPG, PNG, WEBP ou GIF.'
    };
  }

  // Sanitize and check extension
  const rawExt = file.name.split('.').pop()?.toLowerCase() || '';
  const sanitizedExt = rawExt.replace(/[^a-z0-9]/g, '');
  
  if (!allowedExtensions.includes(sanitizedExt)) {
    return {
      valid: false,
      error: 'Extension de fichier non autorisée'
    };
  }

  return { valid: true };
};

/**
 * Generates a secure, unpredictable filename
 */
export const generateSecureFilename = (originalName: string): string => {
  const ext = originalName.split('.').pop()?.toLowerCase() || 'jpg';
  const sanitizedExt = ext.replace(/[^a-z0-9]/g, '');
  const uniqueId = crypto.randomUUID();
  return `${uniqueId}.${sanitizedExt}`;
};
