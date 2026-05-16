'use client';

import { useBuilderStore } from '@/stores/builderStore';
import { Button } from '@/components/ui/button';
import { SECTIONS } from '@/components/builder/BuilderSidebar';
import { ContactSection } from '@/components/builder/sections/ContactSection';
import { SummarySection } from '@/components/builder/sections/SummarySection';
import { ExperienceSection } from '@/components/builder/sections/ExperienceSection';
import { EducationSection } from '@/components/builder/sections/EducationSection';
import { SkillsSection } from '@/components/builder/sections/SkillsSection';
import { LanguagesSection } from '@/components/builder/sections/LanguagesSection';
import { CertificatesSection } from '@/components/builder/sections/CertificatesSection';
import { ProjectsSection } from '@/components/builder/sections/ProjectsSection';
import { AwardsSection } from '@/components/builder/sections/AwardsSection';
import { VolunteerSection } from '@/components/builder/sections/VolunteerSection';
import { InterestsSection } from '@/components/builder/sections/InterestsSection';
import { CustomSection } from '@/components/builder/sections/CustomSection';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const SECTION_COMPONENTS: Record<string, React.ComponentType> = {
  contact: ContactSection,
  summary: SummarySection,
  experience: ExperienceSection,
  education: EducationSection,
  skills: SkillsSection,
  languages: LanguagesSection,
  certificates: CertificatesSection,
  projects: ProjectsSection,
  awards: AwardsSection,
  volunteer: VolunteerSection,
  hobbies: InterestsSection,
  custom_sections: CustomSection,
};

export function BuilderForm() {
  const activeSection = useBuilderStore((s) => s.activeSection);
  const setActiveSection = useBuilderStore((s) => s.setActiveSection);

  const currentIndex = SECTIONS.findIndex((s) => s.id === activeSection);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < SECTIONS.length - 1;

  const SectionComponent = SECTION_COMPONENTS[activeSection] || ContactSection;

  const goToPrev = () => {
    if (hasPrev) {
      setActiveSection(SECTIONS[currentIndex - 1].id);
    }
  };

  const goToNext = () => {
    if (hasNext) {
      setActiveSection(SECTIONS[currentIndex + 1].id);
    }
  };

  const addSection = () => {
    setActiveSection('custom_sections');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="min-h-[400px]">
        <SectionComponent />
      </div>

      <div className="flex items-center justify-between border-t border-gray-200 pt-4">
        <Button
          variant="outline"
          onClick={goToPrev}
          disabled={!hasPrev}
          className="gap-1.5"
        >
          <ChevronLeft className="h-4 w-4" />
          Назад
        </Button>

        <Button
          variant="ghost"
          onClick={addSection}
          className="gap-1.5 text-[#0D47A1]"
        >
          <Plus className="h-4 w-4" />
          Добавить раздел
        </Button>

        <Button
          onClick={goToNext}
          disabled={!hasNext}
          className="gap-1.5"
        >
          Далее
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
