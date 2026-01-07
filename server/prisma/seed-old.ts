import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log('🧹 Cleaning existing data...');
  await prisma.projectDataset.deleteMany();
  await prisma.datasetResource.deleteMany();
  await prisma.project.deleteMany();
  await prisma.dataset.deleteMany();

  // Create datasets
  const airQualityDataset = await prisma.dataset.upsert({
    where: { slug: 'air-quality-index' },
    update: {},
    create: {
      slug: 'air-quality-index',
      title: 'Air Quality Index (AQI) Data',
      description: 'Real-time air quality measurements across major cities, including PM2.5, PM10, O3, NO2, and CO levels. Updated hourly.',
      category: 'Environment',
      tags: ['air-quality', 'environment', 'health', 'real-time', 'sensors'],
      license: 'CC-BY-4.0',
      sourceOrg: 'Environmental Protection Agency',
      updateFrequency: 'hourly',
      spatialCoverage: {
        type: 'Polygon',
        coordinates: [
          [
            [-180, -90],
            [180, -90],
            [180, 90],
            [-180, 90],
            [-180, -90],
          ],
        ],
      },
      temporalCoverageStart: new Date('2020-01-01'),
      temporalCoverageEnd: new Date(),
      dataFormat: ['CSV', 'JSON', 'API'],
      previewSchema: {
        columns: [
          { name: 'timestamp', type: 'datetime' },
          { name: 'location', type: 'string' },
          { name: 'pm25', type: 'number' },
          { name: 'pm10', type: 'number' },
          { name: 'o3', type: 'number' },
          { name: 'no2', type: 'number' },
          { name: 'aqi', type: 'number' },
        ],
      },
      isPublic: true,
    },
  });

  const trafficDataset = await prisma.dataset.upsert({
    where: { slug: 'traffic-count-data' },
    update: {},
    create: {
      slug: 'traffic-count-data',
      title: 'Vehicle Traffic Count Data',
      description: 'Daily vehicle traffic counts at major intersections and highways. Includes vehicle type classification and peak hour analysis.',
      category: 'Transport',
      tags: ['transport', 'traffic', 'vehicles', 'mobility', 'urban-planning'],
      license: 'ODbL-1.0',
      sourceOrg: 'Department of Transportation',
      updateFrequency: 'daily',
      spatialCoverage: {
        type: 'MultiPoint',
        coordinates: [
          [100.5018, 13.7563], // Bangkok
          [103.8198, 1.3521], // Singapore
          [106.6297, 10.8231], // Ho Chi Minh City
        ],
      },
      temporalCoverageStart: new Date('2019-01-01'),
      temporalCoverageEnd: new Date(),
      dataFormat: ['CSV', 'GeoJSON', 'Shapefile'],
      previewSchema: {
        columns: [
          { name: 'date', type: 'date' },
          { name: 'location_id', type: 'string' },
          { name: 'latitude', type: 'number' },
          { name: 'longitude', type: 'number' },
          { name: 'total_vehicles', type: 'number' },
          { name: 'cars', type: 'number' },
          { name: 'trucks', type: 'number' },
          { name: 'motorcycles', type: 'number' },
        ],
      },
      isPublic: true,
    },
  });

  const demDataset = await prisma.dataset.upsert({
    where: { slug: 'digital-elevation-model' },
    update: {},
    create: {
      slug: 'digital-elevation-model',
      title: 'Digital Elevation Model (DEM)',
      description: 'High-resolution digital elevation model covering mountainous regions. Suitable for terrain analysis, flood modeling, and 3D visualization.',
      category: 'Environment',
      tags: ['dem', 'elevation', 'gis', 'geospatial', 'terrain', 'satellite'],
      license: 'CC-BY-4.0',
      sourceOrg: 'Geological Survey',
      updateFrequency: 'once',
      spatialCoverage: {
        type: 'Polygon',
        coordinates: [
          [
            [90, 20],
            [110, 20],
            [110, 30],
            [90, 30],
            [90, 20],
          ],
        ],
      },
      temporalCoverageStart: new Date('2023-01-01'),
      temporalCoverageEnd: new Date('2023-12-31'),
      dataFormat: ['GeoTIFF', 'TIF', 'ASCII'],
      previewSchema: {
        type: 'raster',
        resolution: '30m',
        projection: 'EPSG:4326',
      },
      isPublic: true,
    },
  });

  // Create resources for datasets
  await prisma.datasetResource.create({
    data: {
      datasetId: airQualityDataset.id,
      resourceType: 'api',
      apiEndpoint: 'https://api.example.com/v1/air-quality',
      fileFormat: 'JSON',
      version: '1.0.0',
    },
  });

  await prisma.datasetResource.create({
    data: {
      datasetId: airQualityDataset.id,
      resourceType: 'file',
      storageUrl: 'datasets/air-quality-index-2024.csv',
      fileFormat: 'CSV',
      size: BigInt(52428800), // 50MB
      hash: 'sha256:abc123...',
      version: '1.0.0',
    },
  });

  await prisma.datasetResource.create({
    data: {
      datasetId: trafficDataset.id,
      resourceType: 'file',
      storageUrl: 'datasets/traffic-counts-2024.zip',
      fileFormat: 'Shapefile',
      size: BigInt(104857600), // 100MB
      hash: 'sha256:def456...',
      version: '2.1.0',
    },
  });

  await prisma.datasetResource.create({
    data: {
      datasetId: demDataset.id,
      resourceType: 'file',
      storageUrl: 'datasets/dem-30m.tif',
      fileFormat: 'GeoTIFF',
      size: BigInt(2147483648), // 2GB
      hash: 'sha256:ghi789...',
      version: '1.0.0',
    },
  });

  // Create projects
  const dashboardProject = await prisma.project.create({
    data: {
      title: 'Real-time Air Quality Dashboard',
      abstract: 'An interactive web dashboard visualizing real-time air quality data across multiple cities. Built with React, D3.js, and Mapbox. Features include historical trends, pollution alerts, and health recommendations.',
      linkType: 'github',
      linkUrl: 'https://github.com/example/air-quality-dashboard',
      authors: ['Jane Smith', 'John Doe'],
      tags: ['dashboard', 'visualization', 'react', 'd3.js', 'real-time'],
    },
  });

  const trafficAnalysisProject = await prisma.project.create({
    data: {
      title: 'Urban Traffic Pattern Analysis',
      abstract: 'Machine learning analysis of traffic patterns to predict congestion and optimize traffic light timing. Uses LSTM networks and time-series forecasting.',
      linkType: 'paper',
      linkUrl: 'https://arxiv.org/abs/2024.12345',
      authors: ['Dr. Alice Johnson', 'Bob Wilson'],
      tags: ['machine-learning', 'traffic', 'lstm', 'optimization', 'research'],
    },
  });

  const gisProject = await prisma.project.create({
    data: {
      title: '3D Terrain Visualization with DEM Data',
      abstract: 'Interactive 3D terrain visualization using Three.js and QGIS. Demonstrates how to load and render high-resolution DEM data in web browsers.',
      linkType: 'demo',
      linkUrl: 'https://demo.example.com/terrain-3d',
      authors: ['Charlie Brown'],
      tags: ['gis', 'three.js', '3d', 'visualization', 'qgis'],
    },
  });

  // Link projects to datasets
  await prisma.projectDataset.create({
    data: {
      projectId: dashboardProject.id,
      datasetId: airQualityDataset.id,
    },
  });

  await prisma.projectDataset.create({
    data: {
      projectId: trafficAnalysisProject.id,
      datasetId: trafficDataset.id,
    },
  });

  await prisma.projectDataset.create({
    data: {
      projectId: gisProject.id,
      datasetId: demDataset.id,
    },
  });

  console.log('✅ Seeding completed!');
  console.log(`   - Created ${await prisma.dataset.count()} datasets`);
  console.log(`   - Created ${await prisma.datasetResource.count()} resources`);
  console.log(`   - Created ${await prisma.project.count()} projects`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

