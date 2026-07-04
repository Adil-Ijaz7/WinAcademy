UPDATE auth.users
SET encrypted_password = crypt('WinAdmin2026!', gen_salt('bf')),
    updated_at = now()
WHERE email = 'admin@winacademy.online';