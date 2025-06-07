-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  date_of_birth DATE,
  health_card_number VARCHAR(50),
  emergency_contact_name VARCHAR(255),
  emergency_contact_phone VARCHAR(20),
  medical_conditions TEXT[],
  allergies TEXT[],
  current_medications TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hospitals table
CREATE TABLE hospitals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(20),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  current_wait_time INTEGER DEFAULT 0, -- in minutes
  capacity INTEGER DEFAULT 100,
  current_load INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'open', -- open, busy, critical, closed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Queue entries table
CREATE TABLE queue_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  injury_description TEXT NOT NULL,
  severity_level INTEGER NOT NULL, -- 1-5 scale
  estimated_wait_time INTEGER, -- in minutes
  position_in_queue INTEGER,
  status VARCHAR(20) DEFAULT 'waiting', -- waiting, called, checked_in, completed, no_show
  check_in_code VARCHAR(6) UNIQUE,
  check_in_deadline TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat sessions table for AI interactions
CREATE TABLE chat_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  messages JSONB NOT NULL DEFAULT '[]',
  injury_assessment JSONB,
  recommended_action VARCHAR(50), -- emergency, urgent_care, walk_in, home_care
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_queue_entries_hospital_status ON queue_entries(hospital_id, status);
CREATE INDEX idx_queue_entries_user_status ON queue_entries(user_id, status);
CREATE INDEX idx_hospitals_status ON hospitals(status);
