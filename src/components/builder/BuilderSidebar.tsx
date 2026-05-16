'use client';

import { useMemo } from 'react';
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Wrench,
  Languages,
  Award,
  FolderKanban,
  Trophy,
  Heart,
  Gamepad2,
  LayoutList,
  Check,
  GripVertical,
} from 'lucide-react';
import { useBuilderStore } from '@/stores/builderStore';
import { cn } from '@/lib/utils';

export interface SidebarSection {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const SECTIONS: SidebarSection[] = [
  { id: 'contact', label: 'Контакты', icon: <User className="h-4 w-4" /> },
  { id: 'summary', label: 'Описание', icon: <FileText className="h-4 w-4" /> },
  { id: 'experience', label: 'Опыт работы', icon: <Briefcase className="h-4 w-4" /> },
  { id: 'education', label: 'Образование', icon: <GraduationCap className="h-4 w-4" /> },
  { id: 'skills', label: 'Навыки', icon: <Wrench className="h-4 w-4" /> },
  { id: 'languages', label: 'Языки', icon: <Languages className="h-4 w-4" /> },
  { id: 'certificates', label: 'Сертификаты', icon: <Award className="h-4 w-4" /> },
  { id: 'projects', label: 'Проекты', icon: <FolderKanban className="h-4 w-4" /> },
  { id: 'awards', label: 'Награды', icon: <Trophy className="h-4 w-4" /> },
  { id: 'volunteer', label: 'Волонтёрство', icon: <Heart className="h-4 w-4" /> },
  { id: 'hobbies', label: 'Хобби', icon: <Gamepad2 className="h-4 w-4" /> },
  { id: 'custom_sections', label: 'Свой раздел', icon: <LayoutList className="h-4 w-4" /> },
];

export function BuilderSidebar() {
  const activeSection = useBuilderStore((s) => s.activeSection);
  const setActiveSection = useBuilderStore((s) => s.setActiveSection);
  const content = useBuilderStore((s) => s.content);

  const completedSections = useMemo(() => {
    const completed = new Set<string>();
    for (const section of SECTIONS) {
      const data = content[section.id];
      if (!data) continue;
      if (typeof data === 'string' && data.trim().length > 0) {
        completed.add(section.id);
      } else if (Array.isArray(data) && data.length > 0) {
        completed.add(section.id);
      } else if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
        const values = Object.values(data as Record<string, unknown>);
        if (values.some((v) => typeof v === 'string' && v.trim().length > 0)) {
          completed.add(section.id);
        }
      }
    }
    return completed;
  }, [content]);

  return (
    <nav className="flex flex-col gap-0.5">
      {SECTIONS.map((section) => {
        const isActive = activeSection === section.id;
        const isCompleted = completedSections.has(section.id);

        return (
          <button
            key={section.id}
            type="button"
            onClick={() => setActiveSection(section.id)}
            className={cn(
              'group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-[#0D47A1] text-white'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            )}
          >
            <GripVertical
              className={cn(
                'h-3.5 w-3.5 shrink-0 cursor-grab opacity-0 transition-opacity group-hover:opacity-40',
                isActive && 'opacity-0 group-hover:opacity-60'
              )}
            />
            <span className={cn('shrink-0', isActive ? 'text-white' : 'text-gray-400')}>
              {section.icon}
            </span>
            <span className="flex-1 text-left">{section.label}</span>
            {isCompleted && (
              <span
                className={cn(
                  'flex h-5 w-5 items-center justify-center rounded-full',
                  isActive ? 'bg-white/20' : 'bg-green-100'
                )}
              >
                <Check
                  className={cn(
                    'h-3 w-3',
                    isActive ? 'text-white' : 'text-green-600'
                  )}
                />
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}

export { SECTIONS };
