-- OPTION 1: RECOMMENDED - Using Supabase Auth (built-in) with a profiles table for extended data
-- Step 1: Enable Email provider in Supabase Dashboard (Authentication > Settings > Providers)
-- Step 2: Create this table to store additional user profile information

CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
    updated_at TIMESTAMP WITH TIME ZONE NOW(),
    full_name TEXT,
    avatar_url TEXT,
    website TEXT,
    -- Add any other fields you want to store for user profiles
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Optional: Create a function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Optional: Trigger to automatically update updated_at on row updates
CREATE TRIGGER update_profiles_modtime 
    BEFORE UPDATE ON public.profiles 
    FOR EACH ROW 
    EXECUTE PROCEDURE public.update_updated_at_column();

-- OPTION 2: NOT RECOMMENDED FOR PRODUCTION - Custom authentication table
-- WARNING: Storing passwords securely requires proper hashing (bcrypt/scrypt) which 
--          should be done on a secure backend, not in raw SQL or frontend JavaScript.
--          Using this approach exposes you to serious security risks.
--          ONLY use this for learning/experimentation in a trusted environment.

CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- MUST store hashed password (e.g., bcrypt output)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Add other fields like full_name, etc. if needed
    full_name TEXT
);

-- IMPORTANT SECURITY NOTES FOR OPTION 2:
-- 1. NEVER store plain-text passwords
-- 2. Password hashing MUST be done server-side (you would need a backend service)
-- 3. This approach lacks email verification, password reset, etc. that Supabase Auth provides
-- 4. Use Supabase Auth (Option 1) instead for production applications