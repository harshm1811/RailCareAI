-- ============================================================
-- RailCareAI Seed Data
-- ============================================================
-- UUIDs are generated automatically by the database.
-- This file contains development/demo data only.
-- ============================================================


-- ============================================================
-- DEPARTMENTS
-- ============================================================

INSERT INTO departments (name, description)
VALUES
    (
        'Sanitation',
        'Cleanliness and sanitation related complaints'
    ),
    (
        'Coach_Maintenance',
        'Coach, seat, door, window and structural issues'
    ),
    (
        'Catering',
        'Food and catering related complaints'
    ),
    (
        'General',
        'Complaints that do not fit another department'
    ),
    (
        'Electrical',
        'Electrical, AC, fan, lighting and power related complaints'
    ),
    (
        'Security',
        'Security and safety related complaints'
    );


-- ============================================================
-- USERS
-- ============================================================

INSERT INTO users (name, email, phone, role)
VALUES
    (
        'Admin User',
        'admin@example.com',
        NULL,
        'ADMIN'
    ),
    (
        'Passenger One',
        'passenger1@example.com',
        NULL,
        'PASSENGER'
    ),
    (
        'Passenger Two',
        'passenger2@example.com',
        NULL,
        'PASSENGER'
    ),
    (
        'Officer One',
        'officer1@example.com',
        NULL,
        'OFFICER'
    ),
    (
        'Officer Two',
        'officer2@example.com',
        NULL,
        'OFFICER'
    );