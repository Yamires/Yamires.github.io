export const profile = {
  name: "Yamir Alejandro Poldo Silva",
  affiliation: "Université de Montréal",
  program: "M.Sc. in Programming and Software Engineering",
  expectedGraduation: "2028",
  headline: "Software developer & graduate researcher",
  email: "poldosiy@iro.umontreal.ca",
  personalEmail: "alej.poldo@gmail.com",
  github: "https://github.com/Yamires",
  linkedin: "https://www.linkedin.com/in/yamiraps",
  updated: "2026-10-22",
  summary:
    "Software developer with experience in Python, Java, full-stack applications, and automated testing. I’m pursuing a master’s in Programming and Software Engineering at Université de Montréal, with research in software architecture, domain modeling, and software evolution.",
};

export interface CVEntry {
  id: string;
  date: string;
  title: string;
  organization: string;
  summary: string;
  description?: string;
  bullets?: string[];
  technologies?: string[];
  stages?: {
    title: string;
    date: string;
    description?: string;
    bullets?: string[];
  }[];
  links?: { label: string; href: string }[];
}

export const education = [
  {
    id: "masters",
    date: `2026–${profile.expectedGraduation} · Expected completion`,
    title: "M.Sc. in Programming and Software Engineering",
    organization: "Université de Montréal",
    summary:
      "Research in software architecture, domain modeling, and software evolution.",
  },
  {
    id: "bachelors",
    date: "2022–2026",
    title: "B.Sc. in Computer Science",
    organization: "Université de Montréal",
    summary: "GPA: 3.56 / 4.3",
  },
];

export const cvSections: {
  id: string;
  number: string;
  title: string;
  category: string;
  entries: CVEntry[];
}[] = [
  {
    id: "research",
    number: "03",
    title: "Research Experience",
    category: "research",
    entries: [
      {
        id: "covasim-research",
        date: "2026–present",
        title: "Software Evolution Research",
        organization: "GEODES · Université de Montréal",
        summary:
          "Built a Python/LLM pipeline to study domain-related changes in software repositories.",
        stages: [
          {
            title: "Current graduate research",
            date: "2026–present",
            description:
              "Studying software architecture, domain modeling, and software evolution, continuing the internship research.",
          },
          {
            title: "Research internship",
            date: "May–August 2026",
            bullets: [
              "Built a Python/LLM pipeline to extract and classify approximately 8,500 commits from 30 repositories across two open-source systems.",
              "Created a gold-standard dataset of 330 commits annotated independently by two people (Cohen’s kappa: 0.764).",
              "Validated a Gemini 2.5 Flash commit classifier: 79.0% accuracy and F1: 0.755 on the reference dataset.",
              "Found that 85.3% of commits (128/150) in three post-event intervals concerned domain representation, exceeding the historical 95th percentile.",
            ],
          },
        ],
        description:
          "Preliminary findings do not establish causality. Manuscript in progress; venue to be determined.",
        links: [
          { label: "Covasim case study", href: "work/covasim/" },
          { label: "Poster · PDF", href: "artifacts/covasim-poster.pdf" },
        ],
      },
    ],
  },
  {
    id: "teaching",
    number: "04",
    title: "Teaching Experience",
    category: "research",
    entries: [
      {
        id: "ift1227",
        date: "2023–present",
        title: "Teaching Assistant — IFT1215 / IFT1227",
        organization: "Université de Montréal",
        summary:
          "Support students in computer systems and computer architecture.",
        bullets: [
          "Support cohorts of 120 students per term through practical sessions, technical troubleshooting, and individual meetings.",
          "Assess two assignments per course per term and explain technical concepts to students with varied experience.",
        ],
      },
    ],
  },
  {
    id: "professional",
    number: "05",
    title: "Professional Experience",
    category: "professional",
    entries: [
      {
        id: "beneva",
        date: "2024–2026",
        title: "Personal Lines Insurance Agent",
        organization: "Beneva",
        summary:
          "Processed regulated transactions using Guidewire PolicyCenter and BillingCenter, applying complex business rules.",
        bullets: ["Ranked in the team’s Top 10 twice in 2026."],
      },
    ],
  },
];

export const skillGroups = [
  { title: "Programming", items: "Python, Java, JavaScript, SQL" },
  {
    title: "Development",
    items: "Flask, React, REST APIs, PostgreSQL, pandas, SymPy",
  },
  {
    title: "Testing & Tools",
    items:
      "JUnit, Mockito, pytest, PIT, Git, GitHub Actions, Docker, Linux, CI/CD",
  },
  { title: "Spoken Languages", items: "French, English, Spanish" },
];

export const evidence = [
  {
    id: "bin-1",
    bin: 1,
    dates: "Feb. 5–16, 2021",
    title: "Representation expands",
    commits: [
      {
        date: "Feb. 8",
        hash: "9cdb8ac",
        message: "making immunity strain-specific",
      },
      {
        date: "Feb. 10",
        hash: "158dac0",
        message: "immunity … is now a matrix",
      },
      { date: "Feb. 16", hash: "1dac390", message: "stuck on dimensions" },
    ],
    interpretation:
      "Strain-specific immunity and cross-immunity become explicit, with early implementation friction.",
  },
  {
    id: "bin-2",
    bin: 2,
    dates: "Feb. 16–Mar. 1, 2021",
    title: "Representation is reworked",
    commits: [
      {
        date: "Feb. 18",
        hash: "b46787c",
        message: "scenarios need refactoring",
      },
      {
        date: "Feb. 22",
        hash: "26dd3b5",
        message: "ugly fix for update_immunity…",
      },
      {
        date: "Feb. 25",
        hash: "cc403df",
        message: "trying to simplify strain information…",
      },
    ],
    interpretation:
      "Immunity expands into multiple effects while strain and scenario logic is reworked.",
  },
  {
    id: "bin-3",
    bin: 3,
    dates: "Mar. 1–10, 2021",
    title: "Representation is consolidated",
    commits: [
      {
        date: "Mar. 1",
        hash: "336420b",
        message: "merged immunity and cross immunity calculations…",
      },
      { date: "Mar. 2", hash: "7d377c8", message: "stuck with immunity calcs" },
      { date: "Mar. 3", hash: "46c4070", message: "add immunity file" },
    ],
    interpretation:
      "Immunity calculations are consolidated into an explicit module.",
  },
];
