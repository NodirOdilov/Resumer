/**
 * Pre-baked AI content for the demo. Indistinguishable from a real GPT-4o
 * response unless you read all of them. Keys are normalized section types.
 */

const SUMMARY_VARIANTS = [
  "Results-driven {role} with {years}+ years of experience delivering measurable impact in fast-paced product environments. Combines deep technical expertise with strong cross-functional collaboration to translate ambiguous business goals into shipped, well-tested software. Repeatedly recognised for shipping ahead of schedule and mentoring teammates into senior roles.",
  "Senior {role} with a track record of leading complex initiatives from discovery through launch. Equally comfortable architecting systems, writing production code, and partnering with PMs and designers to ship work that customers actually use. Energised by hard problems where the right answer isn't obvious.",
  "{role} who turns vague problem statements into clear, durable solutions. Strong systems thinker with a bias toward simple architectures, observable services, and code that the next engineer will thank you for. {years} years across consumer products, B2B SaaS, and developer tools.",
];

const EXPERIENCE_VARIANTS = [
  "• Led the team that delivered {feature} ahead of the planned schedule, exceeding KPI targets by 28%.\n• Owned the architecture decisions for our core platform, balancing time-to-market against long-term maintainability.\n• Mentored two engineers from mid-level to senior, both promoted within 12 months.\n• Drove the adoption of automated regression testing, cutting production incidents by ~40% quarter-over-quarter.",
  "• Designed and shipped {feature}, generating an estimated $4.2M in annualised revenue in the first quarter post-launch.\n• Collaborated with product, design, and data teams to scope a clean MVP that we could iterate on without rewrites.\n• Reduced p95 latency from 320ms to 95ms by introducing a request-coalescing layer in front of our hottest endpoints.\n• Authored an internal RFC adopted across three other teams as the standard pattern for write-heavy workloads.",
  "• Took ownership of {feature}, a project that had stalled for six months, and shipped a v1 in eight weeks.\n• Established the on-call playbook and runbook library; reduced median time-to-recovery from 47 minutes to 11.\n• Partnered with the data team to instrument every critical path, creating dashboards still used as the source of truth today.\n• Recognised internally with the 'Engineering Excellence' award for the second consecutive year.",
];

const SKILLS_VARIANTS = [
  "Communication, stakeholder management, problem solving, project leadership, technical writing, mentoring, agile methodologies, cross-functional collaboration, data-driven decision making.",
  "Strategic planning, prioritisation, public speaking, executive briefings, OKR setting, performance management, hiring and interviewing, conflict resolution, change management.",
  "System design, distributed systems, API design, database modeling, caching strategies, security best practices, observability, code review, technical mentoring.",
];

const COVER_LETTER_VARIANTS = [
  "Dear Hiring Manager,\n\nI'm writing to apply for the {role} position at {company}. With {years} years of experience delivering high-impact work in similar environments, I'm confident I can contribute meaningfully from day one.\n\nIn my most recent role I led a team that shipped a critical product surface, hitting every milestone and exceeding our adoption KPI by 28%. The work required deep collaboration with design, product, and data — exactly the kind of cross-functional partnership I see {company} valuing.\n\nWhat draws me to {company} specifically is your public commitment to durable, well-crafted infrastructure. I want to do my best work in a place where engineering quality is treated as a feature, not a tax.\n\nThank you for considering my application. I'd welcome the chance to discuss how I can contribute to your team.\n\nSincerely,\n[Your Name]",
];

const PROJECT_VARIANTS = [
  "Built and open-sourced a TypeScript library for {role} workflows. Reached 1.4k★ on GitHub within six months and is now used in production at three Fortune 500 companies.",
  "Designed and shipped a side-project that solves a small but real annoyance for {role}s. Featured on Hacker News' front page and used by 12k+ unique visitors in its first week.",
];

const CERTIFICATION_VARIANTS = [
  "Earned through a 6-month curriculum covering advanced practitioner topics. Required passing a hands-on capstone project graded by industry experts.",
];

const VOLUNTEER_VARIANTS = [
  "Volunteered as a mentor in a non-profit programme connecting first-generation university students with {role}s. Mentored four students through their first internship search; three secured offers.",
];

const EDUCATION_VARIANTS = [
  "Coursework focused on systems, algorithms, and software engineering practice. Capstone project: built a distributed key-value store from scratch in Go.",
];

const VARIANTS_BY_TYPE: Record<string, string[]> = {
  summary: SUMMARY_VARIANTS,
  experience: EXPERIENCE_VARIANTS,
  skills: SKILLS_VARIANTS,
  cover_letter: COVER_LETTER_VARIANTS,
  project: PROJECT_VARIANTS,
  certification: CERTIFICATION_VARIANTS,
  volunteer: VOLUNTEER_VARIANTS,
  education: EDUCATION_VARIANTS,
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateAIContent(args: {
  sectionType: string;
  jobTitle: string;
  yearsExperience?: number;
  company?: string;
}): string {
  const variants = VARIANTS_BY_TYPE[args.sectionType] || SUMMARY_VARIANTS;
  return pick(variants)
    .replaceAll("{role}", args.jobTitle || "professional")
    .replaceAll("{years}", String(args.yearsExperience ?? 5))
    .replaceAll("{company}", args.company || "your company")
    .replaceAll("{feature}", "a high-priority initiative");
}

export function rewriteText(text: string, sectionType: string): string {
  // For rewrite, we don't completely throw away the user's content — we
  // tighten it. Real polish: bullet-ify, add an action verb, append a metric.
  if (!text || !text.trim()) {
    return generateAIContent({ sectionType, jobTitle: "professional" });
  }
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const ACTION_VERBS = ["Led", "Drove", "Owned", "Shipped", "Designed", "Built", "Spearheaded"];
  const polished = lines.map((line, idx) => {
    const stripped = line.replace(/^[-•*]\s*/, "");
    if (stripped.length < 8) return line;
    const verb = ACTION_VERBS[idx % ACTION_VERBS.length];
    // Replace passive openers with the action verb when sensible.
    const better = stripped.replace(
      /^(I |Was |Helped |Worked on |Responsible for |Did |Made )/i,
      `${verb} `,
    );
    return `• ${better.charAt(0).toUpperCase()}${better.slice(1)}`;
  });

  // Append a metric to the first bullet if none of them have a number.
  if (!polished.some((p) => /\d/.test(p))) {
    polished[0] = polished[0].replace(/[.;!]?$/, ", driving a 28% improvement in core KPIs.");
  }

  return polished.join("\n");
}
