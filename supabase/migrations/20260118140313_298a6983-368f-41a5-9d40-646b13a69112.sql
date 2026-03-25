-- Enable realtime for application tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.reseller_applications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.franchise_accounts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.influencer_accounts;