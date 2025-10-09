-- STEG 1: Lägg till nya enum-värden FÖRST (detta måste göras separat)
DO $$ 
BEGIN
  -- Lägg till nya status-värden om de inte finns
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'new' AND enumtypid = 'booking_status'::regtype) THEN
    ALTER TYPE booking_status ADD VALUE 'new';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'in_review' AND enumtypid = 'booking_status'::regtype) THEN
    ALTER TYPE booking_status ADD VALUE 'in_review';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'quoted' AND enumtypid = 'booking_status'::regtype) THEN
    ALTER TYPE booking_status ADD VALUE 'quoted';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'scheduled' AND enumtypid = 'booking_status'::regtype) THEN
    ALTER TYPE booking_status ADD VALUE 'scheduled';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'done' AND enumtypid = 'booking_status'::regtype) THEN
    ALTER TYPE booking_status ADD VALUE 'done';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'canceled' AND enumtypid = 'booking_status'::regtype) THEN
    ALTER TYPE booking_status ADD VALUE 'canceled';
  END IF;
END $$;