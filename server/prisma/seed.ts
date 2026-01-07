import { PrismaClient, UserRole, DatasetStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Dataset definitions for all 10 categories (5 each)
const datasetDefinitions = [
  // Arts & Culture (5)
  { category: 'Arts & Culture', title: 'Museum Collections Database', description: 'Comprehensive catalog of artifacts and cultural items', tags: ['museum', 'heritage'], sourceOrg: 'Department of Culture', updateFrequency: 'monthly', columns: ['artifact_id', 'name', 'category', 'period', 'location'] },
  { category: 'Arts & Culture', title: 'Cultural Events Calendar', description: 'Annual calendar of festivals and cultural events', tags: ['festivals', 'events'], sourceOrg: 'Ministry of Home and Cultural Affairs', updateFrequency: 'yearly', columns: ['event_id', 'name', 'date', 'location', 'district'] },
  { category: 'Arts & Culture', title: 'Heritage Sites Registry', description: 'Registry of UNESCO and national heritage sites', tags: ['heritage', 'monuments'], sourceOrg: 'Department of Culture', updateFrequency: 'quarterly', columns: ['site_id', 'name', 'type', 'district', 'latitude', 'longitude'] },
  { category: 'Arts & Culture', title: 'Art Exhibitions Archive', description: 'Historical record of art exhibitions and galleries', tags: ['art', 'exhibitions'], sourceOrg: 'Royal Academy of Arts', updateFrequency: 'monthly', columns: ['exhibition_id', 'title', 'venue', 'start_date', 'end_date'] },
  { category: 'Arts & Culture', title: 'Cultural Funding Programs', description: 'Database of funding programs for arts and culture', tags: ['funding', 'grants'], sourceOrg: 'Ministry of Finance', updateFrequency: 'quarterly', columns: ['grant_id', 'program_name', 'recipient', 'amount', 'year'] },
  
  // Education (5)
  { category: 'Education', title: 'School Enrollment Statistics', description: 'Annual enrollment data for all schools across Bhutan', tags: ['education', 'enrollment'], sourceOrg: 'Ministry of Education', updateFrequency: 'yearly', columns: ['school_id', 'name', 'district', 'students', 'teachers', 'year'] },
  { category: 'Education', title: 'Student Performance Metrics', description: 'Academic performance data and examination results', tags: ['education', 'performance'], sourceOrg: 'Bhutan Council for School Examinations', updateFrequency: 'yearly', columns: ['student_id', 'school', 'grade', 'subject', 'score', 'year'] },
  { category: 'Education', title: 'Teacher Qualifications Database', description: 'Registry of teacher qualifications and certifications', tags: ['education', 'teachers'], sourceOrg: 'Ministry of Education', updateFrequency: 'quarterly', columns: ['teacher_id', 'name', 'qualification', 'subject', 'school', 'experience_years'] },
  { category: 'Education', title: 'Library Resources Inventory', description: 'Catalog of books and resources in public and school libraries', tags: ['education', 'libraries'], sourceOrg: 'National Library', updateFrequency: 'monthly', columns: ['book_id', 'title', 'author', 'library', 'category', 'available'] },
  { category: 'Education', title: 'Education Budget Allocation', description: 'Annual budget allocation for education sector', tags: ['education', 'budget'], sourceOrg: 'Ministry of Finance', updateFrequency: 'yearly', columns: ['year', 'district', 'budget_allocation', 'expenditure', 'category'] },
  
  // Economy (5)
  { category: 'Economy', title: 'GDP Growth Statistics', description: 'Quarterly GDP data and economic growth indicators', tags: ['economy', 'gdp'], sourceOrg: 'National Statistics Bureau', updateFrequency: 'quarterly', columns: ['quarter', 'year', 'gdp_value', 'growth_rate', 'sector'] },
  { category: 'Economy', title: 'Employment Rate Data', description: 'Monthly employment statistics by sector and region', tags: ['economy', 'employment'], sourceOrg: 'Ministry of Labour', updateFrequency: 'monthly', columns: ['month', 'year', 'sector', 'employed', 'unemployed', 'rate'] },
  { category: 'Economy', title: 'Business Registration Records', description: 'Database of registered businesses and enterprises', tags: ['economy', 'business'], sourceOrg: 'Ministry of Economic Affairs', updateFrequency: 'monthly', columns: ['business_id', 'name', 'type', 'registration_date', 'district', 'status'] },
  { category: 'Economy', title: 'Trade Statistics', description: 'Import and export data by commodity and country', tags: ['economy', 'trade'], sourceOrg: 'Department of Revenue and Customs', updateFrequency: 'monthly', columns: ['month', 'commodity', 'country', 'type', 'value', 'quantity'] },
  { category: 'Economy', title: 'Inflation Rate Indicators', description: 'Monthly consumer price index and inflation data', tags: ['economy', 'inflation'], sourceOrg: 'National Statistics Bureau', updateFrequency: 'monthly', columns: ['month', 'year', 'cpi', 'inflation_rate', 'category'] },
  
  // Environment (5)
  { category: 'Environment', title: 'Air Quality Monitoring Data', description: 'Real-time air quality measurements across monitoring stations', tags: ['environment', 'air-quality'], sourceOrg: 'National Environment Commission', updateFrequency: 'hourly', columns: ['timestamp', 'station_id', 'pm25', 'pm10', 'aqi', 'location'] },
  { category: 'Environment', title: 'Water Quality Database', description: 'Water quality testing results from rivers and water sources', tags: ['environment', 'water'], sourceOrg: 'Ministry of Agriculture', updateFrequency: 'weekly', columns: ['sample_id', 'location', 'date', 'ph', 'turbidity', 'contaminants'] },
  { category: 'Environment', title: 'Biodiversity Survey Data', description: 'Wildlife and plant species inventory and monitoring', tags: ['environment', 'biodiversity'], sourceOrg: 'Department of Forests', updateFrequency: 'yearly', columns: ['species_id', 'name', 'category', 'location', 'population', 'status'] },
  { category: 'Environment', title: 'Waste Management Statistics', description: 'Waste collection, recycling, and disposal data', tags: ['environment', 'waste'], sourceOrg: 'Thimphu City Corporation', updateFrequency: 'monthly', columns: ['month', 'district', 'waste_collected', 'recycled', 'disposed', 'type'] },
  { category: 'Environment', title: 'Climate Data Archive', description: 'Historical temperature, precipitation, and weather patterns', tags: ['environment', 'climate'], sourceOrg: 'Department of Hydromet Services', updateFrequency: 'daily', columns: ['date', 'station', 'temperature', 'precipitation', 'humidity', 'wind_speed'] },
  
  // Geospatial (5)
  { category: 'Geospatial', title: 'Administrative Boundaries', description: 'Digital boundaries of districts, gewogs, and villages', tags: ['geospatial', 'boundaries'], sourceOrg: 'National Land Commission', updateFrequency: 'yearly', columns: ['boundary_id', 'name', 'type', 'area_km2', 'population'] },
  { category: 'Geospatial', title: 'Land Use Classification', description: 'Land use and land cover mapping data', tags: ['geospatial', 'land-use'], sourceOrg: 'Ministry of Agriculture', updateFrequency: 'yearly', columns: ['parcel_id', 'land_type', 'area_hectares', 'district', 'coordinates'] },
  { category: 'Geospatial', title: 'Elevation and Terrain Data', description: 'Digital elevation model and terrain characteristics', tags: ['geospatial', 'elevation'], sourceOrg: 'Department of Survey', updateFrequency: 'once', columns: ['point_id', 'latitude', 'longitude', 'elevation', 'slope', 'aspect'] },
  { category: 'Geospatial', title: 'Transportation Network', description: 'Roads, bridges, and transportation infrastructure', tags: ['geospatial', 'transport'], sourceOrg: 'Ministry of Works', updateFrequency: 'quarterly', columns: ['road_id', 'name', 'type', 'length_km', 'condition', 'district'] },
  { category: 'Geospatial', title: 'Points of Interest', description: 'Locations of hospitals, schools, government offices, and landmarks', tags: ['geospatial', 'poi'], sourceOrg: 'National Statistics Bureau', updateFrequency: 'monthly', columns: ['poi_id', 'name', 'type', 'latitude', 'longitude', 'district'] },
  
  // Housing (5)
  { category: 'Housing', title: 'Housing Price Index', description: 'Real estate prices and housing market trends', tags: ['housing', 'prices'], sourceOrg: 'Ministry of Works', updateFrequency: 'quarterly', columns: ['quarter', 'district', 'property_type', 'price_per_sqm', 'average_price'] },
  { category: 'Housing', title: 'Building Permits Issued', description: 'Records of building permits and construction approvals', tags: ['housing', 'permits'], sourceOrg: 'Thimphu City Corporation', updateFrequency: 'monthly', columns: ['permit_id', 'applicant', 'location', 'type', 'area_sqm', 'issue_date'] },
  { category: 'Housing', title: 'Rental Market Data', description: 'Rental prices and availability by location and type', tags: ['housing', 'rental'], sourceOrg: 'Ministry of Works', updateFrequency: 'monthly', columns: ['listing_id', 'location', 'type', 'rent_per_month', 'area_sqm', 'available'] },
  { category: 'Housing', title: 'Housing Stock Inventory', description: 'Total housing units by type, district, and occupancy', tags: ['housing', 'inventory'], sourceOrg: 'National Statistics Bureau', updateFrequency: 'yearly', columns: ['district', 'total_units', 'occupied', 'vacant', 'type', 'year'] },
  { category: 'Housing', title: 'Housing Demographics', description: 'Household composition and housing characteristics', tags: ['housing', 'demographics'], sourceOrg: 'National Statistics Bureau', updateFrequency: 'yearly', columns: ['household_id', 'district', 'household_size', 'housing_type', 'ownership', 'year'] },
  
  // Health (5)
  { category: 'Health', title: 'Hospital Admissions Data', description: 'Patient admission records and hospital statistics', tags: ['health', 'hospitals'], sourceOrg: 'Ministry of Health', updateFrequency: 'monthly', columns: ['admission_id', 'hospital', 'date', 'diagnosis', 'age', 'gender'] },
  { category: 'Health', title: 'Disease Prevalence Statistics', description: 'Incidence and prevalence of diseases by region', tags: ['health', 'diseases'], sourceOrg: 'Ministry of Health', updateFrequency: 'monthly', columns: ['disease_id', 'name', 'cases', 'district', 'month', 'year'] },
  { category: 'Health', title: 'Vaccination Coverage Data', description: 'Immunization rates and vaccination program statistics', tags: ['health', 'vaccination'], sourceOrg: 'Ministry of Health', updateFrequency: 'monthly', columns: ['vaccine_id', 'name', 'doses_administered', 'district', 'age_group', 'month'] },
  { category: 'Health', title: 'Health Facilities Directory', description: 'Registry of hospitals, clinics, and health centers', tags: ['health', 'facilities'], sourceOrg: 'Ministry of Health', updateFrequency: 'quarterly', columns: ['facility_id', 'name', 'type', 'district', 'latitude', 'longitude'] },
  { category: 'Health', title: 'Public Health Indicators', description: 'Key health metrics including life expectancy and mortality', tags: ['health', 'indicators'], sourceOrg: 'Ministry of Health', updateFrequency: 'yearly', columns: ['indicator_id', 'name', 'value', 'district', 'year', 'category'] },
  
  // Social (5)
  { category: 'Social', title: 'Population Census Data', description: 'Demographic data from national population census', tags: ['social', 'census'], sourceOrg: 'National Statistics Bureau', updateFrequency: 'yearly', columns: ['district', 'total_population', 'male', 'female', 'age_group', 'year'] },
  { category: 'Social', title: 'Social Services Directory', description: 'Directory of social welfare programs and services', tags: ['social', 'services'], sourceOrg: 'Ministry of Education', updateFrequency: 'quarterly', columns: ['service_id', 'name', 'type', 'district', 'beneficiaries', 'status'] },
  { category: 'Social', title: 'Crime Statistics', description: 'Reported crimes by type, location, and resolution status', tags: ['social', 'crime'], sourceOrg: 'Royal Bhutan Police', updateFrequency: 'monthly', columns: ['case_id', 'type', 'district', 'date', 'status', 'resolution'] },
  { category: 'Social', title: 'Community Centers Registry', description: 'Locations and services of community centers and facilities', tags: ['social', 'community'], sourceOrg: 'Ministry of Home Affairs', updateFrequency: 'quarterly', columns: ['center_id', 'name', 'district', 'services', 'capacity', 'status'] },
  { category: 'Social', title: 'Social Programs Database', description: 'Government and NGO social assistance programs', tags: ['social', 'programs'], sourceOrg: 'Ministry of Finance', updateFrequency: 'quarterly', columns: ['program_id', 'name', 'type', 'beneficiaries', 'budget', 'status'] },
  
  // Transport (5)
  { category: 'Transport', title: 'Public Transit Ridership', description: 'Passenger counts and usage statistics for public transport', tags: ['transport', 'public-transit'], sourceOrg: 'Department of Transport', updateFrequency: 'monthly', columns: ['route_id', 'route_name', 'passengers', 'month', 'year', 'revenue'] },
  { category: 'Transport', title: 'Traffic Count Data', description: 'Vehicle counts at major intersections and highways', tags: ['transport', 'traffic'], sourceOrg: 'Department of Transport', updateFrequency: 'daily', columns: ['count_id', 'location', 'date', 'vehicles', 'peak_hour', 'type'] },
  { category: 'Transport', title: 'Road Condition Assessment', description: 'Road quality and maintenance status by segment', tags: ['transport', 'roads'], sourceOrg: 'Ministry of Works', updateFrequency: 'quarterly', columns: ['road_id', 'name', 'condition', 'last_maintenance', 'district', 'length_km'] },
  { category: 'Transport', title: 'Parking Facility Data', description: 'Parking spaces, usage, and availability statistics', tags: ['transport', 'parking'], sourceOrg: 'Thimphu City Corporation', updateFrequency: 'monthly', columns: ['facility_id', 'location', 'spaces', 'occupied', 'revenue', 'month'] },
  { category: 'Transport', title: 'Transit Route Network', description: 'Public transport routes, stops, and schedules', tags: ['transport', 'routes'], sourceOrg: 'Department of Transport', updateFrequency: 'quarterly', columns: ['route_id', 'name', 'stops', 'frequency', 'distance_km', 'status'] },
  
  // Real-time APIs (5)
  { category: 'Real-time APIs', title: 'Live Traffic Monitoring API', description: 'Real-time traffic flow and congestion data', tags: ['real-time', 'traffic'], sourceOrg: 'Department of Transport', updateFrequency: 'real-time', columns: ['timestamp', 'location', 'speed', 'congestion_level', 'vehicles_per_min'] },
  { category: 'Real-time APIs', title: 'Weather Station Network API', description: 'Live weather data from monitoring stations', tags: ['real-time', 'weather'], sourceOrg: 'Department of Hydromet Services', updateFrequency: 'real-time', columns: ['timestamp', 'station_id', 'temperature', 'humidity', 'pressure', 'wind_speed'] },
  { category: 'Real-time APIs', title: 'Public Transport API', description: 'Real-time bus locations and arrival times', tags: ['real-time', 'public-transport'], sourceOrg: 'Department of Transport', updateFrequency: 'real-time', columns: ['timestamp', 'vehicle_id', 'route', 'latitude', 'longitude', 'next_stop'] },
  { category: 'Real-time APIs', title: 'Emergency Services API', description: 'Real-time emergency response and incident data', tags: ['real-time', 'emergency'], sourceOrg: 'Royal Bhutan Police', updateFrequency: 'real-time', columns: ['incident_id', 'type', 'location', 'timestamp', 'status', 'response_time'] },
  { category: 'Real-time APIs', title: 'Energy Consumption API', description: 'Real-time electricity consumption and generation data', tags: ['real-time', 'energy'], sourceOrg: 'Bhutan Power Corporation', updateFrequency: 'real-time', columns: ['timestamp', 'region', 'consumption_mw', 'generation_mw', 'demand', 'supply'] },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  console.log('🧹 Cleaning existing data...');
  await prisma.datasetSubmission.deleteMany();
  await prisma.datasetSchema.deleteMany();
  await prisma.projectDataset.deleteMany();
  await prisma.datasetResource.deleteMany();
  await prisma.project.deleteMany();
  await prisma.dataset.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@zhiten.gov.bt',
      password: adminPassword,
      name: 'System Administrator',
      role: UserRole.ADMIN,
    },
  });

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      password: userPassword,
      name: 'Test User',
      role: UserRole.USER,
    },
  });

  console.log('✅ Created users');

  // Create all datasets
  const datasets = [];
  for (const def of datasetDefinitions) {
    const slug = def.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const dataset = await prisma.dataset.create({
      data: {
        slug,
        title: def.title,
        description: def.description,
        category: def.category,
        tags: def.tags,
        license: 'CC-BY-4.0',
        sourceOrg: def.sourceOrg,
        updateFrequency: def.updateFrequency,
        dataFormat: ['CSV'],
        status: DatasetStatus.APPROVED,
        isPublic: true,
        submittedBy: admin.id,
        previewSchema: {
          columns: def.columns.map((col) => ({
            name: col,
            type: col.includes('id') || col.includes('date') ? 'string' : col.includes('rate') || col.includes('price') || col.includes('value') ? 'number' : 'string',
          })),
        },
      },
    });

    // Create CSV resource placeholder
    await prisma.datasetResource.create({
      data: {
        datasetId: dataset.id,
        resourceType: 'file',
        storageUrl: `datasets/${slug}.csv`,
        fileFormat: 'CSV',
        size: BigInt(Math.floor(100000 + Math.random() * 900000)), // 100KB - 1MB
        hash: `sha256:${Math.random().toString(36).substring(7)}`,
        version: '1.0.0',
      },
    });

    // Create schema
    await prisma.datasetSchema.create({
      data: {
        datasetId: dataset.id,
        fields: def.columns.map((col) => ({
          name: col,
          type: col.includes('id') || col.includes('date') ? 'string' : col.includes('rate') || col.includes('price') || col.includes('value') ? 'number' : 'string',
          description: `${col} field`,
          required: true,
        })),
      },
    });

    datasets.push(dataset);
  }

  console.log(`✅ Created ${datasets.length} datasets`);

  // Create some sample projects
  const projects = [
    {
      title: 'Real-time Air Quality Dashboard',
      abstract: 'Interactive web dashboard visualizing real-time air quality data',
      linkType: 'github',
      linkUrl: 'https://github.com/example/air-quality-dashboard',
      authors: ['Jane Smith', 'John Doe'],
      tags: ['dashboard', 'visualization', 'react'],
      createdBy: admin.id,
    },
    {
      title: 'Urban Traffic Pattern Analysis',
      abstract: 'Machine learning analysis of traffic patterns',
      linkType: 'paper',
      linkUrl: 'https://arxiv.org/abs/2024.12345',
      authors: ['Dr. Alice Johnson'],
      tags: ['machine-learning', 'traffic'],
      createdBy: user.id,
    },
  ];

  for (const projectData of projects) {
    await prisma.project.create({ data: projectData });
  }

  console.log(`✅ Created ${projects.length} projects`);
  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

