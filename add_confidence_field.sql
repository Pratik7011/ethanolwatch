-- Adds a field capturing how confident the owner is that ethanol fuel is the
-- actual cause — this is the single biggest credibility improvement available.
alter table reports add column if not exists ethanol_confidence text
  check (ethanol_confidence in ('owner_suspected', 'mechanic_suggested', 'service_center_diagnosed', 'unknown'));
