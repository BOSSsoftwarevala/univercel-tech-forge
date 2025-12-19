-- Fix function search path security warnings
ALTER FUNCTION add_to_approval_queue() SET search_path = public;
ALTER FUNCTION update_thread_timestamp() SET search_path = public;