-- MIGRATION: allow a report to have multiple issue categories
-- Run this in Supabase SQL Editor. Safe to run once — it converts your
-- existing single-category column into an array and keeps any test
-- reports you've already submitted (wrapping the old single value in an array).

alter table reports drop constraint if exists reports_issue_category_fkey;

alter table reports rename column issue_category to issue_categories;

alter table reports
  alter column issue_categories type text[]
  using array[issue_categories]::text[];

drop index if exists reports_category_idx;

create index reports_categories_idx on reports using gin (issue_categories);
