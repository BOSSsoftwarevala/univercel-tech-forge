
-- Enable realtime for new tables (with IF NOT EXISTS logic via DO block)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'command_center_alerts') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.command_center_alerts;
    END IF;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'buzzer_acknowledgments') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.buzzer_acknowledgments;
    END IF;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;
