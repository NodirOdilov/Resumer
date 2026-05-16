import type { ExampleItem } from "@/components/examples/ExampleGrid";

function generateExamples(type: "resume" | "cv" | "cover-letter"): ExampleItem[] {
  const examplesByCategory: Record<string, string[]> = {
    "accounting-finance": [
      "Accountant", "Financial Analyst", "Bookkeeper", "Auditor", "Tax Preparer",
      "Controller", "Budget Analyst", "Payroll Specialist", "Investment Banker",
      "Credit Analyst", "Actuary", "Treasurer", "Loan Officer",
      "Financial Planner", "Revenue Agent", "Accounts Payable Specialist",
      "Cost Estimator", "Billing Specialist",
    ],
    "creative-fields": [
      "Graphic Designer", "UX Designer", "Photographer", "Art Director",
      "Copywriter", "Content Creator", "Animator", "Interior Designer",
      "Fashion Designer", "Video Editor", "Illustrator", "Music Producer",
      "Brand Strategist", "Creative Director", "Web Designer",
    ],
    "education": [
      "Teacher", "Professor", "Teaching Assistant", "School Counselor",
      "Principal", "Tutor", "Librarian", "Curriculum Developer",
      "Special Education Teacher", "ESL Teacher", "Instructional Designer",
      "Academic Advisor", "Dean", "Education Administrator",
    ],
    "engineering-tech-science": [
      "Software Engineer", "Mechanical Engineer", "Civil Engineer",
      "Electrical Engineer", "Data Scientist", "Chemical Engineer",
      "Biomedical Engineer", "Environmental Engineer", "Aerospace Engineer",
      "Systems Engineer", "QA Engineer", "DevOps Engineer",
      "Machine Learning Engineer", "Research Scientist", "Lab Technician",
      "Robotics Engineer", "Structural Engineer", "Process Engineer",
      "Network Engineer", "Cloud Architect", "Database Administrator",
      "Firmware Engineer",
    ],
    "food-service": [
      "Chef", "Restaurant Manager", "Bartender", "Waiter",
      "Barista", "Sous Chef", "Catering Manager", "Food Stylist",
      "Kitchen Manager", "Baker", "Pastry Chef", "Sommelier",
    ],
    "healthcare": [
      "Registered Nurse", "Physician", "Pharmacist", "Medical Assistant",
      "Dentist", "Physical Therapist", "Occupational Therapist",
      "Medical Lab Technician", "Healthcare Administrator", "Surgeon",
      "Paramedic", "Radiologist", "Psychologist", "Veterinarian",
      "Speech Pathologist", "Optometrist", "Dental Hygienist",
      "Home Health Aide", "Medical Coder", "Phlebotomist",
    ],
    "information-technology": [
      "Full Stack Developer", "Frontend Developer", "Backend Developer",
      "IT Manager", "System Administrator", "Cybersecurity Analyst",
      "IT Support Specialist", "Product Manager", "Scrum Master",
      "Business Analyst", "Technical Writer", "IT Consultant",
      "Solutions Architect", "Site Reliability Engineer", "IT Director",
      "Data Engineer", "Mobile Developer", "Blockchain Developer",
      "Game Developer", "Security Engineer", "IT Auditor",
      "Enterprise Architect", "Help Desk Analyst", "IT Project Manager",
    ],
    "law-enforcement": [
      "Police Officer", "Detective", "Security Guard", "FBI Agent",
      "Corrections Officer", "Border Patrol Agent", "Crime Analyst",
      "Forensic Investigator", "Park Ranger", "Private Investigator",
    ],
    "legal": [
      "Lawyer", "Paralegal", "Legal Assistant", "Judge",
      "Legal Secretary", "Compliance Officer", "Mediator",
      "Court Reporter", "Patent Attorney", "Corporate Counsel", "Legal Analyst",
    ],
    "maintenance-repair": [
      "Electrician", "Plumber", "HVAC Technician", "Mechanic",
      "Maintenance Supervisor", "Welder", "Carpenter",
      "Building Inspector", "Facility Manager", "Auto Body Technician",
      "Maintenance Technician", "Equipment Operator", "Janitor",
    ],
    "management": [
      "Project Manager", "Operations Manager", "General Manager",
      "Office Manager", "Program Director", "COO",
      "Supply Chain Manager", "Branch Manager", "Team Lead",
      "VP of Operations", "Managing Director", "Regional Manager",
      "Quality Manager", "Risk Manager", "Logistics Manager", "CEO",
    ],
    "marketing-communications": [
      "Marketing Manager", "Social Media Manager", "SEO Specialist",
      "Content Strategist", "Public Relations Manager", "Email Marketing Specialist",
      "Brand Manager", "Market Research Analyst", "Digital Marketing Manager",
      "Communications Director", "Advertising Manager", "Event Planner",
      "Product Marketing Manager", "Growth Hacker", "Influencer Marketing Manager",
      "Media Buyer", "Marketing Coordinator",
    ],
    "office-admin": [
      "Executive Assistant", "Receptionist", "Office Coordinator",
      "Data Entry Clerk", "Administrative Assistant", "Secretary",
      "File Clerk", "Virtual Assistant", "Front Desk Manager",
      "Office Administrator", "Mail Clerk", "Scheduling Coordinator",
      "Payroll Administrator", "Records Manager", "Procurement Specialist",
    ],
    "real-estate": [
      "Real Estate Agent", "Property Manager", "Appraiser",
      "Leasing Consultant", "Real Estate Broker", "Mortgage Loan Officer",
      "Real Estate Developer", "Title Examiner",
    ],
    "sales-customer-service": [
      "Sales Representative", "Account Manager", "Customer Service Rep",
      "Sales Manager", "Retail Manager", "Call Center Agent",
      "Business Development Rep", "Inside Sales Rep", "Sales Engineer",
      "Customer Success Manager", "Retail Associate", "Cashier",
      "Account Executive", "Territory Manager", "Sales Director",
      "Client Relations Manager", "Key Account Manager",
      "Store Manager", "Telemarketer",
    ],
    "students-internships": [
      "College Student", "High School Student", "Recent Graduate",
      "Intern", "Research Assistant", "Student Athlete",
      "Campus Ambassador", "Volunteer Coordinator", "Graduate Student",
      "Co-op Student", "Summer Intern", "Work Study Student",
      "Entry Level Professional", "Fresh Graduate", "Fellowship Applicant",
      "Lab Assistant",
    ],
    "travel-hospitality": [
      "Hotel Manager", "Travel Agent", "Flight Attendant",
      "Tour Guide", "Concierge", "Event Coordinator",
      "Housekeeper", "Front Office Manager", "Resort Manager",
      "Cruise Ship Staff",
    ],
    "other": [
      "Freelancer", "Consultant", "Entrepreneur", "Non-Profit Director",
      "Volunteer", "Career Changer", "Military Veteran",
      "Remote Worker", "Gig Worker", "Journalist",
      "Translator", "Social Worker", "Fitness Trainer",
      "Hair Stylist", "Personal Shopper", "Truck Driver",
      "Pilot", "Farmer", "Clergy", "Archaeologist",
    ],
  };

  const experienceLevels = ["entry-level", "mid-level", "senior", "executive", "student"];

  const allExamples: ExampleItem[] = [];

  Object.entries(examplesByCategory).forEach(([category, titles]) => {
    titles.forEach((title, idx) => {
      const slug = `${title.toLowerCase().replace(/[\s/&]+/g, "-")}-${type}`;
      allExamples.push({
        title: `${title} ${type === "resume" ? "Resume" : type === "cv" ? "CV" : "Cover Letter"}`,
        slug,
        category,
        experienceLevel: experienceLevels[idx % experienceLevels.length],
        thumbnail: "",
      });
    });
  });

  return allExamples;
}

export const RESUME_EXAMPLES = generateExamples("resume");
export const CV_EXAMPLES = generateExamples("cv");
export const COVER_LETTER_EXAMPLES = generateExamples("cover-letter");
