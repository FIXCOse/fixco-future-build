-- Create AI conversations table to store learning data
CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT NOT NULL,
  conversation_type TEXT NOT NULL, -- 'home_analysis', 'cost_prediction', 'project_assistant'
  user_input JSONB NOT NULL DEFAULT '{}', -- User's form data and messages
  ai_response JSONB NOT NULL DEFAULT '{}', -- AI's analysis and recommendations
  user_feedback JSONB DEFAULT '{}', -- User ratings and feedback
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

-- Policies for ai_conversations
CREATE POLICY "Users can insert their own conversations"
ON ai_conversations FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can view their own conversations"
ON ai_conversations FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own conversations"
ON ai_conversations FOR UPDATE 
USING (auth.uid() = user_id OR user_id IS NULL);

-- Create AI learning patterns table
CREATE TABLE IF NOT EXISTS ai_learning_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pattern_type TEXT NOT NULL, -- 'home_type', 'budget_range', 'priority_preference'
  input_pattern JSONB NOT NULL,
  successful_outputs JSONB NOT NULL DEFAULT '[]',
  usage_count INTEGER DEFAULT 1,
  success_rate NUMERIC DEFAULT 0.0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE ai_learning_patterns ENABLE ROW LEVEL SECURITY;

-- Policies for ai_learning_patterns (read-only for users, managed by system)
CREATE POLICY "Anyone can read learning patterns"
ON ai_learning_patterns FOR SELECT 
USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_session_id ON ai_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_type ON ai_conversations(conversation_type);
CREATE INDEX IF NOT EXISTS idx_ai_learning_patterns_type ON ai_learning_patterns(pattern_type);

-- Update trigger for ai_conversations
CREATE OR REPLACE FUNCTION update_ai_conversation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ai_conversations_updated_at
  BEFORE UPDATE ON ai_conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_ai_conversation_updated_at();