-- Run this in Supabase SQL Editor and share a screenshot of the result.
-- It shows us exactly what's in the reports table right now, which tells
-- us definitively whether the migration was applied.

select
  id,
  issue_categories,
  pg_typeof(issue_categories) as column_type,
  created_at
from reports
order by created_at desc
limit 5;
