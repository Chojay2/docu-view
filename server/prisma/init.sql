-- Manual schema creation for Zhiten Data Portal
-- Run this if Prisma migrations fail

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create datasets table
CREATE TABLE IF NOT EXISTS datasets (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    license TEXT NOT NULL,
    source_org TEXT NOT NULL,
    owner_user_id TEXT,
    update_frequency TEXT NOT NULL,
    spatial_coverage JSONB,
    temporal_coverage_start TIMESTAMP,
    temporal_coverage_end TIMESTAMP,
    data_format TEXT[] DEFAULT '{}',
    preview_schema JSONB,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create dataset_resources table
CREATE TABLE IF NOT EXISTS dataset_resources (
    id TEXT PRIMARY KEY,
    dataset_id TEXT NOT NULL REFERENCES datasets(id) ON DELETE CASCADE,
    resource_type TEXT NOT NULL,
    storage_url TEXT,
    api_endpoint TEXT,
    file_format TEXT,
    size BIGINT,
    hash TEXT,
    version TEXT DEFAULT '1.0.0',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    abstract TEXT,
    link_type TEXT NOT NULL,
    link_url TEXT NOT NULL,
    authors TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create project_datasets junction table
CREATE TABLE IF NOT EXISTS project_datasets (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    dataset_id TEXT NOT NULL REFERENCES datasets(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(project_id, dataset_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_datasets_slug ON datasets(slug);
CREATE INDEX IF NOT EXISTS idx_datasets_category ON datasets(category);
CREATE INDEX IF NOT EXISTS idx_datasets_tags ON datasets USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_datasets_is_public ON datasets(is_public);
CREATE INDEX IF NOT EXISTS idx_dataset_resources_dataset_id ON dataset_resources(dataset_id);
CREATE INDEX IF NOT EXISTS idx_project_datasets_project_id ON project_datasets(project_id);
CREATE INDEX IF NOT EXISTS idx_project_datasets_dataset_id ON project_datasets(dataset_id);

