-- Voon Creative AI - Database Schema

-- 1. Profiles Table (Automatically created on Auth trigger usually, but defined here for completeness)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  credit_balance INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 2. Brand Assets
CREATE TABLE public.brand_assets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  primary_color TEXT DEFAULT '#2563eb',
  secondary_color TEXT DEFAULT '#ffffff',
  accent_color TEXT DEFAULT '#fbbf24',
  logo_url TEXT,
  brand_voice TEXT DEFAULT 'Modern, minimalist, and highly professional.',
  font_family TEXT DEFAULT 'Inter',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id) -- One brand kit per user
);

ALTER TABLE public.brand_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own brand kit" ON public.brand_assets 
  FOR ALL USING (auth.uid() = user_id);


-- 3. Generations (History)
CREATE TABLE public.generations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  prompt TEXT NOT NULL,
  enhanced_prompt TEXT,
  image_url TEXT NOT NULL,
  platform TEXT NOT NULL, -- youtube, instagram, square
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own generations" ON public.generations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own generations" ON public.generations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own generations" ON public.generations FOR DELETE USING (auth.uid() = user_id);


-- 4. Credit Transactions (Billing Log)
CREATE TABLE public.credit_transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL, -- negative for spending, positive for top-up
  reason TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own transactions" ON public.credit_transactions FOR SELECT USING (auth.uid() = user_id);


-- Set up Storage Buckets
insert into storage.buckets (id, name, public) values ('brand-logos', 'brand-logos', true);
insert into storage.buckets (id, name, public) values ('generations', 'generations', true);

-- Storage Policies
create policy "Logo uploads" on storage.objects for insert with check (bucket_id = 'brand-logos' and auth.uid() = owner);
create policy "Logo read" on storage.objects for select using (bucket_id = 'brand-logos');

create policy "Generation uploads" on storage.objects for insert with check (bucket_id = 'generations' and auth.uid() = owner);
create policy "Generation read" on storage.objects for select using (bucket_id = 'generations');
create policy "Generation delete" on storage.objects for delete using (bucket_id = 'generations' and auth.uid() = owner);
