-- ============================================================
-- RailCareAI Database Schema
-- ============================================================
-- Based on the current public schema in Supabase.
--
-- Includes:
--   - ENUM types
--   - Tables
--   - Column types/defaults
--   - Primary keys
--   - Unique constraints
--   - Foreign keys
--   - Non-automatic indexes
--
-- Does NOT include:
--   - Seed/data rows
--   - RLS policies
--   - Supabase authentication/storage configuration
-- ============================================================


-- ============================================================
-- ENUM TYPES
-- ============================================================

CREATE TYPE user_role AS ENUM (
    'PASSENGER',
    'ADMIN',
    'OFFICER'
);

CREATE TYPE complaint_category AS ENUM (
    'CLEANLINESS',
    'ELECTRICAL',
    'WATER',
    'SECURITY',
    'STAFF_BEHAVIOUR',
    'COACH_DAMAGE',
    'CATERING',
    'OTHER'
);

CREATE TYPE complaint_priority AS ENUM (
    'LOW',
    'MEDIUM',
    'HIGH',
    'CRITICAL'
);

CREATE TYPE complaint_status AS ENUM (
    'SUBMITTED',
    'AI_ANALYZED',
    'ASSIGNED',
    'IN_PROGRESS',
    'RESOLVED'
);

CREATE TYPE incident_severity AS ENUM (
    'LOW',
    'MEDIUM',
    'HIGH',
    'CRITICAL'
);

CREATE TYPE incident_status AS ENUM (
    'OPEN',
    'INVESTIGATING',
    'RESOLVED'
);

CREATE TYPE media_type AS ENUM (
    'IMAGE',
    'AUDIO',
    'VIDEO'
);


-- ============================================================
-- USERS
-- ============================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    role user_role NOT NULL DEFAULT 'PASSENGER',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ============================================================
-- DEPARTMENTS
-- ============================================================

CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ============================================================
-- INCIDENTS
-- ============================================================

CREATE TABLE incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    train_number TEXT,
    coach_number TEXT,
    category complaint_category,
    severity incident_severity NOT NULL DEFAULT 'MEDIUM',
    status incident_status NOT NULL DEFAULT 'OPEN',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ============================================================
-- OFFICERS
-- ============================================================

CREATE TABLE officers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    department_id UUID NOT NULL,
    specialization TEXT,
    is_available BOOLEAN NOT NULL DEFAULT true,
    current_workload INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT officers_user_id_fkey
        FOREIGN KEY (user_id)
        REFERENCES users(id),

    CONSTRAINT officers_department_id_fkey
        FOREIGN KEY (department_id)
        REFERENCES departments(id)
);


-- ============================================================
-- COMPLAINTS
-- ============================================================

CREATE TABLE complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_number TEXT NOT NULL UNIQUE,
    user_id UUID,
    train_number TEXT,
    coach_number TEXT,
    seat_number TEXT,
    summary TEXT NOT NULL,

    category complaint_category DEFAULT 'OTHER',
    priority complaint_priority DEFAULT 'MEDIUM',

    department_id UUID,
    officer_id UUID,
    incident_id UUID,

    status complaint_status NOT NULL DEFAULT 'SUBMITTED',

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    severity_score INTEGER,
    sla_minutes INTEGER,
    deadline TIMESTAMPTZ,
    passenger_name TEXT,

    requires_human_review BOOLEAN DEFAULT false,
    input_type TEXT,

    CONSTRAINT complaints_user_id_fkey
        FOREIGN KEY (user_id)
        REFERENCES users(id),

    CONSTRAINT complaints_department_id_fkey
        FOREIGN KEY (department_id)
        REFERENCES departments(id),

    CONSTRAINT complaints_officer_id_fkey
        FOREIGN KEY (officer_id)
        REFERENCES officers(id),

    CONSTRAINT complaints_incident_id_fkey
        FOREIGN KEY (incident_id)
        REFERENCES incidents(id)
);


-- ============================================================
-- AI ANALYSIS
-- ============================================================

CREATE TABLE ai_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id UUID NOT NULL UNIQUE,

    category complaint_category,
    priority complaint_priority,
    department_id UUID,

    summary TEXT,
    confidence NUMERIC,

    extracted_train_number TEXT,
    extracted_coach_number TEXT,
    extracted_seat_number TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT ai_analysis_complaint_id_fkey
        FOREIGN KEY (complaint_id)
        REFERENCES complaints(id),

    CONSTRAINT ai_analysis_department_id_fkey
        FOREIGN KEY (department_id)
        REFERENCES departments(id)
);


-- ============================================================
-- MEDIA
-- ============================================================

CREATE TABLE media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id UUID NOT NULL,
    media_type media_type NOT NULL,
    file_url TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT media_complaint_id_fkey
        FOREIGN KEY (complaint_id)
        REFERENCES complaints(id)
);


-- ============================================================
-- STATUS HISTORY
-- ============================================================

CREATE TABLE status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id UUID NOT NULL,

    old_status complaint_status,
    new_status complaint_status NOT NULL,

    changed_by UUID,
    remarks TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT status_history_complaint_id_fkey
        FOREIGN KEY (complaint_id)
        REFERENCES complaints(id),

    CONSTRAINT status_history_changed_by_fkey
        FOREIGN KEY (changed_by)
        REFERENCES users(id)
);


-- ============================================================
-- INDEXES
-- ============================================================
-- These are the additional indexes verified in Supabase.
-- Primary-key and UNIQUE indexes are already created by the
-- PRIMARY KEY / UNIQUE constraints above.
-- ============================================================

CREATE INDEX idx_ai_analysis_complaint_id
    ON ai_analysis (complaint_id);


CREATE INDEX idx_complaints_created_at
    ON complaints (created_at);

CREATE INDEX idx_complaints_department_id
    ON complaints (department_id);

CREATE INDEX idx_complaints_incident_id
    ON complaints (incident_id);

CREATE INDEX idx_complaints_officer_id
    ON complaints (officer_id);

CREATE INDEX idx_complaints_priority
    ON complaints (priority);

CREATE INDEX idx_complaints_status
    ON complaints (status);

CREATE INDEX idx_complaints_user_id
    ON complaints (user_id);


CREATE INDEX idx_media_complaint_id
    ON media (complaint_id);


CREATE INDEX idx_status_history_complaint_id
    ON status_history (complaint_id);