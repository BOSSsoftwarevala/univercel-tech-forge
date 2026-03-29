// Global Mock Data Generator with Location-Based Data

// ============ LOCATIONS ============
export const continents = [
  { id: 'asia', name: 'Asia', code: 'AS', flag: '🌏' },
  { id: 'europe', name: 'Europe', code: 'EU', flag: '🇪🇺' },
  { id: 'north-america', name: 'North America', code: 'NA', flag: '🌎' },
  { id: 'south-america', name: 'South America', code: 'SA', flag: '🌎' },
  { id: 'africa', name: 'Africa', code: 'AF', flag: '🌍' },
  { id: 'australia', name: 'Australia/Oceania', code: 'OC', flag: '🌏' },
  { id: 'middle-east', name: 'Middle East', code: 'ME', flag: '🌍' },
];

export const countriesData = {
  'asia': [
    { code: 'IN', name: 'India', cities: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata', 'Pune', 'Ahmedabad'], currency: 'INR', language: 'Hindi, English' },
    { code: 'JP', name: 'Japan', cities: ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama', 'Nagoya', 'Sapporo'], currency: 'JPY', language: 'Japanese' },
    { code: 'CN', name: 'China', cities: ['Shanghai', 'Beijing', 'Shenzhen', 'Guangzhou', 'Chengdu', 'Hangzhou'], currency: 'CNY', language: 'Mandarin' },
    { code: 'SG', name: 'Singapore', cities: ['Singapore'], currency: 'SGD', language: 'English, Mandarin' },
    { code: 'KR', name: 'South Korea', cities: ['Seoul', 'Busan', 'Incheon', 'Daegu'], currency: 'KRW', language: 'Korean' },
    { code: 'TH', name: 'Thailand', cities: ['Bangkok', 'Chiang Mai', 'Pattaya', 'Phuket'], currency: 'THB', language: 'Thai' },
    { code: 'MY', name: 'Malaysia', cities: ['Kuala Lumpur', 'Penang', 'Johor Bahru'], currency: 'MYR', language: 'Malay, English' },
    { code: 'ID', name: 'Indonesia', cities: ['Jakarta', 'Bali', 'Surabaya', 'Bandung'], currency: 'IDR', language: 'Indonesian' },
  ],
  'europe': [
    { code: 'GB', name: 'United Kingdom', cities: ['London', 'Manchester', 'Birmingham', 'Edinburgh', 'Glasgow', 'Liverpool'], currency: 'GBP', language: 'English' },
    { code: 'DE', name: 'Germany', cities: ['Berlin', 'Munich', 'Frankfurt', 'Hamburg', 'Cologne', 'Stuttgart'], currency: 'EUR', language: 'German' },
    { code: 'FR', name: 'France', cities: ['Paris', 'Lyon', 'Marseille', 'Nice', 'Toulouse', 'Bordeaux'], currency: 'EUR', language: 'French' },
    { code: 'IT', name: 'Italy', cities: ['Rome', 'Milan', 'Florence', 'Venice', 'Naples', 'Turin'], currency: 'EUR', language: 'Italian' },
    { code: 'ES', name: 'Spain', cities: ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Bilbao'], currency: 'EUR', language: 'Spanish' },
    { code: 'NL', name: 'Netherlands', cities: ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht'], currency: 'EUR', language: 'Dutch' },
    { code: 'CH', name: 'Switzerland', cities: ['Zurich', 'Geneva', 'Basel', 'Bern'], currency: 'CHF', language: 'German, French' },
    { code: 'SE', name: 'Sweden', cities: ['Stockholm', 'Gothenburg', 'Malmö'], currency: 'SEK', language: 'Swedish' },
  ],
  'north-america': [
    { code: 'US', name: 'United States', cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami', 'San Francisco', 'Seattle', 'Boston', 'Dallas', 'Atlanta'], currency: 'USD', language: 'English' },
    { code: 'CA', name: 'Canada', cities: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'Edmonton'], currency: 'CAD', language: 'English, French' },
    { code: 'MX', name: 'Mexico', cities: ['Mexico City', 'Guadalajara', 'Monterrey', 'Cancun', 'Tijuana'], currency: 'MXN', language: 'Spanish' },
  ],
  'south-america': [
    { code: 'BR', name: 'Brazil', cities: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza'], currency: 'BRL', language: 'Portuguese' },
    { code: 'AR', name: 'Argentina', cities: ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza'], currency: 'ARS', language: 'Spanish' },
    { code: 'CO', name: 'Colombia', cities: ['Bogotá', 'Medellín', 'Cartagena', 'Cali'], currency: 'COP', language: 'Spanish' },
    { code: 'CL', name: 'Chile', cities: ['Santiago', 'Valparaíso', 'Concepción'], currency: 'CLP', language: 'Spanish' },
    { code: 'PE', name: 'Peru', cities: ['Lima', 'Cusco', 'Arequipa'], currency: 'PEN', language: 'Spanish' },
  ],
  'africa': [
    { code: 'ZA', name: 'South Africa', cities: ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria'], currency: 'ZAR', language: 'English, Zulu' },
    { code: 'NG', name: 'Nigeria', cities: ['Lagos', 'Abuja', 'Kano', 'Ibadan'], currency: 'NGN', language: 'English' },
    { code: 'EG', name: 'Egypt', cities: ['Cairo', 'Alexandria', 'Giza', 'Luxor'], currency: 'EGP', language: 'Arabic' },
    { code: 'KE', name: 'Kenya', cities: ['Nairobi', 'Mombasa', 'Kisumu'], currency: 'KES', language: 'Swahili, English' },
    { code: 'MA', name: 'Morocco', cities: ['Casablanca', 'Marrakesh', 'Rabat', 'Fez'], currency: 'MAD', language: 'Arabic, French' },
    { code: 'GH', name: 'Ghana', cities: ['Accra', 'Kumasi', 'Tamale'], currency: 'GHS', language: 'English' },
  ],
  'australia': [
    { code: 'AU', name: 'Australia', cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'], currency: 'AUD', language: 'English' },
    { code: 'NZ', name: 'New Zealand', cities: ['Auckland', 'Wellington', 'Christchurch', 'Queenstown'], currency: 'NZD', language: 'English' },
    { code: 'FJ', name: 'Fiji', cities: ['Suva', 'Nadi'], currency: 'FJD', language: 'English, Fijian' },
  ],
  'middle-east': [
    { code: 'AE', name: 'UAE', cities: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman'], currency: 'AED', language: 'Arabic, English' },
    { code: 'SA', name: 'Saudi Arabia', cities: ['Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam'], currency: 'SAR', language: 'Arabic' },
    { code: 'QA', name: 'Qatar', cities: ['Doha', 'Al Wakrah'], currency: 'QAR', language: 'Arabic' },
    { code: 'KW', name: 'Kuwait', cities: ['Kuwait City', 'Al Ahmadi'], currency: 'KWD', language: 'Arabic' },
    { code: 'BH', name: 'Bahrain', cities: ['Manama', 'Riffa'], currency: 'BHD', language: 'Arabic' },
    { code: 'OM', name: 'Oman', cities: ['Muscat', 'Salalah'], currency: 'OMR', language: 'Arabic' },
  ],
};

// ============ NAME GENERATORS ============
const firstNames = {
  'asia': ['Raj', 'Priya', 'Amit', 'Sita', 'Vikram', 'Ananya', 'Arjun', 'Meera', 'Ravi', 'Lakshmi', 'Wei', 'Mei', 'Hiroshi', 'Yuki', 'Min-jun', 'Ji-yeon', 'Somchai', 'Niran'],
  'europe': ['James', 'Emma', 'Hans', 'Sophia', 'Pierre', 'Isabella', 'Marco', 'Anna', 'Lars', 'Elena', 'Oliver', 'Charlotte', 'William', 'Victoria', 'Henrik', 'Astrid'],
  'north-america': ['Michael', 'Jennifer', 'David', 'Sarah', 'John', 'Emily', 'Robert', 'Ashley', 'Carlos', 'Maria', 'Brian', 'Jessica', 'Chris', 'Amanda', 'Kevin', 'Nicole'],
  'south-america': ['Lucas', 'Ana', 'Gabriel', 'Sofia', 'Mateo', 'Valentina', 'Diego', 'Camila', 'Santiago', 'Isabella', 'Sebastian', 'Mariana', 'Nicolas', 'Paula'],
  'africa': ['Kwame', 'Amina', 'Chidi', 'Fatima', 'Olumide', 'Zainab', 'Nelson', 'Grace', 'Ahmed', 'Aisha', 'Emmanuel', 'Ruth', 'Kofi', 'Nana'],
  'australia': ['Jack', 'Olivia', 'Liam', 'Ava', 'Noah', 'Chloe', 'Ethan', 'Mia', 'William', 'Sophie', 'Thomas', 'Lucy', 'Cooper', 'Zoe'],
  'middle-east': ['Mohammed', 'Fatima', 'Ahmed', 'Aisha', 'Ali', 'Mariam', 'Omar', 'Sara', 'Hassan', 'Layla', 'Khalid', 'Noor', 'Yusuf', 'Hana'],
};

const lastNames = {
  'asia': ['Sharma', 'Patel', 'Singh', 'Kumar', 'Chen', 'Wang', 'Li', 'Tanaka', 'Kim', 'Park', 'Nguyen', 'Tran'],
  'europe': ['Smith', 'Mueller', 'Garcia', 'Rossi', 'Dubois', 'Anderson', 'Van Berg', 'Johansson', 'Brown', 'Wilson'],
  'north-america': ['Johnson', 'Williams', 'Brown', 'Jones', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson'],
  'south-america': ['Silva', 'Santos', 'Oliveira', 'Rodriguez', 'Martinez', 'Gonzalez', 'Lopez', 'Hernandez'],
  'africa': ['Okafor', 'Mensah', 'Diallo', 'Banda', 'Nkomo', 'Ibrahim', 'Hassan', 'Mwangi', 'Asante'],
  'australia': ['Williams', 'Brown', 'Wilson', 'Taylor', 'Johnson', 'White', 'Martin', 'Thompson'],
  'middle-east': ['Al-Rashid', 'Al-Farsi', 'Khan', 'Al-Hashim', 'Mansoor', 'Al-Maktoum', 'Qasim', 'Al-Saud'],
};

// ============ RANDOM GENERATORS ============
export const random = {
  number: (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min,
  float: (min: number, max: number, decimals = 2) => parseFloat((Math.random() * (max - min) + min).toFixed(decimals)),
  pick: <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)],
  pickMultiple: <T>(arr: T[], count: number): T[] => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  },
  bool: (probability = 0.5) => Math.random() < probability,
  date: (daysAgo: number = 30) => {
    const date = new Date();
    date.setDate(date.getDate() - random.number(0, daysAgo));
    return date;
  },
  time: () => `${random.number(0, 23).toString().padStart(2, '0')}:${random.number(0, 59).toString().padStart(2, '0')}`,
  id: (prefix: string = 'ID') => `${prefix}-${random.number(100000, 999999)}`,
  uuid: () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  }),
};

// ============ DATA GENERATORS ============
export const generatePerson = (continent?: string) => {
  const cont = continent || random.pick(Object.keys(firstNames));
  const contKey = cont as keyof typeof firstNames;
  const firstName = random.pick(firstNames[contKey] || firstNames['asia']);
  const lastName = random.pick(lastNames[contKey] || lastNames['asia']);
  const countries = countriesData[cont as keyof typeof countriesData] || countriesData['asia'];
  const country = random.pick(countries);
  const city = random.pick(country.cities);
  
  return {
    id: random.uuid(),
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
    phone: `+${random.number(1, 99)}-${random.number(100, 999)}-${random.number(1000000, 9999999)}`,
    country: country.name,
    countryCode: country.code,
    city,
    currency: country.currency,
    language: country.language,
    continent: cont,
  };
};

export const generateTask = (assignee?: string) => {
  const taskTypes = ['Feature', 'Bug Fix', 'Enhancement', 'Documentation', 'Testing', 'Refactoring', 'API Integration', 'UI Design', 'Performance', 'Security'];
  const modules = ['Payment Gateway', 'User Authentication', 'Dashboard Analytics', 'Notification System', 'Report Generator', 'API Gateway', 'Mobile App', 'Admin Panel', 'Inventory Management', 'Order Processing'];
  const priorities = ['urgent', 'high', 'medium', 'low'];
  const statuses = ['pending', 'in_progress', 'review', 'completed', 'blocked'];
  
  const taskType = random.pick(taskTypes);
  const module = random.pick(modules);
  
  return {
    id: random.id('TASK'),
    title: `${taskType}: ${module}`,
    description: `Implement ${taskType.toLowerCase()} for ${module.toLowerCase()} module`,
    priority: random.pick(priorities),
    status: random.pick(statuses),
    progress: random.number(0, 100),
    estimatedHours: random.number(2, 40),
    actualHours: random.number(0, 35),
    assignee: assignee || generatePerson().fullName,
    createdAt: random.date(30),
    deadline: random.date(-7), // Future date
    module,
    tags: random.pickMultiple(['frontend', 'backend', 'api', 'database', 'ui', 'testing', 'security'], random.number(1, 3)),
  };
};

export const generateBug = () => {
  const severities = ['low', 'medium', 'high', 'critical'];
  const statuses = ['open', 'in_progress', 'fixed', 'closed', 'reopened'];
  const bugTitles = [
    'Payment fails on mobile devices',
    'Dashboard charts not loading',
    'Session timeout not working',
    'Filter dropdown overlaps content',
    'Memory leak in real-time updates',
    'Search results incorrect',
    'Date picker showing wrong format',
    'Export to PDF fails',
    'Notification not appearing',
    'Login redirect loop',
    'Form validation not triggered',
    'API rate limiting issues',
    'Image upload size exceeded',
    'Currency conversion error',
    'Timezone display incorrect',
  ];
  
  return {
    id: random.id('BUG'),
    title: random.pick(bugTitles),
    description: `Reported by user in ${generatePerson().city}`,
    severity: random.pick(severities),
    status: random.pick(statuses),
    reportedBy: generatePerson().fullName,
    assignedTo: random.bool(0.7) ? generatePerson().fullName : null,
    reportedAt: random.date(14),
    resolvedAt: random.bool(0.3) ? random.date(7) : null,
    linkedTaskId: random.bool(0.5) ? random.id('TASK') : null,
    aiSuggestion: random.bool(0.6) ? 'Consider checking the component lifecycle and cleanup functions.' : null,
  };
};

export const generateLead = () => {
  const sources = ['Website', 'LinkedIn', 'Referral', 'Google Ads', 'Facebook', 'Email Campaign', 'Trade Show', 'Partner', 'Cold Call', 'Organic Search'];
  const statuses = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];
  const interests = ['Enterprise Plan', 'Pro Plan', 'Custom Solution', 'API Access', 'White Label', 'Franchise', 'Reseller Partnership'];
  const person = generatePerson();
  
  return {
    id: random.id('LEAD'),
    ...person,
    company: `${person.lastName} ${random.pick(['Technologies', 'Solutions', 'Industries', 'Corp', 'Group', 'Enterprises', 'Ltd'])}`,
    source: random.pick(sources),
    status: random.pick(statuses),
    interest: random.pick(interests),
    value: random.number(5000, 500000),
    aiScore: random.number(20, 99),
    spamScore: random.number(0, 40),
    completeness: random.number(60, 100),
    createdAt: random.date(60),
    lastContact: random.date(7),
    notes: `Lead from ${person.city}, ${person.country}`,
  };
};

export const generateFranchise = () => {
  const person = generatePerson();
  const statuses = ['active', 'pending', 'suspended', 'inactive'];
  
  return {
    id: random.id('FRN'),
    name: `${person.city} Franchise`,
    owner: person.fullName,
    email: person.email,
    phone: person.phone,
    country: person.country,
    city: person.city,
    status: random.pick(statuses),
    resellers: random.number(5, 50),
    totalSales: random.number(50000, 5000000),
    monthlyRevenue: random.number(10000, 500000),
    commission: random.float(5, 15),
    joinedAt: random.date(365),
    lastActive: random.date(3),
    rating: random.float(3.5, 5),
    performance: random.number(60, 100),
  };
};

export const generateReseller = () => {
  const person = generatePerson();
  const statuses = ['active', 'pending', 'suspended'];
  
  return {
    id: random.id('RSL'),
    name: person.fullName,
    businessName: `${person.lastName} Sales`,
    email: person.email,
    phone: person.phone,
    country: person.country,
    city: person.city,
    status: random.pick(statuses),
    franchiseId: random.id('FRN'),
    totalSales: random.number(10000, 1000000),
    monthlyRevenue: random.number(5000, 100000),
    clients: random.number(10, 200),
    commission: random.float(10, 25),
    joinedAt: random.date(180),
    rating: random.float(3, 5),
  };
};

export const generateInfluencer = () => {
  const person = generatePerson();
  const platforms = ['Instagram', 'YouTube', 'TikTok', 'Twitter', 'LinkedIn', 'Facebook'];
  const tiers = ['nano', 'micro', 'mid', 'macro', 'mega'];
  
  return {
    id: random.id('INF'),
    name: person.fullName,
    handle: `@${person.firstName.toLowerCase()}${random.number(100, 999)}`,
    email: person.email,
    country: person.country,
    city: person.city,
    platform: random.pick(platforms),
    tier: random.pick(tiers),
    followers: random.number(1000, 10000000),
    engagement: random.float(1, 10),
    totalEarnings: random.number(1000, 500000),
    pendingPayout: random.number(100, 50000),
    campaigns: random.number(1, 50),
    conversionRate: random.float(0.5, 8),
    status: random.pick(['active', 'pending', 'paused']),
  };
};

export const generateTransaction = () => {
  const types = ['payment', 'refund', 'commission', 'payout', 'fee', 'bonus'];
  const statuses = ['completed', 'pending', 'failed', 'processing'];
  const person = generatePerson();
  
  return {
    id: random.id('TXN'),
    type: random.pick(types),
    amount: random.number(100, 50000),
    currency: person.currency,
    status: random.pick(statuses),
    from: person.fullName,
    to: generatePerson().fullName,
    country: person.country,
    createdAt: random.date(30),
    processedAt: random.bool(0.7) ? random.date(7) : null,
    reference: random.id('REF'),
  };
};

export const generateNotification = () => {
  const types = ['alert', 'warning', 'info', 'success', 'error'];
  const titles = [
    'New lead assigned to you',
    'Task deadline approaching',
    'Payment received',
    'Bug reported in your module',
    'Code review requested',
    'Meeting scheduled',
    'Performance report ready',
    'New franchise application',
    'Commission credited',
    'System maintenance scheduled',
  ];
  
  return {
    id: random.uuid(),
    type: random.pick(types),
    title: random.pick(titles),
    message: `Action required in ${generatePerson().city} region`,
    read: random.bool(0.3),
    createdAt: random.date(7),
    priority: random.pick(['low', 'medium', 'high']),
  };
};

export const generateAuditLog = () => {
  const actions = ['login', 'logout', 'create', 'update', 'delete', 'approve', 'reject', 'export', 'import', 'view'];
  const modules = ['users', 'tasks', 'leads', 'payments', 'reports', 'settings', 'franchises', 'resellers'];
  const person = generatePerson();
  
  return {
    id: random.uuid(),
    action: random.pick(actions),
    module: random.pick(modules),
    user: person.fullName,
    userId: person.id,
    ip: `${random.number(1, 255)}.${random.number(0, 255)}.${random.number(0, 255)}.${random.number(0, 255)}`,
    location: `${person.city}, ${person.country}`,
    timestamp: random.date(30),
    details: `${random.pick(actions)} performed on ${random.pick(modules)}`,
    riskScore: random.number(0, 100),
  };
};

// ============ BATCH GENERATORS ============
export const generateBatch = {
  tasks: (count: number = 10) => Array.from({ length: count }, () => generateTask()),
  bugs: (count: number = 8) => Array.from({ length: count }, () => generateBug()),
  leads: (count: number = 15) => Array.from({ length: count }, () => generateLead()),
  franchises: (count: number = 12) => Array.from({ length: count }, () => generateFranchise()),
  resellers: (count: number = 20) => Array.from({ length: count }, () => generateReseller()),
  influencers: (count: number = 10) => Array.from({ length: count }, () => generateInfluencer()),
  transactions: (count: number = 25) => Array.from({ length: count }, () => generateTransaction()),
  notifications: (count: number = 10) => Array.from({ length: count }, () => generateNotification()),
  auditLogs: (count: number = 50) => Array.from({ length: count }, () => generateAuditLog()),
  people: (count: number = 10, continent?: string) => Array.from({ length: count }, () => generatePerson(continent)),
};

// ============ STATS GENERATORS ============
export const generateDashboardStats = () => ({
  totalUsers: random.number(10000, 100000),
  activeUsers: random.number(5000, 50000),
  newUsersToday: random.number(50, 500),
  totalRevenue: random.number(1000000, 50000000),
  monthlyRevenue: random.number(100000, 5000000),
  pendingApprovals: random.number(5, 50),
  openTickets: random.number(10, 100),
  resolvedToday: random.number(20, 80),
  conversionRate: random.float(2, 15),
  growthRate: random.float(-5, 25),
});

export const generateLocationStats = (continent?: string) => {
  const countries = countriesData[continent as keyof typeof countriesData] || countriesData['asia'];
  
  return countries.map(country => ({
    country: country.name,
    code: country.code,
    currency: country.currency,
    users: random.number(100, 10000),
    revenue: random.number(10000, 1000000),
    leads: random.number(50, 500),
    franchises: random.number(1, 20),
    resellers: random.number(5, 100),
    growth: random.float(-10, 30),
    topCity: random.pick(country.cities),
  }));
};

// ============ TIME-SERIES DATA ============
export const generateTimeSeriesData = (days: number = 30) => {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));
    
    return {
      date: date.toISOString().split('T')[0],
      revenue: random.number(10000, 100000),
      users: random.number(100, 1000),
      leads: random.number(20, 200),
      conversions: random.number(5, 50),
      tasks: random.number(10, 100),
    };
  });
};

export const generateHourlyData = () => {
  return Array.from({ length: 24 }, (_, hour) => ({
    hour: `${hour.toString().padStart(2, '0')}:00`,
    requests: random.number(100, 5000),
    errors: random.number(0, 50),
    latency: random.number(50, 500),
    users: random.number(10, 500),
  }));
};

// Default export
export default {
  continents,
  countriesData,
  random,
  generatePerson,
  generateTask,
  generateBug,
  generateLead,
  generateFranchise,
  generateReseller,
  generateInfluencer,
  generateTransaction,
  generateNotification,
  generateAuditLog,
  generateBatch,
  generateDashboardStats,
  generateLocationStats,
  generateTimeSeriesData,
  generateHourlyData,
};
