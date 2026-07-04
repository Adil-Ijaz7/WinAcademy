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