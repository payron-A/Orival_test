import type { Course, Review, CourseSection } from "../types/courses";

// ---- Reusable, topic-appropriate curriculum + review sets -----------------

// ____ Reviews___________
function reviews(list: { author: string; rating: number; date: string; comment: string; avatar: string }[], prefix: string): Review[] {
  return list.map((r, i) => ({
    id: `${prefix}${i + 1}`,
    authorName: r.author,
    authorAvatarUrl: r.avatar,
    rating: r.rating,
    date: r.date,
    comment: r.comment,
  }));
}

const AV1 = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop";
const AV2 = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop";
const AV3 = "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop";

const photographyReviews = reviews(
  [
    { author: "Sara M.", rating: 5, date: "2 weeks ago", avatar: AV1, comment: "Instructor breaks down exposure and composition better than any course I've taken. Field sessions were the highlight." },
    { author: "Yacine B.", rating: 5, date: "1 month ago", avatar: AV2, comment: "Small class size, hands-on with real cameras, and the editing module alone was worth it." },
    { author: "Imane K.", rating: 4, date: "1 month ago", avatar: AV3, comment: "Great fundamentals course. Wish the lighting section was a bit longer, otherwise excellent." },
  ],
  "photo-r"
);

const techReviews = reviews(
  [
    { author: "Sara M.", rating: 5, date: "2 weeks ago", avatar: AV1, comment: "The instructor explains everything clearly and the pacing felt right even as a complete beginner." },
    { author: "Yacine B.", rating: 4, date: "1 month ago", avatar: AV2, comment: "Practical, well-structured, and the hands-on projects made the concepts actually stick." },
    { author: "Imane K.", rating: 5, date: "1 month ago", avatar: AV3, comment: "Solid curriculum from fundamentals to a real project. Would recommend to anyone starting out." },
  ],
  "tech-r"
);

const languageReviews = reviews(
  [
    { author: "Sara M.", rating: 5, date: "2 weeks ago", avatar: AV1, comment: "Speaking practice every session made a real difference — much more confident now." },
    { author: "Yacine B.", rating: 5, date: "1 month ago", avatar: AV2, comment: "The instructor keeps things conversational and corrects gently without breaking the flow." },
    { author: "Imane K.", rating: 4, date: "1 month ago", avatar: AV3, comment: "Great for building real conversation skills, though grammar drills could go a bit deeper." },
  ],
  "lang-r"
);

const practicalReviews = reviews(
  [
    { author: "Sara M.", rating: 4, date: "2 weeks ago", avatar: AV1, comment: "Very hands-on from the first session, exactly what I needed to build confidence." },
    { author: "Yacine B.", rating: 5, date: "1 month ago", avatar: AV2, comment: "Patient instructor, clear step-by-step guidance, and plenty of practice time." },
  ],
  "prac-r"
);

// ____ Sections___________
function sections(groups: { title: string; lessons: { title: string; duration: string; completed?: boolean; locked?: boolean }[] }[], prefix: string): CourseSection[] {
  return groups.map((g, gi) => ({
    id: `${prefix}s${gi + 1}`,
    title: g.title,
    lessons: g.lessons.map(
      (l, li) => ({ id: `${prefix}s${gi + 1}l${li + 1}`, ...l })
    ),
  }));
}

const photoSections = sections(
  [
    { 
      title: "Photography Basics", 
      lessons: [
        { title: "Understanding your camera", duration: "12:30", completed: true },
        { title: "Your camera settings", duration: "09:15", completed: true },
        { title: "Exposure Triangle", duration: "15:45" },
      ] 
    },
    { 
      title: "Composition", 
      lessons: [
        { title: "Rule of thirds", duration: "10:20" },
        { title: "Leading lines", duration: "08:15" },
      ] 
    },
    { 
      title: "Lighting", 
      lessons: [
        { title: "Natural light", duration: "11:40", locked: true },
        { title: "Studio lighting basics", duration: "13:05", locked: true },
      ] 
    },
  ],
  "photo-"
);

const photoEditSections = sections(
  [
    { title: "Editing Workflow", lessons: [
      { title: "Culling your shoot", duration: "10:10", completed: true },
      { title: "Setting up your catalog", duration: "08:30", completed: true },
      { title: "Non-destructive editing basics", duration: "12:15" },
    ] },
    { title: "Color & Light", lessons: [
      { title: "Color grading fundamentals", duration: "14:00" },
      { title: "Building a consistent look", duration: "09:45" },
    ] },
    { title: "Finishing", lessons: [
      { title: "Building presets", duration: "11:20", locked: true },
      { title: "Batch exporting", duration: "07:10", locked: true },
    ] },
  ],
  "edit-"
);

function makeProgrammingSections(topic: string) {
  return sections(
    [
      { title: "Foundations", lessons: [
        { title: "Setting up your environment", duration: "11:00", completed: true },
        { title: `Core ${topic} syntax`, duration: "16:20", completed: true },
        { title: "Variables & data types", duration: "13:40" },
      ] },
      { title: "Building Projects", lessons: [
        { title: "Your first project", duration: "22:10" },
        { title: "Debugging basics", duration: "09:30" },
      ] },
      { title: "Going Further", lessons: [
        { title: "Working with APIs", duration: "18:15", locked: true },
        { title: "Deploying your project", duration: "12:45", locked: true },
      ] },
    ],
    `prog-${topic}-`
  );
}

const designSections = sections(
  [
    { title: "Design Foundations", lessons: [
      { title: "Core design principles", duration: "13:00", completed: true },
      { title: "Color & typography", duration: "15:30", completed: true },
      { title: "Tools overview", duration: "10:20" },
    ] },
    { title: "Practical Design", lessons: [
      { title: "Wireframing your first screen", duration: "17:40" },
      { title: "Prototyping basics", duration: "14:10" },
    ] },
    { title: "Refinement", lessons: [
      { title: "Getting feedback", duration: "08:50", locked: true },
      { title: "Presenting your work", duration: "09:15", locked: true },
    ] },
  ],
  "design-"
);

const businessSections = sections(
  [
    { title: "Fundamentals", lessons: [
      { title: "Core concepts", duration: "12:00", completed: true },
      { title: "Understanding your market", duration: "14:20", completed: true },
      { title: "Setting goals", duration: "07:40" },
    ] },
    { title: "Strategy", lessons: [
      { title: "Building a plan", duration: "16:10" },
      { title: "Execution basics", duration: "11:35" },
    ] },
    { title: "Measuring Results", lessons: [
      { title: "Tracking key metrics", duration: "09:50", locked: true },
      { title: "Reporting & iteration", duration: "10:05", locked: true },
    ] },
  ],
  "biz-"
);

const languageSections = sections(
  [
    { title: "Getting Started", lessons: [
      { title: "Everyday phrases", duration: "09:00", completed: true },
      { title: "Pronunciation basics", duration: "11:20", completed: true },
      { title: "Common expressions", duration: "08:45" },
    ] },
    { title: "Building Fluency", lessons: [
      { title: "Grammar essentials", duration: "13:30" },
      { title: "Listening practice", duration: "15:00" },
    ] },
    { title: "Real Conversations", lessons: [
      { title: "Guided speaking practice", duration: "20:00", locked: true },
      { title: "Cultural context", duration: "10:15", locked: true },
    ] },
  ],
  "lang-"
);

const musicSections = sections(
  [
    { title: "Getting Started", lessons: [
      { title: "Holding your instrument", duration: "07:20", completed: true },
      { title: "Your first chords", duration: "12:40", completed: true },
      { title: "Basic strumming patterns", duration: "09:10" },
    ] },
    { title: "Building Skills", lessons: [
      { title: "Reading tabs", duration: "11:00" },
      { title: "Chord transitions", duration: "10:30" },
    ] },
    { title: "Playing Songs", lessons: [
      { title: "Your first song", duration: "14:20", locked: true },
      { title: "Practice routine", duration: "06:45", locked: true },
    ] },
  ],
  "music-"
);

const drivingSections = sections(
  [
    { title: "Road Fundamentals", lessons: [
      { title: "Road rules & signage", duration: "10:00", completed: true },
      { title: "Vehicle controls", duration: "08:30", completed: true },
    ] },
    { title: "Hands-on Practice", lessons: [
      { title: "Guided practice session 1", duration: "45:00" },
      { title: "Parking maneuvers", duration: "30:00" },
    ] },
    { title: "Confidence Building", lessons: [
      { title: "Highway driving", duration: "40:00", locked: true },
      { title: "Final assessment", duration: "35:00", locked: true },
    ] },
  ],
  "drive-"
);

const cookingSections = sections(
  [
    { title: "Kitchen Fundamentals", lessons: [
      { title: "Knife skills", duration: "14:00", completed: true },
      { title: "Setting up your station", duration: "07:15", completed: true },
    ] },
    { title: "Core Techniques", lessons: [
      { title: "Sauces & stocks", duration: "18:20" },
      { title: "Meal planning", duration: "09:40" },
    ] },
    { title: "Bringing It Together", lessons: [
      { title: "Baking basics", duration: "16:10", locked: true },
      { title: "Plating & presentation", duration: "08:00", locked: true },
    ] },
  ],
  "cook-"
);

// ___ Courses __________
export const defaultCourses: Course[] = [
  {
    id: "advanced-photography",
    title: "Advanced Photography",
    thumbnailUrl: "/sole-stip.png",
    providerId: "photography-academy",
    categoryId: "photography",
    mode: "in-person",
    rating: 4.8,
    reviewCount: 120,
    studentCount: 245,
    priceDzd: 12000,
    level: "beginner",
    lessonCount: 24,
    durationLabel: "6h 30m",
    distanceKm: 2.4,
    location: { lat: 27.9119, lng: -0.316, address: "12 Rue des Frères, Centre Ville", city: "Adrar", country: "Algeria" },
    description: "Learn the fundamentals of photography and take your skills to the next level. This course covers your camera, exposure, composition and editing through hands-on studio and field sessions with a working photographer.",
    outcomes: ["Understand your camera", "Composition techniques", "Lighting and exposure", "Photo editing basics"],
    sections: photoSections,
    reviews: photographyReviews,
    tags: ["camera", "composition", "editing"],
    addedAt: "2026-07-02",
  },
  {
    id: "portrait-photography",
    title: "Portrait Photography Masterclass",
    thumbnailUrl: "https://images.unsplash.com/photo-1554080353-a576cf803bda?w=200&h=200&fit=crop",
    providerId: "creative-studio",
    categoryId: "photography",
    mode: "in-person",
    rating: 4.7,
    reviewCount: 64,
    studentCount: 130,
    priceDzd: 10000,
    level: "intermediate",
    lessonCount: 18,
    durationLabel: "5h 10m",
    distanceKm: 3.1,
    location: { lat: 35.228, lng: 1.234, address: "Cité El Wiam", city: "Tyaret", country: "Algeria" },
    description: "Direct people confidently and shoot portraits that feel alive, from natural light headshots to styled studio sessions.",
    outcomes: ["Directing subjects", "Studio lighting setups", "Posing fundamentals", "Retouching basics"],
    sections: photoSections,
    reviews: photographyReviews.slice(0, 2),
    tags: ["portrait", "studio", "lighting"],
    addedAt: "2026-06-18",
  },
  {
    id: "photography-basics",
    title: "Photography Basics",
    thumbnailUrl: "/https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200&h=200&fit=crop",
    providerId: "photo-center",
    categoryId: "photography",
    mode: "online",
    rating: 4.6,
    reviewCount: 41,
    studentCount: 610,
    priceDzd: 6200,
    level: "beginner",
    lessonCount: 14,
    durationLabel: "3h 45m",
    description: "A self-paced introduction to cameras, light and composition — perfect for absolute beginners learning from anywhere.",
    outcomes: ["Camera modes explained", "Composition basics", "Shooting in manual mode"],
    sections: photoSections.slice(0, 2),
    reviews: photographyReviews.slice(0, 1),
    tags: ["beginner", "online"],
    addedAt: "2026-08-01",
  },
  {
    id: "photo-editing-lightroom",
    title: "Photo Editing with Lightroom",
    thumbnailUrl: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=200&h=200&fit=crop",
    providerId: "photo-center",
    categoryId: "photography",
    mode: "online",
    rating: 4.5,
    reviewCount: 58,
    studentCount: 420,
    priceDzd: 8000,
    level: "intermediate",
    lessonCount: 16,
    durationLabel: "4h 20m",
    description: "Master a professional Lightroom workflow, from culling and color grading to consistent presets.",
    outcomes: ["Culling workflow", "Color grading", "Building presets", "Batch exporting"],
    sections: photoEditSections,
    reviews: photographyReviews.slice(1),
    tags: ["editing", "lightroom"],
    addedAt: "2026-05-22",
  },
  {
    id: "complete-web-development",
    title: "Complete Web Development",
    thumbnailUrl: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=200&h=200&fit=crop",
    providerId: "codepro-institute",
    categoryId: "programming",
    mode: "online",
    rating: 4.8,
    reviewCount: 890,
    studentCount: 5200,
    priceDzd: 15000,
    level: "beginner",
    lessonCount: 96,
    durationLabel: "38h 00m",
    description: "Go from zero to building full-stack web applications with HTML, CSS, JavaScript, React and Node.js.",
    outcomes: ["Modern JavaScript", "Building with React", "REST APIs with Node.js", "Deploying real projects"],
    sections: makeProgrammingSections("web"),
    reviews: techReviews,
    tags: ["web", "react", "javascript"],
    addedAt: "2026-04-10",
  },
  {
    id: "python-for-beginners",
    title: "Python for Beginners",
    thumbnailUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop",
    providerId: "codepro-institute",
    categoryId: "programming",
    mode: "online",
    rating: 4.7,
    reviewCount: 610,
    studentCount: 4100,
    priceDzd: 9000,
    level: "beginner",
    lessonCount: 52,
    durationLabel: "18h 30m",
    description: "Learn Python from scratch and build small automation and data projects along the way.",
    outcomes: ["Python syntax", "Working with data", "Writing scripts", "Intro to automation"],
    sections: makeProgrammingSections("Python"),
    reviews: techReviews.slice(0, 2),
    tags: ["python", "beginner"],
    addedAt: "2026-03-28",
  },
  {
    id: "uiux-design-basics",
    title: "UI/UX Design Basics",
    thumbnailUrl: "https://images.unsplash.com/photo-1493612276216-ee3925520721?w=200&h=200&fit=crop",
    providerId: "design-studio",
    categoryId: "design",
    mode: "online",
    rating: 4.6,
    reviewCount: 220,
    studentCount: 1900,
    priceDzd: 8500,
    level: "beginner",
    lessonCount: 34,
    durationLabel: "12h 10m",
    description: "Understand core UI/UX principles and design your first usable, tested interface.",
    outcomes: ["Design fundamentals", "Wireframing", "Prototyping in Figma", "Usability testing"],
    sections: designSections,
    reviews: techReviews.slice(0, 1),
    tags: ["ui", "ux", "figma"],
    addedAt: "2026-08-15",
  },
  {
    id: "graphic-design-masterclass",
    title: "Graphic Design Masterclass",
    thumbnailUrl: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=200&h=200&fit=crop",
    providerId: "design-studio",
    categoryId: "design",
    mode: "online",
    rating: 4.7,
    reviewCount: 175,
    studentCount: 1200,
    priceDzd: 12000,
    level: "intermediate",
    lessonCount: 40,
    durationLabel: "15h 45m",
    description: "Develop a strong visual language across branding, layout and typography.",
    outcomes: ["Branding systems", "Layout & grids", "Typography", "Portfolio-ready projects"],
    sections: designSections,
    reviews: techReviews.slice(1),
    tags: ["branding", "typography"],
    addedAt: "2026-02-14",
  },
  {
    id: "english-conversation-skills",
    title: "English Conversation Skills",
    thumbnailUrl: "/orival.svg",
    providerId: "english-center",
    categoryId: "languages",
    mode: "in-person",
    rating: 4.9,
    reviewCount: 300,
    studentCount: 860,
    priceDzd: 7000,
    level: "all levels",
    lessonCount: 30,
    durationLabel: "20h 00m",
    distanceKm: 15.3,
    location: { lat: 35.697, lng: -0.633, address: "Rue Larbi Ben M'hidi", city: "Oran", country: "Algeria" },
    description: "Build real conversational confidence through weekly speaking circles and guided practice.",
    outcomes: ["Everyday conversation", "Pronunciation", "Listening comprehension", "Confidence speaking"],
    sections: languageSections,
    reviews: languageReviews,
    tags: ["speaking", "conversation"],
    addedAt: "2026-07-20",
  },
  {
    id: "digital-marketing-2024",
    title: "Digital Marketing 2026",
    thumbnailUrl: "/sole-stip.png",
    providerId: "business-academy",
    categoryId: "business",
    mode: "online",
    rating: 4.6,
    reviewCount: 140,
    studentCount: 2300,
    priceDzd: 10000,
    level: "beginner",
    lessonCount: 28,
    durationLabel: "10h 20m",
    description: "A practical playbook for running paid, social and content marketing campaigns that convert.",
    outcomes: ["Campaign planning", "Paid social ads", "Content strategy", "Analytics & reporting"],
    sections: businessSections,
    reviews: techReviews.slice(0, 1),
    tags: ["marketing", "ads"],
    addedAt: "2026-08-10",
  },
  {
    id: "advanced-excel-skills",
    title: "Advanced Excel Skills",
    thumbnailUrl: "/orival.svg",
    providerId: "business-academy",
    categoryId: "business",
    mode: "online",
    rating: 4.5,
    reviewCount: 96,
    studentCount: 1750,
    priceDzd: 8000,
    level: "intermediate",
    lessonCount: 22,
    durationLabel: "9h 15m",
    description: "Level up your spreadsheet skills with formulas, pivot tables and dashboard building.",
    outcomes: ["Advanced formulas", "Pivot tables", "Dashboards", "Data cleaning"],
    sections: businessSections,
    reviews: techReviews.slice(1),
    tags: ["excel", "data"],
    addedAt: "2026-01-30",
  },
  {
    id: "intro-to-driving",
    title: "Intro to Driving",
    thumbnailUrl: "/sole-stip.png",
    providerId: "creative-studio",
    categoryId: "driving",
    mode: "in-person",
    rating: 4.4,
    reviewCount: 38,
    studentCount: 210,
    priceDzd: 25000,
    level: "beginner",
    lessonCount: 12,
    durationLabel: "12h 00m",
    distanceKm: 4.6,
    location: { lat: 28.0339, lng: 8.21, address: "Zone Industrielle", city: "Ilizi", country: "Algeria" },
    description: "Structured behind-the-wheel lessons with a certified instructor, built for first-time drivers.",
    outcomes: ["Road rules", "Vehicle control", "Parking maneuvers", "Highway driving"],
    sections: drivingSections,
    reviews: practicalReviews,
    tags: ["driving", "practical"],
    addedAt: "2026-06-02",
  },
  {
    id: "home-cooking-essentials",
    title: "Home Cooking Essentials",
    thumbnailUrl: "/sole-stip.png",
    providerId: "creative-studio",
    categoryId: "cooking",
    mode: "hybrid",
    rating: 4.7,
    reviewCount: 82,
    studentCount: 540,
    priceDzd: 6500,
    level: "beginner",
    lessonCount: 20,
    durationLabel: "8h 00m",
    distanceKm: 3.8,
    location: { lat:30.0339, lng: -4.12, address: "Cité El Wiam", city: "Bani Abbas", country: "Algeria" },
    description: "Build kitchen fundamentals through live studio classes plus an online recipe library.",
    outcomes: ["Knife skills", "Sauces & stocks", "Meal planning", "Baking basics"],
    sections: cookingSections,
    reviews: practicalReviews,
    tags: ["cooking", "hybrid"],
    addedAt: "2026-07-11",
  },
  {
    id: "guitar-for-beginners",
    title: "Guitar for Beginners",
    thumbnailUrl: "/orival.svg",
    providerId: "english-center",
    categoryId: "music",
    mode: "online",
    rating: 4.6,
    reviewCount: 120,
    studentCount: 980,
    priceDzd: 5500,
    level: "beginner",
    lessonCount: 26,
    durationLabel: "9h 40m",
    description: "Pick up the guitar with structured, song-based lessons designed for total beginners.",
    outcomes: ["Chords & strumming", "Reading tabs", "Playing your first songs", "Basic music theory"],
    sections: musicSections,
    reviews: languageReviews.slice(0, 1),
    tags: ["music", "guitar"],
    addedAt: "2026-08-20",
  },
];
