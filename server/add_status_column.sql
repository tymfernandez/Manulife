-- Add status column to Applications table
ALTER TABLE Applications 
ADD COLUMN status TEXT DEFAULT 'Interview';

-- Update existing records to have Interview status
UPDATE Applications 
SET status = 'Interview' 
WHERE status IS NULL;