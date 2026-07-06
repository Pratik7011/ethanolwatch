-- Reframes category descriptions to "owner-reported" language rather than
-- implied causation. Run in Supabase SQL Editor.

update issue_categories set description = 'Owner-reported reduction in fuel economy after using ethanol-blended petrol.' where id = 'mileage_drop';
update issue_categories set description = 'Owner-reported hesitation or vibration, most commonly on older engines.' where id = 'engine_knocking';
update issue_categories set description = 'Owner-reported fuel pump problems, including hard starting or stalling.' where id = 'fuel_pump';
update issue_categories set description = 'Owner-reported fuel-line or gasket wear over time.' where id = 'seal_wear';
update issue_categories set description = 'Owner-reported check-engine or warning indicators with no confirmed cause.' where id = 'warning_light';
update issue_categories set description = 'Owner-reported corrosion on metal components.' where id = 'corrosion';
update issue_categories set description = 'Owner-reported difficulty starting, particularly in cold conditions.' where id = 'hard_start';
update issue_categories set description = 'Any other owner-reported issue not covered above.' where id = 'other';
