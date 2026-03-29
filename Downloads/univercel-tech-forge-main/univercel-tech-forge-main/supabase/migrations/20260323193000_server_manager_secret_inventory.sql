INSERT INTO public.master_security_settings (
  setting_key,
  setting_value_encrypted,
  setting_type,
  is_secret,
  rotation_required,
  last_rotated_at,
  rotation_interval_days
) VALUES
  ('DATABASE_URL', 'kms://server-manager/database-url', 'string', true, false, now() - interval '35 days', 90),
  ('JWT_SIGNING_KEY', 'kms://server-manager/jwt-signing-key', 'string', true, true, now() - interval '31 days', 30),
  ('OAUTH_CLIENT_SECRET', 'kms://server-manager/oauth-client-secret', 'string', true, false, now() - interval '20 days', 60),
  ('TLS_CERTIFICATE', 'kms://server-manager/tls-certificate', 'string', true, false, now() - interval '120 days', 365)
ON CONFLICT (setting_key) DO UPDATE SET
  is_secret = EXCLUDED.is_secret,
  rotation_required = EXCLUDED.rotation_required,
  rotation_interval_days = EXCLUDED.rotation_interval_days,
  setting_value_encrypted = COALESCE(public.master_security_settings.setting_value_encrypted, EXCLUDED.setting_value_encrypted),
  last_rotated_at = COALESCE(public.master_security_settings.last_rotated_at, EXCLUDED.last_rotated_at);