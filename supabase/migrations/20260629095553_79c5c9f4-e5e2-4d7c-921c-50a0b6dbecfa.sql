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
