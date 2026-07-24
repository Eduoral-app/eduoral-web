import { ResourceType } from "@/generated/prisma/enums";

export type View =
  | "home"
  | "browse"
  | "upload"
  | "dashboard"
  | "profile"
  | "login"
  | "signup";

export interface Resource {
  id: string;
  title: string;
  subject: string;
  institution: string;
  board?: string;
  year: number;
  semester?: string;
  examType?: string;
  type: ResourceType;
  fileType: "PDF" | "Image";
  downloads: number;
  views: number;
  likes: number;
  bookmarks: number;
  tags: string[];
  uploader: string;
  uploadDate: string;
  pages?: number;
  fileSize: string;
}
export const RESOURCES: Resource[] = [
  {
    id: "1",
    title: "Mathematics Annual Examination 2023",
    subject: "Mathematics",
    institution: "FBISE",
    board: "FBISE",
    year: 2023,
    semester: "Annual",
    examType: "Annual",
    type: "PAST_PAPER",
    fileType: "PDF",
    downloads: 4820,
    views: 12450,
    likes: 342,
    bookmarks: 219,
    tags: ["math", "fbise", "2023", "federal"],
    uploader: "Ahmed Raza",
    uploadDate: "2024-01-15",
    pages: 12,
    fileSize: "2.4 MB",
  },
  {
    id: "2",
    title: "Physics Comprehensive Notes — Mechanics & Waves",
    subject: "Physics",
    institution: "Punjab University",
    year: 2023,
    type: "NOTES",
    fileType: "PDF",
    downloads: 3210,
    views: 8930,
    likes: 287,
    bookmarks: 184,
    tags: ["physics", "notes", "mechanics", "waves"],
    uploader: "Sara Khan",
    uploadDate: "2024-02-03",
    pages: 68,
    fileSize: "8.1 MB",
  },
  {
    id: "3",
    title: "O-Level Biology 5090/12 May/June 2022",
    subject: "Biology",
    institution: "Cambridge",
    board: "Cambridge",
    year: 2022,
    examType: "MCQ Paper",
    type: "PAST_PAPER",
    fileType: "PDF",
    downloads: 6750,
    views: 19200,
    likes: 521,
    bookmarks: 378,
    tags: ["biology", "cambridge", "o-level", "mcq"],
    uploader: "Fatima Ali",
    uploadDate: "2023-07-22",
    pages: 24,
    fileSize: "3.7 MB",
  },
  {
    id: "4",
    title: "Chemistry Organic Reactions Cheat Sheet",
    subject: "Chemistry",
    institution: "BISE Lahore",
    year: 2023,
    type: "NOTES",
    fileType: "Image",
    downloads: 2890,
    views: 7600,
    likes: 198,
    bookmarks: 143,
    tags: ["chemistry", "organic", "cheat-sheet", "reactions"],
    uploader: "Usman Malik",
    uploadDate: "2024-01-28",
    fileSize: "1.2 MB",
  },
  {
    id: "5",
    title: "English Literature Paper 1 — BISE Peshawar 2023",
    subject: "English",
    institution: "BISE Peshawar",
    board: "BISE Peshawar",
    year: 2023,
    examType: "Annual",
    type: "PAST_PAPER",
    fileType: "PDF",
    downloads: 1870,
    views: 4320,
    likes: 143,
    bookmarks: 97,
    tags: ["english", "literature", "peshawar", "2023"],
    uploader: "Zainab Noor",
    uploadDate: "2024-03-10",
    pages: 8,
    fileSize: "1.8 MB",
  },
  {
    id: "6",
    title: "Data Structures & Algorithms — Lecture Slides",
    subject: "Computer Science",
    institution: "LUMS",
    year: 2024,
    semester: "Spring",
    type: "SLIDES",
    fileType: "PDF",
    downloads: 2100,
    views: 5890,
    likes: 234,
    bookmarks: 167,
    tags: ["cs", "data-structures", "algorithms", "LUMS"],
    uploader: "Ali Hassan",
    uploadDate: "2024-04-01",
    pages: 145,
    fileSize: "12.3 MB",
  },
  {
    id: "7",
    title: "NTS General Knowledge MCQs 2024 Complete",
    subject: "General Knowledge",
    institution: "NTS",
    year: 2024,
    type: "MCQS",
    fileType: "PDF",
    downloads: 8930,
    views: 24500,
    likes: 876,
    bookmarks: 612,
    tags: ["NTS", "GK", "MCQs", "job-test", "2024"],
    uploader: "Hamza Iqbal",
    uploadDate: "2024-02-20",
    pages: 92,
    fileSize: "6.7 MB",
  },
  {
    id: "8",
    title: "A-Level Pure Mathematics P3 Worked Solutions 2023",
    subject: "Mathematics",
    institution: "Cambridge",
    board: "Cambridge",
    year: 2023,
    type: "NOTES",
    fileType: "PDF",
    downloads: 3450,
    views: 9100,
    likes: 312,
    bookmarks: 228,
    tags: ["a-level", "maths", "worked-solutions", "p3"],
    uploader: "Ayesha Butt",
    uploadDate: "2024-01-05",
    pages: 78,
    fileSize: "9.4 MB",
  },
  {
    id: "9",
    title: "Islamiyat Annual Examination — BISE Multan 2022",
    subject: "Islamiyat",
    institution: "BISE Multan",
    board: "BISE Multan",
    year: 2022,
    type: "PAST_PAPER",
    fileType: "PDF",
    downloads: 2200,
    views: 5600,
    likes: 165,
    bookmarks: 108,
    tags: ["islamiyat", "matric", "multan", "2022"],
    uploader: "Madiha Tariq",
    uploadDate: "2023-09-14",
    pages: 6,
    fileSize: "0.9 MB",
  },
  {
    id: "10",
    title: "PPSC Lecturer Computer Science — Past Papers Collection",
    subject: "Computer Science",
    institution: "PPSC",
    year: 2023,
    type: "PAST_PAPER",
    fileType: "PDF",
    downloads: 5600,
    views: 15200,
    likes: 432,
    bookmarks: 341,
    tags: ["PPSC", "lecturer", "CS", "job-test", "competitive"],
    uploader: "Tariq Mahmood",
    uploadDate: "2024-01-30",
    pages: 56,
    fileSize: "5.1 MB",
  },
  {
    id: "11",
    title: "Physics Lab Manual — Experiments & Observations",
    subject: "Physics",
    institution: "GCU Lahore",
    year: 2023,
    type: "LAB_MANUAL",
    fileType: "PDF",
    downloads: 1920,
    views: 4780,
    likes: 187,
    bookmarks: 122,
    tags: ["physics", "lab", "practical", "GCU"],
    uploader: "Bilal Ahmed",
    uploadDate: "2024-02-14",
    pages: 112,
    fileSize: "15.6 MB",
  },
  {
    id: "12",
    title: "CSS 2023 — Everyday Science Guess Paper",
    subject: "Everyday Science",
    institution: "FPSC",
    year: 2023,
    type: "GUESS_PAPER",
    fileType: "PDF",
    downloads: 4110,
    views: 11200,
    likes: 389,
    bookmarks: 278,
    tags: ["CSS", "everyday-science", "guess-paper", "FPSC"],
    uploader: "Sana Riaz",
    uploadDate: "2024-03-05",
    pages: 34,
    fileSize: "3.9 MB",
  },
];

export const CATEGORIES = [
  { id: "past-papers", name: "Past Papers", icon: "📄", count: 1240 },
  { id: "notes", name: "Notes", icon: "📝", count: 875 },
  { id: "books", name: "Books", icon: "📚", count: 342 },
  { id: "mcqs", name: "MCQs", icon: "✏️", count: 628 },
  { id: "slides", name: "Slides", icon: "🖼️", count: 213 },
  { id: "lab-manuals", name: "Lab Manuals", icon: "🔬", count: 156 },
  { id: "guess-papers", name: "Guess Papers", icon: "🎯", count: 389 },
  { id: "job-tests", name: "Job Tests", icon: "💼", count: 467 },
];

export const BOARDS = [
  "FBISE",
  "BISE Lahore",
  "BISE Peshawar",
  "BISE Multan",
  "Cambridge",
  "NTS",
  "PPSC",
  "FPSC",
];
export const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Computer Science",
  "Islamiyat",
  "Urdu",
  "General Knowledge",
];
export const YEARS = Array.from(
  { length: new Date().getFullYear() - 2000 + 1 },
  (_, i) => new Date().getFullYear() - i,
);

export const RESOURCE_TYPES: ResourceType[] = [
  "ASSIGNMENT",
  "BOOK",
  "GUESS_PAPER",
  "JOB_TEST",
  "LAB_MANUAL",
  "MCQS",
  "NOTES",
  "PAST_PAPER",
  "SLIDES",
];

export function fmt(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return n.toString();
}

export function typeColor(type: ResourceType) {
  const map: Record<string, string> = {
    "Past Paper": "text-amber-400 bg-amber-400/10 border-amber-400/20",
    Notes: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    Book: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    MCQs: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    Slides: "text-sky-400 bg-sky-400/10 border-sky-400/20",
    "Lab Manual": "text-teal-400 bg-teal-400/10 border-teal-400/20",
    "Guess Paper": "text-rose-400 bg-rose-400/10 border-rose-400/20",
    Assignment: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  };
  return map[type] ?? "text-foreground bg-muted border-border";
}

export function mapResourcesToCards(resources: any[]) {
  return resources.map((resource) => ({
    id: resource.id,

    title: resource.title,

    subject: resource.subject?.name ?? "",

    institution: resource.institution ?? "",

    board: resource.board?.name ?? "",

    year: resource.year,

    semester: resource.semester ?? "",

    examType: resource.examType ?? "",

    type: resource.type,

    fileType: resource.fileType,

    downloads: resource.downloadCount ?? 0,

    views: resource.viewCount ?? 0,

    likes: resource.likes ?? 0,

    bookmarks: resource.saveCount ?? 0,

    tags: resource.tags?.map((tag: any) => tag.name) ?? [],

    uploader: resource.uploader?.displayName ?? "Unknown",

    uploadDate: new Date(resource.createdAt).toISOString().split("T")[0],

    pages: resource.pageCount ?? 0,

    fileSize: formatFileSize(resource.fileSize),
  }));
}

function formatFileSize(size?: number | null) {
  if (!size) return "0 KB";

  if (size < 1024) {
    return `${size} KB`;
  }

  return `${(size / 1024).toFixed(1)} MB`;
}
