-- Add 10 new images to the Solna renovation project
UPDATE reference_projects
SET images = images || ARRAY[
  '/reference-projects/solna-renovation-detail-1.jpg',
  '/reference-projects/solna-renovation-detail-2.jpg',
  '/reference-projects/solna-renovation-detail-3.jpg',
  '/reference-projects/solna-renovation-bathroom.jpg',
  '/reference-projects/solna-renovation-electrical.jpg',
  '/reference-projects/solna-renovation-carpentry.jpg',
  '/reference-projects/solna-renovation-kitchen-detail.jpg',
  '/reference-projects/solna-renovation-custom-build.jpg',
  '/reference-projects/solna-renovation-overview.jpg',
  '/reference-projects/solna-renovation-detail-4.jpg'
],
updated_at = now()
WHERE id = '1fc4af76-260f-4d3b-bb51-7b8f123e21ff';