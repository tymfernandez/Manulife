-- Add application_id column to recruitment table
ALTER TABLE recruitment 
ADD COLUMN application_id BIGINT;

-- Add foreign key constraint
ALTER TABLE recruitment 
ADD CONSTRAINT fk_recruitment_application 
FOREIGN KEY (application_id) REFERENCES "Applications"(id);

-- Create index for better performance
CREATE INDEX idx_recruitment_application_id ON recruitment(application_id);