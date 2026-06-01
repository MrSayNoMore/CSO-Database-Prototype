// Mock CSO database — realistic South African civil society orgs
const PROVINCES = [
  "Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape",
  "Limpopo", "Mpumalanga", "Free State", "North West", "Northern Cape"
];

const SECTORS = [
  "Education & Literacy", "Health & HIV/AIDS", "Social Development",
  "Gender-Based Violence", "Youth Development", "Early Childhood Dev.",
  "Disability Services", "Environment & Conservation", "Human Rights & Advocacy",
  "Arts, Culture & Heritage", "Food Security", "Housing & Shelter",
  "Skills & Enterprise", "Faith-Based", "Community Safety"
];

const ORG_TYPES = ["NPO", "NPC", "PBO", "Trust", "Voluntary Assoc."];

const DISTRICTS = {
  "Gauteng": ["Johannesburg Metro", "Tshwane Metro", "Ekurhuleni Metro", "Sedibeng", "West Rand"],
  "Western Cape": ["City of Cape Town", "Cape Winelands", "Overberg", "West Coast", "Garden Route", "Central Karoo"],
  "KwaZulu-Natal": ["eThekwini Metro", "uMgungundlovu", "Zululand", "iLembe", "Harry Gwala", "King Cetshwayo", "uThukela", "uMkhanyakude", "Amajuba", "uMzinyathi", "Ugu"],
  "Eastern Cape": ["Nelson Mandela Bay", "Buffalo City", "OR Tambo", "Amathole", "Chris Hani", "Joe Gqabi", "Alfred Nzo", "Sarah Baartman"],
  "Limpopo": ["Capricorn", "Mopani", "Vhembe", "Waterberg", "Sekhukhune"],
  "Mpumalanga": ["Ehlanzeni", "Gert Sibande", "Nkangala"],
  "Free State": ["Mangaung Metro", "Lejweleputswa", "Thabo Mofutsanyana", "Fezile Dabi", "Xhariep"],
  "North West": ["Bojanala", "Dr Kenneth Kaunda", "Dr Ruth Mompati", "Ngaka Modiri Molema"],
  "Northern Cape": ["Frances Baard", "John Taolo Gaetsewe", "Namakwa", "Pixley ka Seme", "ZF Mgcawu"]
};

const CITIES = {
  "Johannesburg Metro": ["Soweto", "Sandton", "Alexandra", "Roodepoort", "Randburg", "Diepsloot"],
  "Tshwane Metro": ["Pretoria", "Mamelodi", "Atteridgeville", "Soshanguve", "Centurion"],
  "Ekurhuleni Metro": ["Tembisa", "Kempton Park", "Springs", "Benoni", "Boksburg", "Katlehong"],
  "City of Cape Town": ["Cape Town CBD", "Khayelitsha", "Mitchells Plain", "Gugulethu", "Bellville", "Langa"],
  "eThekwini Metro": ["Durban CBD", "Umlazi", "KwaMashu", "Phoenix", "Chatsworth", "Inanda"],
  "Nelson Mandela Bay": ["Port Elizabeth", "Uitenhage", "Despatch", "Motherwell"],
  "Buffalo City": ["East London", "King William's Town", "Mdantsane", "Bhisho"],
  "Capricorn": ["Polokwane", "Seshego", "Mankweng"],
  "Mangaung Metro": ["Bloemfontein", "Botshabelo", "Thaba Nchu"],
  "Ehlanzeni": ["Mbombela", "White River", "Hazyview"],
  "Bojanala": ["Rustenburg", "Brits", "Mogwase"],
  "Frances Baard": ["Kimberley", "Hartswater", "Warrenton"]
};

const NAME_PARTS = {
  prefix: ["Ubuntu", "Sizanani", "Sibanye", "Masakhane", "Thuthuzela", "Khanyisa", "Vukuzenzele", "Phaphama", "Ikhwezi", "Lerato",
    "Tsogang", "Bonisanani", "Itireleng", "Kgothatso", "Imbeleko", "Sinethemba", "Ikamva", "Inkululeko", "Vuselela", "Ndlovu",
    "Hope", "Bright", "New Dawn", "Sunrise", "Light", "Open", "Together", "Rising", "Forward", "Phoenix",
    "Akani", "Tshwarelo", "Boitumelo", "Phumelela", "Buhle", "Lethabo", "Nkanyezi", "Siyathuthuka", "Khanya", "Amandla"],
  middle: ["Community", "Family", "Children's", "Women's", "Youth", "Care", "Development", "Wellness", "Education",
    "Support", "Outreach", "Empowerment", "Skills", "Health", "Hope", "Recovery", "Heritage", "Faith", "Rural"],
  suffix: ["Foundation", "Centre", "Trust", "Network", "Initiative", "Project", "Society", "Association",
    "Forum", "Council", "Hub", "House", "Collective", "Alliance", "Services", "Programme", "Institute"]
};

const FIRST_NAMES = ["Thandiwe", "Sipho", "Naledi", "Lwazi", "Nomvula", "Mandla", "Zanele", "Bongani", "Lerato", "Kgomotso",
  "Refilwe", "Themba", "Nokuthula", "Sibongile", "Mpho", "Lindiwe", "Tshepo", "Palesa", "Sizwe", "Nontobeko",
  "Anneline", "Pieter", "Marius", "Elsabe", "Johan", "Sarel", "Estie", "Rina", "Wynand", "Ilse",
  "Aisha", "Yusuf", "Fatima", "Rashid", "Zubeida", "Imraan", "Priya", "Rohan", "Kavitha", "Devan"];

const SURNAMES = ["Dlamini", "Nkosi", "Mokoena", "Khumalo", "Mahlangu", "Mthembu", "Ngcobo", "Zulu", "Mokwena", "Sithole",
  "Naidoo", "Pillay", "Govender", "Reddy", "Singh", "van der Merwe", "Botha", "Pretorius", "du Plessis", "Smit",
  "Adams", "Williams", "Jacobs", "Davids", "Petersen", "September", "Hendricks", "Solomons", "October", "April"];

function seed(s) { let x = s; return () => { x = (x * 9301 + 49297) % 233280; return x / 233280; }; }
const rng = seed(42);
const pick = arr => arr[Math.floor(rng() * arr.length)];
const pickN = (arr, n) => { const c = [...arr]; const r = []; for (let i = 0; i < n && c.length; i++) r.push(c.splice(Math.floor(rng() * c.length), 1)[0]); return r; };
const num = (a, b) => Math.floor(rng() * (b - a + 1)) + a;

function genOrgName() {
  const a = pick(NAME_PARTS.prefix);
  const useMiddle = rng() > 0.4;
  const b = useMiddle ? pick(NAME_PARTS.middle) + " " : "";
  const c = pick(NAME_PARTS.suffix);
  return `${a} ${b}${c}`;
}

function genPhone() {
  return `0${num(10, 87)} ${num(100, 999)} ${num(1000, 9999)}`;
}

function genEmail(name) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 12);
  return `info@${slug}.org.za`;
}

function genId(idx) {
  return `${String(num(1, 999)).padStart(3, '0')}-${String(num(0, 999)).padStart(3, '0')}-NPO`;
}

function genCSO(i) {
  const name = genOrgName();
  const province = pick(PROVINCES);
  const district = pick(DISTRICTS[province]);
  const city = pick(CITIES[district] || [district]);
  const sector = pick(SECTORS);
  const type = pick(ORG_TYPES);
  const sources = pickN(["DSD", "CIPC", "SARS", "Kagiso", "Self-Reg"], num(1, 3));
  const completeness = num(45, 100);
  const status = rng() > 0.92 ? "Flagged" : rng() > 0.15 ? "Verified" : "Pending";
  const dateReg = `${num(1995, 2025)}-${String(num(1, 12)).padStart(2, '0')}-${String(num(1, 28)).padStart(2, '0')}`;
  const contact = `${pick(FIRST_NAMES)} ${pick(SURNAMES)}`;
  const director = `${pick(FIRST_NAMES)} ${pick(SURNAMES)}`;
  const beneficiaries = num(50, 50000);
  const staff = num(2, 240);
  return {
    id: i + 1,
    cso_number: genId(i),
    name,
    type,
    province,
    district,
    city,
    sector,
    sources,
    completeness,
    status,
    dateReg,
    contact,
    director,
    email: genEmail(name),
    phone: genPhone(),
    address: `${num(1, 250)} ${pick(["Mandela", "Tambo", "Sisulu", "Biko", "Mahlangu", "Church", "Main", "Voortrekker", "Long", "President"])} Street, ${city}`,
    postalCode: String(num(1000, 9999)),
    postalAddress: rng() > 0.6 ? `PO Box ${num(100, 9999)}, ${city}` : "",
    service: pick([
      "After-school tutoring and homework support for grades 1-7",
      "HIV testing, counselling and ARV adherence support",
      "Shelter and counselling for survivors of gender-based violence",
      "Early childhood development for children aged 0-5",
      "Skills training and job placement for unemployed youth",
      "Soup kitchen and food parcels for vulnerable households",
      "Home-based care for elderly and chronically ill",
      "Legal advice and rights education for rural communities",
      "Adult basic education and literacy programmes",
      "Disability support and assistive devices",
      "Environmental education and community recycling",
      "Mental health awareness and peer support groups",
      "Sports development for under-18 girls",
      "Sustainable farming and food gardens training",
      "Trauma counselling for children in conflict with the law"
    ]),
    beneficiaries,
    staff,
    funding: pick(["Donor-funded", "Lotteries Commission", "Government grant", "Self-funded", "Mixed"]),
    npoRegistered: rng() > 0.1,
    sarsExempt: rng() > 0.3,
    lastUpdated: `2026-${String(num(1, 5)).padStart(2, '0')}-${String(num(1, 28)).padStart(2, '0')}`
  };
}

const CSO_DATA = Array.from({ length: 420 }, (_, i) => genCSO(i));

// Province distribution counts for dashboard
const PROVINCE_COUNTS = PROVINCES.map(p => ({
  name: p,
  count: CSO_DATA.filter(c => c.province === p).length,
  verified: CSO_DATA.filter(c => c.province === p && c.status === "Verified").length
})).sort((a, b) => b.count - a.count);

const SECTOR_COUNTS = SECTORS.map(s => ({
  name: s,
  count: CSO_DATA.filter(c => c.sector === s).length
})).sort((a, b) => b.count - a.count);

// Aggregate registration trend
const REG_TREND = (() => {
  const buckets = {};
  CSO_DATA.forEach(c => {
    const y = c.dateReg.slice(0, 4);
    buckets[y] = (buckets[y] || 0) + 1;
  });
  return Object.entries(buckets).map(([year, count]) => ({ year, count })).sort((a, b) => a.year.localeCompare(b.year));
})();

// Audit log
const AUDIT_LOG = [
  { id: 1, ts: "2026-05-25 14:32:08", user: "L. Mothapo", role: "Admin", action: "EXPORT", target: "Search results (1,240 records)", ip: "10.12.4.8" },
  { id: 2, ts: "2026-05-25 14:18:51", user: "T. Nkosi", role: "Power User", action: "VIEW", target: "CSO 442-091-NPO", ip: "10.12.4.31" },
  { id: 3, ts: "2026-05-25 13:55:22", user: "System", role: "System", action: "INGEST", target: "DSD weekly delta (412 new records)", ip: "—" },
  { id: 4, ts: "2026-05-25 13:41:09", user: "M. van der Merwe", role: "Standard", action: "SEARCH", target: "sector=GBV province=KZN", ip: "10.12.4.55" },
  { id: 5, ts: "2026-05-25 13:12:47", user: "S. Dlamini", role: "Power User", action: "UPDATE", target: "CSO 118-552-NPO contact details", ip: "10.12.4.31" },
  { id: 6, ts: "2026-05-25 12:58:30", user: "A. Pillay", role: "Read-Only", action: "VIEW", target: "Executive Dashboard", ip: "10.12.4.77" },
  { id: 7, ts: "2026-05-25 12:30:11", user: "Self-Reg", role: "Public", action: "CREATE", target: "Lerato Foundation — pending verification", ip: "196.34.x.x" },
  { id: 8, ts: "2026-05-25 11:48:02", user: "L. Mothapo", role: "Admin", action: "MERGE", target: "Duplicate flagged: ID 388 ⟷ ID 401", ip: "10.12.4.8" },
  { id: 9, ts: "2026-05-25 11:14:19", user: "P. Naidoo", role: "Power User", action: "EXPORT", target: "GBV sector report — Excel", ip: "10.12.4.22" },
  { id: 10, ts: "2026-05-25 10:50:44", user: "System", role: "System", action: "BACKUP", target: "Daily snapshot — 412MB", ip: "—" },
  { id: 11, ts: "2026-05-25 09:22:00", user: "L. Mothapo", role: "Admin", action: "ROLE_CHANGE", target: "T. Nkosi → Power User", ip: "10.12.4.8" },
  { id: 12, ts: "2026-05-25 08:45:13", user: "CIPC Pipeline", role: "System", action: "INGEST", target: "CIPC monthly NPC pull — 1,842 records", ip: "—" },
];

// Saved searches
const SAVED_SEARCHES = [
  { id: 1, name: "GBV orgs in KZN — verified only", filters: "sector=Gender-Based Violence; province=KwaZulu-Natal; status=Verified", count: 14 },
  { id: 2, name: "ECD centres Gauteng townships", filters: "sector=Early Childhood Dev.; province=Gauteng", count: 32 },
  { id: 3, name: "Rural EC food security", filters: "sector=Food Security; province=Eastern Cape", count: 18 },
  { id: 4, name: "Pending self-registrations", filters: "status=Pending; source=Self-Reg", count: 47 },
];

// Users
const USERS = [
  { id: 1, name: "Lebohang Mothapo", email: "l.mothapo@kagiso.org.za", role: "Admin", dept: "ICT", lastLogin: "2026-05-25 14:32", status: "Active" },
  { id: 2, name: "Thandiwe Nkosi", email: "t.nkosi@kagiso.org.za", role: "Power User", dept: "CSSP", lastLogin: "2026-05-25 14:18", status: "Active" },
  { id: 3, name: "Marius van der Merwe", email: "m.vandermerwe@kagiso.org.za", role: "Standard", dept: "CSSP", lastLogin: "2026-05-25 13:41", status: "Active" },
  { id: 4, name: "Sipho Dlamini", email: "s.dlamini@kagiso.org.za", role: "Power User", dept: "CSSP", lastLogin: "2026-05-25 13:12", status: "Active" },
  { id: 5, name: "Aisha Pillay", email: "a.pillay@kagiso.org.za", role: "Read-Only", dept: "Comms", lastLogin: "2026-05-25 12:58", status: "Active" },
  { id: 6, name: "Priya Naidoo", email: "p.naidoo@kagiso.org.za", role: "Power User", dept: "Programmes", lastLogin: "2026-05-25 11:14", status: "Active" },
  { id: 7, name: "Bongani Mokoena", email: "b.mokoena@kagiso.org.za", role: "Standard", dept: "CSSP", lastLogin: "2026-05-24 16:22", status: "Active" },
  { id: 8, name: "Elsabe Botha", email: "e.botha@kagiso.org.za", role: "Read-Only", dept: "Exco", lastLogin: "2026-05-23 09:14", status: "Active" },
  { id: 9, name: "Lwazi Khumalo", email: "l.khumalo@kagiso.org.za", role: "Standard", dept: "CSSP", lastLogin: "2026-05-22 11:50", status: "Inactive" },
];

// Ingestion pipeline state
const PIPELINES = [
  { id: "dsd", name: "DSD NPO Registry", source: "Department of Social Development", lastRun: "2026-05-25 13:55", nextRun: "2026-06-01 02:00", cadence: "Weekly", status: "Healthy", lastDelta: 412, totalImported: 218450 },
  { id: "cipc", name: "CIPC NPC Register", source: "Companies and IP Commission", lastRun: "2026-05-25 08:45", nextRun: "2026-06-25 02:00", cadence: "Monthly", status: "Healthy", lastDelta: 1842, totalImported: 142880 },
  { id: "sars", name: "SARS PBO Dataset", source: "South African Revenue Service", lastRun: "2026-05-20 04:12", nextRun: "2026-06-20 02:00", cadence: "Monthly", status: "Warning", lastDelta: 0, totalImported: 38912, note: "Schema drift in column 'tax_status' — manual review required." },
  { id: "manual", name: "Kagiso Manual Upload", source: "CSSP staff", lastRun: "2026-05-24 11:30", nextRun: "On demand", cadence: "Ad-hoc", status: "Healthy", lastDelta: 18, totalImported: 884 },
  { id: "self", name: "CSO Self-Registration", source: "Public web portal", lastRun: "Continuous", nextRun: "—", cadence: "Real-time", status: "Healthy", lastDelta: 47, totalImported: 312 },
];

window.CSO_DATA = CSO_DATA;
window.PROVINCES = PROVINCES;
window.SECTORS = SECTORS;
window.ORG_TYPES = ORG_TYPES;
window.DISTRICTS = DISTRICTS;
window.PROVINCE_COUNTS = PROVINCE_COUNTS;
window.SECTOR_COUNTS = SECTOR_COUNTS;
window.REG_TREND = REG_TREND;
window.AUDIT_LOG = AUDIT_LOG;
window.SAVED_SEARCHES = SAVED_SEARCHES;
window.USERS = USERS;
window.PIPELINES = PIPELINES;
