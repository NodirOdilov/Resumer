"""One-shot fix for src/app/[locale]/.../page.tsx files that re-export
server-component pages while marking themselves as `'use client'`.

Run once: `python scripts/fix-locale-pages.py`

The original pattern (all 30+ files) looks like:

    'use client';
    import { useEffect } from 'react';
    import { useTranslation } from 'react-i18next';
    import OriginalPage from '@/app/(...)/.../page';

    const localeMap: Record<string, string> = { ... };

    export default function LocaleXxxPage({ params }: { ... }) {
      const { i18n } = useTranslation();
      useEffect(() => { ... }, [params.locale, i18n]);
      return <OriginalPage />;
    }

This breaks Next.js 15 because OriginalPage exports `metadata`, which is
disallowed when imported by a `'use client'` boundary. The fix is to keep
the page as a server component and move the locale-sync into a small
client child component (`LocaleSync`).
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LOCALE_DIR = ROOT / "src" / "app" / "[locale]"

# Match any import of an (auth) or (content) page module via the @/ alias.
IMPORT_RE = re.compile(
    r"import\s+(\w+)\s+from\s+['\"](@/app/\((?:auth|content|galleries|legal|marketing|tools|app)\)/[^'\"]+)['\"]"
)

NEW_TEMPLATE = """\
import LocaleSync from "@/components/shared/LocaleSync";
import {component} from "{path}";

export default async function Page({{
  params,
}}: {{
  params: Promise<{{ locale: string }}>;
}}) {{
  const {{ locale }} = await params;
  return (
    <>
      <LocaleSync locale={{locale}} />
      <{component} />
    </>
  );
}}
"""


def fix_file(file: Path) -> bool:
    src = file.read_text(encoding="utf-8")
    if "'use client'" not in src and '"use client"' not in src:
        return False
    m = IMPORT_RE.search(src)
    if not m:
        return False
    component = m.group(1)
    path = m.group(2)
    new = NEW_TEMPLATE.format(component=component, path=path)
    file.write_text(new, encoding="utf-8")
    return True


def main() -> int:
    if not LOCALE_DIR.exists():
        print(f"!! Locale dir not found: {LOCALE_DIR}", file=sys.stderr)
        return 1

    fixed = 0
    skipped = 0
    for page in LOCALE_DIR.rglob("page.tsx"):
        if fix_file(page):
            fixed += 1
            print(f"  + fixed: {page.relative_to(ROOT)}")
        else:
            skipped += 1
    print(f"\nDone. Fixed {fixed}, skipped {skipped}.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
