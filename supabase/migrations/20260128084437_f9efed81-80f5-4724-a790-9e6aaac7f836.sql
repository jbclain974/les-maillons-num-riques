-- Create admin_audit_logs table for traceability
CREATE TABLE public.admin_audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB DEFAULT '{}',
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for efficient querying
CREATE INDEX idx_audit_logs_created_at ON public.admin_audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_user_id ON public.admin_audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity_type ON public.admin_audit_logs(entity_type);

-- Enable RLS
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs"
  ON public.admin_audit_logs FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Authenticated users can insert their own logs
CREATE POLICY "Authenticated users can create audit logs"
  ON public.admin_audit_logs FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Create site_analytics table for tracking visits and key metrics
CREATE TABLE public.site_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  page_views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  contact_forms INTEGER DEFAULT 0,
  event_registrations INTEGER DEFAULT 0,
  activity_registrations INTEGER DEFAULT 0,
  new_members INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(date)
);

-- Enable RLS
ALTER TABLE public.site_analytics ENABLE ROW LEVEL SECURITY;

-- Admins can manage analytics
CREATE POLICY "Admins can manage analytics"
  ON public.site_analytics FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Public read for dashboard widgets
CREATE POLICY "Analytics are readable by authenticated users"
  ON public.site_analytics FOR SELECT
  USING (auth.uid() IS NOT NULL);