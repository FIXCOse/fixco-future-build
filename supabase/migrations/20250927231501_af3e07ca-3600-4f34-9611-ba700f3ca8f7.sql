-- FIXCO Edit Mode System - Database Schema
-- 1. Content blocks for editable page sections
CREATE TABLE public.content_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  locale TEXT NOT NULL CHECK (locale IN ('sv', 'en')),
  draft JSONB NOT NULL DEFAULT '{}'::jsonb,
  published JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Service versions for version history
CREATE TABLE public.service_versions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  service_id TEXT NOT NULL,
  snapshot JSONB NOT NULL,
  edited_by UUID REFERENCES auth.users(id),
  edited_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Media assets metadata
CREATE TABLE public.media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket TEXT NOT NULL,
  path TEXT NOT NULL,
  alt_sv TEXT,
  alt_en TEXT,
  width INTEGER,
  height INTEGER,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (bucket, path)
);

-- 4. Edit locks for real-time presence
CREATE TABLE public.edit_locks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scope TEXT NOT NULL,
  locked_by UUID NOT NULL REFERENCES auth.users(id),
  locked_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  UNIQUE (scope, locked_by)
);

-- Create indexes for performance
CREATE INDEX idx_content_blocks_key_locale ON public.content_blocks (key, locale);
CREATE INDEX idx_service_versions_service_id ON public.service_versions (service_id, edited_at DESC);
CREATE INDEX idx_edit_locks_scope ON public.edit_locks (scope);
CREATE INDEX idx_edit_locks_expires ON public.edit_locks (expires_at);

-- Enable RLS on all tables
ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.edit_locks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for content_blocks
CREATE POLICY "content_blocks_select_all" ON public.content_blocks
  FOR SELECT USING (true);

CREATE POLICY "content_blocks_write_admin" ON public.content_blocks
  FOR ALL USING (is_admin_or_owner());

-- RLS Policies for service_versions
CREATE POLICY "service_versions_select_admin" ON public.service_versions
  FOR SELECT USING (is_admin_or_owner());

CREATE POLICY "service_versions_insert_admin" ON public.service_versions
  FOR INSERT WITH CHECK (is_admin_or_owner());

-- RLS Policies for media_assets
CREATE POLICY "media_assets_select_all" ON public.media_assets
  FOR SELECT USING (true);

CREATE POLICY "media_assets_write_admin" ON public.media_assets
  FOR ALL USING (is_admin_or_owner());

-- RLS Policies for edit_locks
CREATE POLICY "edit_locks_select_admin" ON public.edit_locks
  FOR SELECT USING (is_admin_or_owner());

CREATE POLICY "edit_locks_write_admin" ON public.edit_locks
  FOR ALL USING (is_admin_or_owner());

-- RPC Functions for atomic operations

-- 1. Publish content block (draft -> published)
CREATE OR REPLACE FUNCTION public.rpc_publish_content_block(
  p_key TEXT,
  p_locale TEXT
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check permissions
  IF NOT is_admin_or_owner() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  UPDATE public.content_blocks
  SET published = draft,
      updated_by = auth.uid(),
      updated_at = now()
  WHERE key = p_key AND locale = p_locale;

  RETURN FOUND;
END;
$$;

-- 2. Update service with versioning
CREATE OR REPLACE FUNCTION public.rpc_update_service_partial(
  p_id TEXT,
  p_patch JSONB
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  old_data JSONB;
BEGIN
  -- Check permissions
  IF NOT is_admin_or_owner() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  -- Get current service data for version history
  SELECT to_jsonb(services.*) INTO old_data
  FROM public.services
  WHERE id = p_id;

  IF old_data IS NULL THEN
    RAISE EXCEPTION 'Service not found';
  END IF;

  -- Save version history
  INSERT INTO public.service_versions (service_id, snapshot, edited_by)
  VALUES (p_id, old_data, auth.uid());

  -- Update service with patch
  UPDATE public.services
  SET 
    title_sv = COALESCE((p_patch->>'title_sv')::TEXT, title_sv),
    title_en = COALESCE((p_patch->>'title_en')::TEXT, title_en),
    description_sv = COALESCE((p_patch->>'description_sv')::TEXT, description_sv),
    description_en = COALESCE((p_patch->>'description_en')::TEXT, description_en),
    base_price = COALESCE((p_patch->>'base_price')::NUMERIC, base_price),
    price_type = COALESCE((p_patch->>'price_type')::TEXT, price_type),
    rot_eligible = COALESCE((p_patch->>'rot_eligible')::BOOLEAN, rot_eligible),
    rut_eligible = COALESCE((p_patch->>'rut_eligible')::BOOLEAN, rut_eligible),
    is_active = COALESCE((p_patch->>'is_active')::BOOLEAN, is_active),
    category = COALESCE((p_patch->>'category')::TEXT, category),
    sub_category = COALESCE((p_patch->>'sub_category')::TEXT, sub_category),
    updated_at = now()
  WHERE id = p_id;

  RETURN FOUND;
END;
$$;

-- 3. Acquire edit lock
CREATE OR REPLACE FUNCTION public.rpc_acquire_lock(
  p_scope TEXT
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check permissions
  IF NOT is_admin_or_owner() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  -- Clean expired locks first
  DELETE FROM public.edit_locks
  WHERE expires_at < now();

  -- Try to acquire lock
  INSERT INTO public.edit_locks (scope, locked_by, expires_at)
  VALUES (p_scope, auth.uid(), now() + interval '2 minutes')
  ON CONFLICT (scope, locked_by) 
  DO UPDATE SET 
    expires_at = now() + interval '2 minutes',
    locked_at = now();

  RETURN TRUE;
EXCEPTION
  WHEN unique_violation THEN
    RETURN FALSE;
END;
$$;

-- 4. Release edit lock
CREATE OR REPLACE FUNCTION public.rpc_release_lock(
  p_scope TEXT
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check permissions
  IF NOT is_admin_or_owner() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  DELETE FROM public.edit_locks
  WHERE scope = p_scope AND locked_by = auth.uid();

  RETURN FOUND;
END;
$$;

-- 5. Batch publish content blocks
CREATE OR REPLACE FUNCTION public.rpc_batch_publish_content(
  p_items JSONB
) RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  item JSONB;
  count INTEGER := 0;
BEGIN
  -- Check permissions
  IF NOT is_admin_or_owner() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  FOR item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    UPDATE public.content_blocks
    SET published = draft,
        updated_by = auth.uid(),
        updated_at = now()
    WHERE key = (item->>'key')::TEXT 
      AND locale = (item->>'locale')::TEXT;
    
    IF FOUND THEN
      count := count + 1;
    END IF;
  END LOOP;

  RETURN count;
END;
$$;

-- Trigger to clean expired locks automatically
CREATE OR REPLACE FUNCTION public.clean_expired_locks()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM public.edit_locks WHERE expires_at < now();
  RETURN NEW;
END;
$$;

-- Add updated_at trigger to content_blocks
CREATE OR REPLACE FUNCTION public.update_content_blocks_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_content_blocks_updated_at
  BEFORE UPDATE ON public.content_blocks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_content_blocks_updated_at();