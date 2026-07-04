
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
