"use client";

/**
 * Hidden printable view of the current builder document. Only visible when
 * the user invokes the browser print dialog — print CSS in `globals.css`
 * collapses everything else and shows just this element.
 */

import { useBuilderStore } from "@/stores/builderStore";

interface ContactBlock {
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  email?: string;
  phone?: string;
  city?: string;
  country?: string;
  linkedin?: string;
  website?: string;
}

interface ExperienceItem {
  jobTitle?: string;
  company?: string;
  location?: string;
  startDate?: string;
  endDate?: string | null;
  current?: boolean;
  description?: string;
}

interface EducationItem {
  degree?: string;
  school?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  gpa?: string;
  description?: string;
}

interface SkillItem {
  name?: string;
  level?: string;
}

interface LanguageItem {
  name?: string;
  level?: string;
}

function fmtDate(value?: string | null): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function PrintableResume() {
  const content = useBuilderStore((s) => s.content);
  const settings = useBuilderStore((s) => s.settings);

  const contact = (content.contact as ContactBlock) || {};
  const summary = (content.summary as string) || "";
  const experience = (content.experience as ExperienceItem[]) || [];
  const education = (content.education as EducationItem[]) || [];
  const skills = (content.skills as SkillItem[]) || [];
  const languages = (content.languages as LanguageItem[]) || [];

  const accent = settings.color || "#0D47A1";
  const fullName = `${contact.firstName || ""} ${contact.lastName || ""}`.trim() || "Your Name";
  const contactBits = [contact.email, contact.phone, [contact.city, contact.country].filter(Boolean).join(", "), contact.linkedin, contact.website].filter(Boolean);

  return (
    <div data-resume-print className="printable-resume">
      <header style={{ borderBottom: `3px solid ${accent}`, paddingBottom: "0.8rem", marginBottom: "1.4rem" }}>
        <h1 style={{ color: accent, fontSize: "2rem", fontWeight: 700, margin: 0, lineHeight: 1.1 }}>{fullName}</h1>
        {contact.jobTitle && (
          <p style={{ color: "#374151", fontSize: "1.05rem", margin: "0.25rem 0 0.5rem", fontWeight: 500 }}>
            {contact.jobTitle}
          </p>
        )}
        <p style={{ color: "#4b5563", fontSize: "0.85rem", margin: 0 }}>
          {contactBits.join("  •  ")}
        </p>
      </header>

      {summary && (
        <section style={{ marginBottom: "1.2rem" }}>
          <h2 style={{ color: accent, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>
            Professional Summary
          </h2>
          <p style={{ color: "#1f2937", fontSize: "0.92rem", lineHeight: 1.55, margin: 0 }}>{summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section style={{ marginBottom: "1.2rem" }}>
          <h2 style={{ color: accent, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>
            Experience
          </h2>
          {experience.map((job, idx) => (
            <div key={idx} style={{ marginBottom: "0.9rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#111827", margin: 0 }}>
                  {job.jobTitle} {job.company && <span style={{ color: "#6b7280", fontWeight: 400 }}>· {job.company}</span>}
                </h3>
                <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                  {fmtDate(job.startDate)} — {job.current ? "Present" : fmtDate(job.endDate)}
                </span>
              </div>
              {job.location && (
                <div style={{ fontSize: "0.8rem", color: "#9ca3af", marginBottom: "0.25rem" }}>{job.location}</div>
              )}
              {job.description && (
                <div style={{ fontSize: "0.88rem", color: "#1f2937", lineHeight: 1.5, whiteSpace: "pre-line" }}>
                  {job.description}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section style={{ marginBottom: "1.2rem" }}>
          <h2 style={{ color: accent, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>
            Education
          </h2>
          {education.map((ed, idx) => (
            <div key={idx} style={{ marginBottom: "0.7rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 600, color: "#111827", margin: 0 }}>
                  {ed.degree} {ed.school && <span style={{ color: "#6b7280", fontWeight: 400 }}>· {ed.school}</span>}
                </h3>
                <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                  {fmtDate(ed.startDate)} — {fmtDate(ed.endDate)}
                </span>
              </div>
              {ed.description && (
                <div style={{ fontSize: "0.85rem", color: "#374151", marginTop: "0.2rem" }}>{ed.description}</div>
              )}
            </div>
          ))}
        </section>
      )}

      {skills.length > 0 && (
        <section style={{ marginBottom: "1rem" }}>
          <h2 style={{ color: accent, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>
            Skills
          </h2>
          <p style={{ fontSize: "0.9rem", color: "#1f2937", margin: 0, lineHeight: 1.6 }}>
            {skills.map((s) => s.name).filter(Boolean).join("  •  ")}
          </p>
        </section>
      )}

      {languages.length > 0 && (
        <section>
          <h2 style={{ color: accent, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>
            Languages
          </h2>
          <p style={{ fontSize: "0.9rem", color: "#1f2937", margin: 0 }}>
            {languages
              .filter((l) => l.name)
              .map((l) => `${l.name}${l.level ? ` (${l.level})` : ""}`)
              .join("  •  ")}
          </p>
        </section>
      )}
    </div>
  );
}
