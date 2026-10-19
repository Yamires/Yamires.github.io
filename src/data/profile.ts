export const profile = {
  name: "Yamir Alejandro Poldo Silva",
  affiliation: "Université de Montréal",
  program: "M.Sc. in Programming and Software Engineering",
  email: "poldosiy@iro.umontreal.ca",
  personalEmail: "alej.poldo@gmail.com",
  github: "https://github.com/Yamires",
  linkedin: "https://www.linkedin.com/in/yamiraps",
  updated: "2026-10-18",
  summary:
    "Master’s student in Programming and Software Engineering at Université de Montréal, interested in how developers understand software and how that understanding shapes its evolution. My research examines how assumptions are represented in software, how domain knowledge changes, and what repository history can reveal about developers’ responses. My experience includes repository analysis, software testing, programming, and technical teaching.",
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
    date: "2026–2027 · Expected completion",
    title: "M.Sc. in Programming and Software Engineering",
    organization: "Université de Montréal",
    summary:
      "Research interests: software evolution, empirical software engineering, and how changing domain knowledge affects assumptions represented in software.",
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
          "Investigating how changing domain knowledge affects assumptions embedded in software, and how developers’ responses can be observed through repository history.",
        stages: [
          {
            title: "Current graduate research",
            date: "2026–present",
            description:
              "Continuing research at GEODES on domain knowledge, software assumptions, and software evolution. The research direction grew out of the summer internship, which helped frame the questions now guiding the work.",
          },
          {
            title: "Research internship",
            date: "Summer 2026",
            bullets: [
              "Developed a Python pipeline using the Gemini API to classify and analyze artifacts from software repositories.",
              "Helped construct a gold-standard dataset from classifications performed independently by two annotators, and assessed inter-annotator agreement using Cohen’s kappa.",
              "Structured and validated repository-derived data, then applied time-series methods, including Interrupted Time Series and PELT, to examine patterns and changes.",
              "Documented the methodology, analytical decisions, and results in preparation for a scientific manuscript.",
            ],
          },
        ],
        description: "Manuscript in progress; target venue to be determined.",
        links: [
          { label: "Covasim case study", href: "work/covasim/" },
          {
            label: "Interactive research narrative",
            href: "research/covasim/",
          },
          {
            label: "Original poster · PDF",
            href: "artifacts/covasim-poster.pdf",
          },
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
        title: "Teaching Assistant — IFT1227, Computer Architecture I",
        organization: "Université de Montréal",
        summary:
          "Explaining computer architecture concepts and supporting students through practical sessions, teaching materials, and consistent assessment.",
        bullets: [
          "Lead practical sessions and help students analyze and solve technical problems.",
          "Prepare, review, and validate exercises, documentation, and teaching materials.",
          "Grade assignments and examinations using established criteria and marking schemes.",
          "Adapt explanations to students with different levels of technical experience.",
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
          "Worked with complex information systems and business rules to maintain accurate client records and explain insurance information clearly.",
        bullets: [
          "Used enterprise information systems to process and track client files, verify information, and document changes accurately.",
          "Analyzed client needs and applied business rules to recommend appropriate solutions.",
          "Explained complex rules clearly and handled confidential information responsibly.",
        ],
        description:
          "Systems used: Guidewire PolicyCenter, BillingCenter, and ClaimCenter, in an end-user capacity.",
      },
    ],
  },
];

export const skillGroups = [
  { title: "Languages", items: "Python, Java, JavaScript, SQL" },
  {
    title: "Data / Analysis",
    items: "pandas, scikit-learn, time-series analysis",
  },
  {
    title: "Software Testing",
    items: "Unit testing, JUnit, Mockito, mutation testing with PIT",
  },
  { title: "Web / Backend", items: "React, Flask, REST APIs" },
  { title: "Databases", items: "PostgreSQL" },
  {
    title: "Tools / DevOps",
    items: "Git, GitHub, GitHub Actions, continuous integration",
  },
  {
    title: "Research Methods",
    items:
      "Repository mining, artifact classification, gold-standard dataset construction, inter-annotator agreement using Cohen’s kappa",
  },
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
