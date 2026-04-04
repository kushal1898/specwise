-- User profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);
CREATE POLICY "profiles_public_read" ON public.profiles FOR SELECT USING (true);

-- Reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_type TEXT NOT NULL CHECK (product_type IN ('laptop', 'phone', 'headphone')),
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT,
  helpful_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id, product_type)
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reviews_public_read" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert_own" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_update_own" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "reviews_delete_own" ON public.reviews FOR DELETE USING (auth.uid() = user_id);

-- Saved/wishlisted products
CREATE TABLE IF NOT EXISTS public.saved_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_type TEXT NOT NULL CHECK (product_type IN ('laptop', 'phone', 'headphone')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id, product_type)
);

ALTER TABLE public.saved_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "saved_select_own" ON public.saved_products FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "saved_insert_own" ON public.saved_products FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "saved_delete_own" ON public.saved_products FOR DELETE USING (auth.uid() = user_id);

-- Page views for analytics
CREATE TABLE IF NOT EXISTS public.page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL,
  product_type TEXT NOT NULL CHECK (product_type IN ('laptop', 'phone', 'headphone')),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  session_id TEXT,
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "page_views_insert_all" ON public.page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "page_views_select_all" ON public.page_views FOR SELECT USING (true);

-- Comparisons tracking
CREATE TABLE IF NOT EXISTS public.comparisons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_ids TEXT[] NOT NULL,
  product_type TEXT NOT NULL CHECK (product_type IN ('laptop', 'phone', 'headphone')),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  compared_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.comparisons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "comparisons_insert_all" ON public.comparisons FOR INSERT WITH CHECK (true);
CREATE POLICY "comparisons_select_all" ON public.comparisons FOR SELECT USING (true);

-- Helpful votes on reviews
CREATE TABLE IF NOT EXISTS public.review_helpful (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(review_id, user_id)
);

ALTER TABLE public.review_helpful ENABLE ROW LEVEL SECURITY;

CREATE POLICY "helpful_select_all" ON public.review_helpful FOR SELECT USING (true);
CREATE POLICY "helpful_insert_own" ON public.review_helpful FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "helpful_delete_own" ON public.review_helpful FOR DELETE USING (auth.uid() = user_id);

-- User viewed products history
CREATE TABLE IF NOT EXISTS public.viewed_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_type TEXT NOT NULL CHECK (product_type IN ('laptop', 'phone', 'headphone')),
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.viewed_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "viewed_select_own" ON public.viewed_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "viewed_insert_own" ON public.viewed_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- AI chat history
CREATE TABLE IF NOT EXISTS public.ai_chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_ids TEXT[],
  product_type TEXT CHECK (product_type IN ('laptop', 'phone', 'headphone')),
  messages JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ai_chats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ai_chats_select_own" ON public.ai_chats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "ai_chats_insert_own" ON public.ai_chats FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ai_chats_update_own" ON public.ai_chats FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "ai_chats_delete_own" ON public.ai_chats FOR DELETE USING (auth.uid() = user_id);

-- Create trigger for auto-creating profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    display_name = COALESCE(EXCLUDED.display_name, profiles.display_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
    updated_at = NOW();
  
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_reviews_product ON public.reviews(product_id, product_type);
CREATE INDEX IF NOT EXISTS idx_page_views_product ON public.page_views(product_id, product_type);
CREATE INDEX IF NOT EXISTS idx_page_views_viewed_at ON public.page_views(viewed_at);
CREATE INDEX IF NOT EXISTS idx_saved_products_user ON public.saved_products(user_id);
CREATE INDEX IF NOT EXISTS idx_comparisons_compared_at ON public.comparisons(compared_at);
CREATE INDEX IF NOT EXISTS idx_viewed_history_user ON public.viewed_history(user_id);
