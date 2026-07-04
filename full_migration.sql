-- Create admission_applications table
CREATE TABLE public.admission_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  guardian_name TEXT NOT NULL,
  guardian_phone TEXT NOT NULL,
  previous_education TEXT NOT NULL,
  course_interest TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.admission_applications ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert applications (public form)
CREATE POLICY "Anyone can submit admission applications" 
ON public.admission_applications 
FOR INSERT 
WITH CHECK (true);

-- Only authenticated admins can view applications (we'll add admin role later)
CREATE POLICY "Public can view their own application by email" 
ON public.admission_applications 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_admission_applications_updated_at
BEFORE UPDATE ON public.admission_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- === NEXT MIGRATION ===

-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for managing admin access
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable Row Level Security
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Allow users to view their own roles
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Only admins can manage roles
CREATE POLICY "Admins can manage all roles" 
ON public.user_roles 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Update admission_applications policy - only admins can view all applications
DROP POLICY IF EXISTS "Public can view their own application by email" ON public.admission_applications;

CREATE POLICY "Admins can view all applications" 
ON public.admission_applications 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update application status
CREATE POLICY "Admins can update applications" 
ON public.admission_applications 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

-- === NEXT MIGRATION ===

-- Create storage bucket for gallery images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gallery', 'gallery', true);

-- Create policies for gallery bucket
CREATE POLICY "Gallery images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'gallery');

CREATE POLICY "Admins can upload gallery images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'gallery' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update gallery images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'gallery' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete gallery images"
ON storage.objects FOR DELETE
USING (bucket_id = 'gallery' AND has_role(auth.uid(), 'admin'));

-- Create gallery_images table
CREATE TABLE public.gallery_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'campus',
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Public can view all images
CREATE POLICY "Anyone can view gallery images"
ON public.gallery_images FOR SELECT
USING (true);

-- Only admins can manage images
CREATE POLICY "Admins can insert gallery images"
ON public.gallery_images FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update gallery images"
ON public.gallery_images FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete gallery images"
ON public.gallery_images FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at
CREATE TRIGGER update_gallery_images_updated_at
BEFORE UPDATE ON public.gallery_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default images
INSERT INTO public.gallery_images (title, category, image_url, display_order) VALUES
('Main Academic Building', 'campus', 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop', 1),
('Annual Convocation Ceremony', 'events', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop', 2),
('Sports Day Competition', 'activities', 'https://images.unsplash.com/photo-1529390079861-591f2e5ea90d?w=800&h=600&fit=crop', 3),
('Modern Library', 'campus', 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=600&fit=crop', 4),
('Science Exhibition', 'events', 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&h=600&fit=crop', 5),
('Interactive Classroom Session', 'activities', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=600&fit=crop', 6);

-- === NEXT MIGRATION ===

-- Create blog_posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  author_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ad_banners table
CREATE TABLE public.ad_banners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  link_url TEXT,
  placement TEXT NOT NULL DEFAULT 'general',
  display_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_banners ENABLE ROW LEVEL SECURITY;

-- Blog posts policies
CREATE POLICY "Anyone can view published blog posts"
ON public.blog_posts FOR SELECT
USING (published = true);

CREATE POLICY "Admins can view all blog posts"
ON public.blog_posts FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert blog posts"
ON public.blog_posts FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update blog posts"
ON public.blog_posts FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete blog posts"
ON public.blog_posts FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Ad banners policies
CREATE POLICY "Anyone can view active ad banners"
ON public.ad_banners FOR SELECT
USING (active = true);

CREATE POLICY "Admins can view all ad banners"
ON public.ad_banners FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert ad banners"
ON public.ad_banners FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update ad banners"
ON public.ad_banners FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete ad banners"
ON public.ad_banners FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Triggers for updated_at
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ad_banners_updated_at
BEFORE UPDATE ON public.ad_banners
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for blog images
INSERT INTO storage.buckets (id, name, public) VALUES ('blog', 'blog', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('ads', 'ads', true);

-- Storage policies for blog bucket
CREATE POLICY "Anyone can view blog images"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog');

CREATE POLICY "Admins can upload blog images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'blog' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update blog images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'blog' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete blog images"
ON storage.objects FOR DELETE
USING (bucket_id = 'blog' AND has_role(auth.uid(), 'admin'::app_role));

-- Storage policies for ads bucket
CREATE POLICY "Anyone can view ad images"
ON storage.objects FOR SELECT
USING (bucket_id = 'ads');

CREATE POLICY "Admins can upload ad images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'ads' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update ad images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'ads' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete ad images"
ON storage.objects FOR DELETE
USING (bucket_id = 'ads' AND has_role(auth.uid(), 'admin'::app_role));

-- === NEXT MIGRATION ===

-- Drop existing policies if any to recreate properly
DROP POLICY IF EXISTS "Anyone can submit applications" ON public.admission_applications;
DROP POLICY IF EXISTS "Admins can view all applications" ON public.admission_applications;
DROP POLICY IF EXISTS "Admins can update applications" ON public.admission_applications;
DROP POLICY IF EXISTS "Admins can delete applications" ON public.admission_applications;

-- Ensure RLS is enabled
ALTER TABLE public.admission_applications ENABLE ROW LEVEL SECURITY;

-- Allow public INSERT for form submissions (required for admission form)
CREATE POLICY "Anyone can submit applications" 
ON public.admission_applications 
FOR INSERT 
WITH CHECK (true);

-- Only admins can view applications (protects sensitive PII)
CREATE POLICY "Admins can view all applications" 
ON public.admission_applications 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can update application status
CREATE POLICY "Admins can update applications" 
ON public.admission_applications 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete applications
CREATE POLICY "Admins can delete applications" 
ON public.admission_applications 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- === NEXT MIGRATION ===

-- Create students table for enrolled students
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  guardian_name TEXT NOT NULL,
  guardian_phone TEXT NOT NULL,
  course TEXT NOT NULL,
  enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create fee_records table
CREATE TABLE public.fee_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  fee_type TEXT NOT NULL DEFAULT 'tuition',
  due_date DATE NOT NULL,
  paid_date DATE,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  receipt_number TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_records ENABLE ROW LEVEL SECURITY;

-- RLS policies for students table (admin only)
CREATE POLICY "Admins can view all students"
  ON public.students FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert students"
  ON public.students FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update students"
  ON public.students FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete students"
  ON public.students FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- RLS policies for fee_records table (admin only)
CREATE POLICY "Admins can view all fee records"
  ON public.fee_records FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert fee records"
  ON public.fee_records FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update fee records"
  ON public.fee_records FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete fee records"
  ON public.fee_records FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- Triggers for updated_at
CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fee_records_updated_at
  BEFORE UPDATE ON public.fee_records
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- === NEXT MIGRATION ===


-- Add new columns for admission form updates
ALTER TABLE public.admission_applications 
  ADD COLUMN IF NOT EXISTS father_name text,
  ADD COLUMN IF NOT EXISTS cnic_bform text,
  ADD COLUMN IF NOT EXISTS whatsapp_number text;

-- Make father_name required for new submissions (but nullable for existing rows)
-- We'll handle validation in the frontend

-- === NEXT MIGRATION ===


-- Create faculty_members table
CREATE TABLE public.faculty_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  photo_url TEXT,
  role TEXT NOT NULL,
  qualifications TEXT[] NOT NULL DEFAULT '{}',
  expertise TEXT[] NOT NULL DEFAULT '{}',
  experience TEXT NOT NULL DEFAULT '',
  display_order INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.faculty_members ENABLE ROW LEVEL SECURITY;

-- Public read for active faculty
CREATE POLICY "Anyone can view active faculty"
ON public.faculty_members
FOR SELECT
USING (active = true);

-- Admin full access
CREATE POLICY "Admins can manage faculty"
ON public.faculty_members
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Seed existing faculty data
INSERT INTO public.faculty_members (name, photo_url, role, qualifications, expertise, experience, display_order) VALUES
('Fida Hussain', '/lovable-uploads/fida-hussain.jpeg', 'Principal & IT Head', ARRAY['MPhil in Education'], ARRAY['Institute Management'], '15+ years', 1),
('Mr. Rajesh Kumar', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face', 'Science Department Head', ARRAY['M.Sc. Physics', 'B.Ed.', 'NET Qualified'], ARRAY['Physics', 'Applied Sciences', 'Experimental Methods'], '12+ years', 2),
('Ms. Anjali Verma', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face', 'English & Literature Faculty', ARRAY['M.A. English Literature', 'CELTA Certified', 'B.Ed.'], ARRAY['English Literature', 'Creative Writing', 'Communication Skills'], '10+ years', 3),
('Dr. Mohammed Aslam', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face', 'Computer Science Head', ARRAY['Ph.D. Computer Science', 'M.Tech IT', 'AWS Certified'], ARRAY['Programming', 'Web Development', 'Artificial Intelligence'], '14+ years', 4),
('Mrs. Lakshmi Nair', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face', 'Chemistry Faculty', ARRAY['M.Sc. Chemistry', 'B.Ed.', 'Research Associate'], ARRAY['Organic Chemistry', 'Lab Management', 'Environmental Science'], '8+ years', 5),
('Mr. Vikram Singh', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face', 'Commerce & Economics Faculty', ARRAY['MBA Finance', 'M.Com', 'CA Inter'], ARRAY['Accountancy', 'Business Studies', 'Economics'], '11+ years', 6);

-- === NEXT MIGRATION ===


-- =============================================
-- 1. SITE SETTINGS (single-row key-value store)
-- =============================================
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name text NOT NULL DEFAULT 'Win Academy',
  tagline text NOT NULL DEFAULT 'Empowering Minds, Building Futures',
  logo_url text,
  phone text DEFAULT '+92 345 3781552',
  email text DEFAULT 'winacademydadu@gmail.com',
  address text DEFAULT 'PQPC+64, Chano Dādu, Sindh, Pakistan',
  office_hours text DEFAULT 'Monday - Saturday, 9:00 AM - 6:00 PM',
  social_facebook text,
  social_instagram text,
  social_youtube text,
  social_whatsapp text,
  social_twitter text,
  map_embed_url text DEFAULT 'https://maps.google.com/maps?q=PQPC%2B64+WIN+INSTITUTE+Chano+Dadu+Pakistan&t=&z=17&ie=UTF8&iwloc=&output=embed',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can update site settings" ON public.site_settings FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert site settings" ON public.site_settings FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- =============================================
-- 2. COURSES (full catalog)
-- =============================================
CREATE TABLE public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  short_description text,
  category text NOT NULL DEFAULT 'IT & Computer',
  image_url text,
  price numeric,
  duration text,
  schedule text,
  enrollment_status text NOT NULL DEFAULT 'open',
  features text[] DEFAULT '{}',
  active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active courses" ON public.courses FOR SELECT USING (active = true);
CREATE POLICY "Admins can view all courses" ON public.courses FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert courses" ON public.courses FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update courses" ON public.courses FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete courses" ON public.courses FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- =============================================
-- 3. TESTIMONIALS
-- =============================================
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL DEFAULT '',
  content text NOT NULL,
  image_url text,
  rating integer NOT NULL DEFAULT 5,
  active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active testimonials" ON public.testimonials FOR SELECT USING (active = true);
CREATE POLICY "Admins can view all testimonials" ON public.testimonials FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert testimonials" ON public.testimonials FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update testimonials" ON public.testimonials FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete testimonials" ON public.testimonials FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- =============================================
-- 4. PAGE SECTIONS (flexible content blocks)
-- =============================================
CREATE TABLE public.page_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page text NOT NULL,
  section_key text NOT NULL,
  title text,
  subtitle text,
  content text,
  image_url text,
  metadata jsonb DEFAULT '{}',
  display_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(page, section_key)
);

ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active page sections" ON public.page_sections FOR SELECT USING (active = true);
CREATE POLICY "Admins can view all page sections" ON public.page_sections FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert page sections" ON public.page_sections FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update page sections" ON public.page_sections FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete page sections" ON public.page_sections FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- =============================================
-- 5. Triggers for updated_at
-- =============================================
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_page_sections_updated_at BEFORE UPDATE ON public.page_sections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- === NEXT MIGRATION ===

DO $$
DECLARE
  new_user_id uuid := gen_random_uuid();
BEGIN
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data, confirmation_token, recovery_token
  ) VALUES (
    new_user_id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'admin@winacademy.online',
    crypt('WinAdmin2026!', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    '', ''
  );

  INSERT INTO auth.identities (
    id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    new_user_id,
    new_user_id::text,
    json_build_object('sub', new_user_id::text, 'email', 'admin@winacademy.online', 'email_verified', true),
    'email',
    now(), now(), now()
  );

  INSERT INTO public.user_roles (user_id, role)
  VALUES (new_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
END $$;

-- === NEXT MIGRATION ===

UPDATE auth.users
SET email_change = COALESCE(email_change, ''),
    email_change_token_new = COALESCE(email_change_token_new, ''),
    email_change_token_current = COALESCE(email_change_token_current, ''),
    phone_change = COALESCE(phone_change, ''),
    phone_change_token = COALESCE(phone_change_token, ''),
    confirmation_token = COALESCE(confirmation_token, ''),
    recovery_token = COALESCE(recovery_token, ''),
    reauthentication_token = COALESCE(reauthentication_token, '')
WHERE email = 'admin@winacademy.online';

-- === NEXT MIGRATION ===

UPDATE auth.users
SET encrypted_password = crypt('WinAdmin2026!', gen_salt('bf')),
    updated_at = now()
WHERE email = 'admin@winacademy.online';

-- === NEXT MIGRATION ===

DROP POLICY IF EXISTS "Anyone can submit applications" ON public.admission_applications;

-- === NEXT MIGRATION ===

-- Harden sensitive PII tables: remove anon discoverability / access.
-- RLS already restricts rows, this adds defense-in-depth and removes
-- these tables from the public (anon) GraphQL schema surface.

-- admission_applications: public can only INSERT (submit form), nothing else.
REVOKE ALL ON public.admission_applications FROM anon;
GRANT INSERT ON public.admission_applications TO anon;

-- students: no public access at all (admin-only via authenticated + RLS).
REVOKE ALL ON public.students FROM anon;

-- fee_records: no public access at all (admin-only via authenticated + RLS).
REVOKE ALL ON public.fee_records FROM anon;

-- === NEXT MIGRATION ===

REVOKE SELECT ON TABLE public.user_roles FROM anon;

-- === NEXT MIGRATION ===

