-- Enable realtime for error_logs table to get live notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.error_logs;