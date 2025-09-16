-- PostgreSQL Database Schema

-- Create contacts table
CREATE TABLE contact (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contact_history table
CREATE TABLE contact_history (
    id SERIAL PRIMARY KEY,
    contact_id INTEGER NOT NULL REFERENCES contact(id) ON DELETE CASCADE,
    change_type VARCHAR(50) NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE'
    field_name VARCHAR(255), -- NULL for CREATE/DELETE, field name for UPDATE
    old_value TEXT, -- NULL for CREATE, old value for UPDATE/DELETE
    new_value TEXT, -- new value for CREATE/UPDATE, NULL for DELETE
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_contact_email ON contact(email);
CREATE INDEX idx_contact_history_contact_id ON contact_history(contact_id);