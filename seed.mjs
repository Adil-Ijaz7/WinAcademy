import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://zlyhnbppsurfjawnvghl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_Fj39EUbcTN1GqzMTlUR-7Q_x3-t5Jqg";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const courses = [
  {
    name: "Full Stack Web Development",
    slug: "full-stack-web-development",
    category: "IT & Computer",
    short_description: "Learn HTML, CSS, JavaScript, React, and Node.js from scratch.",
    description: "This comprehensive course takes you from zero to hero in web development. You will learn to build responsive websites, interactive web applications, and robust backend APIs. Perfect for beginners and those looking to upgrade their skills.",
    duration: "6 Months",
    price: 15000,
    schedule: "Mon-Wed-Fri 4PM-6PM",
    enrollment_status: "open",
    features: ["Build real-world projects", "Dedicated mentorship", "Career guidance", "Certificate of completion"],
    display_order: 1,
    active: true,
  },
  {
    name: "English Spoken & Communication",
    slug: "english-spoken-communication",
    category: "Vocational",
    short_description: "Improve your fluency, pronunciation, and confidence in English.",
    description: "Master the English language with our interactive spoken English course. Focus on conversational skills, grammar, pronunciation, and vocabulary building. Designed for professionals and students alike.",
    duration: "3 Months",
    price: 8000,
    schedule: "Tue-Thu 5PM-7PM",
    enrollment_status: "open",
    features: ["Interactive speaking sessions", "Native-like pronunciation", "Interview preparation", "Confidence building"],
    display_order: 2,
    active: true,
  },
  {
    name: "Computer Basics & Office Automation",
    slug: "computer-basics-office-automation",
    category: "IT & Computer",
    short_description: "Master MS Office, Internet browsing, and basic computer skills.",
    description: "An essential course for anyone looking to build a strong foundation in computer operations. Learn Microsoft Word, Excel, PowerPoint, and essential internet skills required for any modern job.",
    duration: "2 Months",
    price: 5000,
    schedule: "Mon-Sat 3PM-4PM",
    enrollment_status: "open",
    features: ["Hands-on practice", "MS Word, Excel, PowerPoint", "Internet & Email basics", "Typing practice"],
    display_order: 3,
    active: true,
  }
];

async function seed() {
  console.log("Seeding courses...");
  for (const course of courses) {
    const { data, error } = await supabase.from('courses').upsert({ ...course }, { onConflict: 'slug' });
    if (error) {
      console.error("Error inserting", course.name, error.message);
    } else {
      console.log("Successfully inserted", course.name);
    }
  }
  console.log("Done.");
}

seed();
