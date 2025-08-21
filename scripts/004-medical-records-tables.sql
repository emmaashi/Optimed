-- Medical Records table
CREATE TABLE medical_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('condition', 'medication', 'allergy', 'procedure', 'lab_result')),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  doctor_name VARCHAR(255),
  dosage VARCHAR(100),
  severity VARCHAR(20) CHECK (severity IN ('low', 'moderate', 'high', 'critical')),
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vital Signs table
CREATE TABLE vital_signs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  blood_pressure_systolic INTEGER,
  blood_pressure_diastolic INTEGER,
  heart_rate INTEGER,
  temperature DECIMAL(4,1),
  weight DECIMAL(5,1),
  height DECIMAL(5,1),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Emergency Contacts table
CREATE TABLE emergency_contacts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  relationship VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  address TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insurance Information table
CREATE TABLE insurance_info (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_name VARCHAR(255) NOT NULL,
  policy_number VARCHAR(100) NOT NULL,
  group_number VARCHAR(100),
  member_id VARCHAR(100),
  plan_type VARCHAR(100),
  coverage_start_date DATE,
  coverage_end_date DATE,
  copay_amount DECIMAL(6,2),
  deductible_amount DECIMAL(8,2),
  is_primary BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_medical_records_user_id ON medical_records(user_id);
CREATE INDEX idx_medical_records_type ON medical_records(type);
CREATE INDEX idx_medical_records_status ON medical_records(status);
CREATE INDEX idx_medical_records_date ON medical_records(date DESC);

CREATE INDEX idx_vital_signs_user_id ON vital_signs(user_id);
CREATE INDEX idx_vital_signs_date ON vital_signs(date DESC);

CREATE INDEX idx_emergency_contacts_user_id ON emergency_contacts(user_id);
CREATE INDEX idx_insurance_info_user_id ON insurance_info(user_id);

-- RLS (Row Level Security) Policies
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE vital_signs ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_info ENABLE ROW LEVEL SECURITY;

-- Medical Records policies
CREATE POLICY "Users can view own medical records" ON medical_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own medical records" ON medical_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own medical records" ON medical_records
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own medical records" ON medical_records
  FOR DELETE USING (auth.uid() = user_id);

-- Vital Signs policies
CREATE POLICY "Users can view own vital signs" ON vital_signs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own vital signs" ON vital_signs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vital signs" ON vital_signs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own vital signs" ON vital_signs
  FOR DELETE USING (auth.uid() = user_id);

-- Emergency Contacts policies
CREATE POLICY "Users can view own emergency contacts" ON emergency_contacts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own emergency contacts" ON emergency_contacts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own emergency contacts" ON emergency_contacts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own emergency contacts" ON emergency_contacts
  FOR DELETE USING (auth.uid() = user_id);

-- Insurance Info policies
CREATE POLICY "Users can view own insurance info" ON insurance_info
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own insurance info" ON insurance_info
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own insurance info" ON insurance_info
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own insurance info" ON insurance_info
  FOR DELETE USING (auth.uid() = user_id);

-- Functions to automatically update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_medical_records_updated_at BEFORE UPDATE ON medical_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vital_signs_updated_at BEFORE UPDATE ON vital_signs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_emergency_contacts_updated_at BEFORE UPDATE ON emergency_contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_insurance_info_updated_at BEFORE UPDATE ON insurance_info
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
