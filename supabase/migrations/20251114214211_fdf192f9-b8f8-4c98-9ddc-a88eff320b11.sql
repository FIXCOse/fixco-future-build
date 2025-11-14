-- Remove all demo projects, keep only the Solna renovation project
DELETE FROM reference_projects 
WHERE id != '1fc4af76-260f-4d3b-bb51-7b8f123e21ff';