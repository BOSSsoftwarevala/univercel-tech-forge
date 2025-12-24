-- Enable realtime for remaining developer tables (skip already added ones)
ALTER PUBLICATION supabase_realtime ADD TABLE public.developer_tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.buzzer_queue;
ALTER PUBLICATION supabase_realtime ADD TABLE public.developer_timer_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.promise_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.developer_violations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.dev_timer;

-- Ensure full replica identity for proper realtime updates
ALTER TABLE public.developer_tasks REPLICA IDENTITY FULL;
ALTER TABLE public.buzzer_queue REPLICA IDENTITY FULL;
ALTER TABLE public.developer_timer_logs REPLICA IDENTITY FULL;
ALTER TABLE public.promise_logs REPLICA IDENTITY FULL;
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;
ALTER TABLE public.developer_violations REPLICA IDENTITY FULL;
ALTER TABLE public.dev_timer REPLICA IDENTITY FULL;