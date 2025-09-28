-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE public.user_role AS ENUM ('admin', 'editor');
CREATE TYPE public.page_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE public.integration_type AS ENUM ('google_analytics', 'meta_pixel', 'calendly', 'whatsapp', 'tawk_to', 'crisp_chat');

-- User Roles Table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    role user_role NOT NULL DEFAULT 'editor',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, role)
);

-- User Profiles Table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    display_name TEXT,
    email TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Pages Table
CREATE TABLE public.pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    meta_title TEXT,
    meta_description TEXT,
    meta_keywords TEXT[],
    status page_status NOT NULL DEFAULT 'draft',
    content JSONB,
    seo_data JSONB,
    created_by UUID,
    updated_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Portfolio Projects Table
CREATE TABLE public.portfolio_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    short_description TEXT,
    images TEXT[],
    categories TEXT[],
    tags TEXT[],
    project_url TEXT,
    featured_image TEXT,
    sort_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    status page_status NOT NULL DEFAULT 'draft',
    created_by UUID,
    updated_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Services Table
CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    short_description TEXT,
    price DECIMAL(10,2),
    price_text TEXT,
    features TEXT[],
    icon TEXT,
    is_popular BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    status page_status NOT NULL DEFAULT 'draft',
    created_by UUID,
    updated_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Testimonials Table
CREATE TABLE public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_name TEXT NOT NULL,
    author_role TEXT,
    author_company TEXT,
    author_photo TEXT,
    content TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    status page_status NOT NULL DEFAULT 'draft',
    created_by UUID,
    updated_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Blog Posts Table
CREATE TABLE public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT,
    excerpt TEXT,
    featured_image TEXT,
    meta_title TEXT,
    meta_description TEXT,
    meta_keywords TEXT[],
    categories TEXT[],
    tags TEXT[],
    read_time INTEGER,
    is_featured BOOLEAN DEFAULT false,
    status page_status NOT NULL DEFAULT 'draft',
    published_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Form Submissions/Leads Table
CREATE TABLE public.form_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    form_type TEXT NOT NULL,
    name TEXT,
    email TEXT,
    phone TEXT,
    company TEXT,
    message TEXT,
    service_interest TEXT,
    budget_range TEXT,
    timeline TEXT,
    source TEXT,
    metadata JSONB,
    is_read BOOLEAN DEFAULT false,
    is_archived BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Media Library Table
CREATE TABLE public.media_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT,
    mime_type TEXT,
    alt_text TEXT,
    caption TEXT,
    metadata JSONB,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Site Settings Table
CREATE TABLE public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    value JSONB,
    description TEXT,
    updated_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Integrations Table
CREATE TABLE public.integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type integration_type NOT NULL,
    name TEXT NOT NULL,
    configuration JSONB,
    is_active BOOLEAN DEFAULT false,
    updated_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;

-- Create security definer functions
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role user_role)
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

CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'admin')
$$;

-- Create RLS Policies

-- User Roles Policies
CREATE POLICY "Users can view their own roles" ON public.user_roles
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles" ON public.user_roles
FOR ALL USING (public.is_admin(auth.uid()));

-- Profiles Policies
CREATE POLICY "Users can view all profiles" ON public.profiles
FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all profiles" ON public.profiles
FOR ALL USING (public.is_admin(auth.uid()));

-- Pages Policies
CREATE POLICY "Anyone can view published pages" ON public.pages
FOR SELECT USING (status = 'published' OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Editors can manage pages" ON public.pages
FOR ALL USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- Portfolio Projects Policies
CREATE POLICY "Anyone can view published projects" ON public.portfolio_projects
FOR SELECT USING (status = 'published' OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Editors can manage projects" ON public.portfolio_projects
FOR ALL USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- Services Policies
CREATE POLICY "Anyone can view published services" ON public.services
FOR SELECT USING (status = 'published' OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Editors can manage services" ON public.services
FOR ALL USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- Testimonials Policies
CREATE POLICY "Anyone can view published testimonials" ON public.testimonials
FOR SELECT USING (status = 'published' OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Editors can manage testimonials" ON public.testimonials
FOR ALL USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- Blog Posts Policies
CREATE POLICY "Anyone can view published blog posts" ON public.blog_posts
FOR SELECT USING (status = 'published' OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Editors can manage blog posts" ON public.blog_posts
FOR ALL USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- Form Submissions Policies
CREATE POLICY "Admins and editors can view form submissions" ON public.form_submissions
FOR SELECT USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Anyone can create form submissions" ON public.form_submissions
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage form submissions" ON public.form_submissions
FOR ALL USING (public.is_admin(auth.uid()));

-- Media Library Policies
CREATE POLICY "Authenticated users can view media" ON public.media_library
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Editors can upload media" ON public.media_library
FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Admins can manage all media" ON public.media_library
FOR ALL USING (public.is_admin(auth.uid()));

-- Site Settings Policies
CREATE POLICY "Anyone can view site settings" ON public.site_settings
FOR SELECT USING (true);

CREATE POLICY "Admins can manage site settings" ON public.site_settings
FOR ALL USING (public.is_admin(auth.uid()));

-- Integrations Policies
CREATE POLICY "Anyone can view active integrations" ON public.integrations
FOR SELECT USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage integrations" ON public.integrations
FOR ALL USING (public.is_admin(auth.uid()));

-- Create update trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers
CREATE TRIGGER update_user_roles_updated_at BEFORE UPDATE ON public.user_roles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON public.pages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_portfolio_projects_updated_at BEFORE UPDATE ON public.portfolio_projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_form_submissions_updated_at BEFORE UPDATE ON public.form_submissions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_media_library_updated_at BEFORE UPDATE ON public.media_library FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_integrations_updated_at BEFORE UPDATE ON public.integrations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create profile trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, display_name, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1)),
        NEW.email
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user profiles
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default site settings
INSERT INTO public.site_settings (key, value, description) VALUES
('site_title', '"Adil GFX - Professional Design Services"', 'Main site title'),
('site_description', '"Professional logo design, YouTube thumbnails, and video editing services that drive results"', 'Site meta description'),
('contact_email', '"contact@adilgfx.com"', 'Primary contact email'),
('whatsapp_number', '"+1234567890"', 'WhatsApp contact number'),
('social_links', '{"instagram": "", "twitter": "", "linkedin": "", "behance": ""}', 'Social media links'),
('business_hours', '"Monday - Friday: 9:00 AM - 6:00 PM"', 'Business operating hours'),
('response_time', '"Within 24 hours"', 'Average response time');

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
('portfolio', 'portfolio', true),
('media', 'media', true),
('uploads', 'uploads', false);

-- Storage policies for portfolio bucket
CREATE POLICY "Portfolio images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'portfolio');

CREATE POLICY "Editors can upload portfolio images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'portfolio' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')));

CREATE POLICY "Editors can update portfolio images" ON storage.objects
FOR UPDATE USING (bucket_id = 'portfolio' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')));

-- Storage policies for media bucket
CREATE POLICY "Media files are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'media');

CREATE POLICY "Editors can upload media files" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'media' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')));

-- Storage policies for uploads bucket
CREATE POLICY "Users can view their own uploads" ON storage.objects
FOR SELECT USING (bucket_id = 'uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own files" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'uploads' AND auth.uid()::text = (storage.foldername(name))[1]);