-- ============================================================
-- Table: projects
-- Mirrors the Project type from src/data/projects.ts
-- Complex fields (hero, gallery, credits) stored as JSONB.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.projects (
  id             uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  slug           text        NOT NULL UNIQUE,
  ref            text        NOT NULL,
  title          text        NOT NULL,
  category       text        NOT NULL,
  year           text        NOT NULL,
  client         text,
  role           text[]      NOT NULL DEFAULT '{}',
  brief          text        NOT NULL DEFAULT '',
  intent         text,
  body           text,
  format         text,
  run            text,
  hero           jsonb       NOT NULL DEFAULT '{}',
  spread         jsonb,
  gallery        jsonb       NOT NULL DEFAULT '[]',
  tags           text[]      NOT NULL DEFAULT '{}',
  credits        jsonb                DEFAULT '[]',
  featured       boolean              DEFAULT false,
  display_order  integer              DEFAULT 0,
  created_at     timestamptz          DEFAULT now(),
  updated_at     timestamptz          DEFAULT now()
);

-- RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Public read (portfolio)
CREATE POLICY "Allow public read" ON public.projects
  FOR SELECT USING (true);

-- Only authenticated users can write (admin)
CREATE POLICY "Allow auth insert" ON public.projects
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow auth update" ON public.projects
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow auth delete" ON public.projects
  FOR DELETE USING (auth.role() = 'authenticated');

-- Grants
GRANT SELECT ON public.projects TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.projects TO authenticated;

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- Storage bucket: project-images (public)
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT DO NOTHING;

CREATE POLICY "Allow public read storage" ON storage.objects
  FOR SELECT USING (bucket_id = 'project-images');

CREATE POLICY "Allow auth upload storage" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'project-images' AND auth.role() = 'authenticated');

CREATE POLICY "Allow auth delete storage" ON storage.objects
  FOR DELETE USING (bucket_id = 'project-images' AND auth.role() = 'authenticated');
