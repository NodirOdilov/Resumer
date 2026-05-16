#!/usr/bin/env python3
"""
Generate SVG preview images for all 28 Resumer templates.
Each SVG is 210x297 (A4 aspect ratio) and visually represents the template layout.

Usage:
    python generate_previews.py
"""

import os
from pathlib import Path

OUTPUT_DIR = Path(__file__).resolve().parent.parent / "static" / "templates" / "previews"

TEMPLATES = {
    "cascade": {
        "primary": "#2563EB",
        "secondary": "#DBEAFE",
        "accent": "#1E40AF",
        "layout": "sidebar_left",
        "style": "modern_sidebar",
    },
    "ceramica": {
        "primary": "#D97706",
        "secondary": "#FEF3C7",
        "accent": "#92400E",
        "layout": "top_header",
        "style": "warm_tiles",
    },
    "classic": {
        "primary": "#1F2937",
        "secondary": "#F3F4F6",
        "accent": "#374151",
        "layout": "traditional",
        "style": "simple_lines",
    },
    "concept": {
        "primary": "#7C3AED",
        "secondary": "#EDE9FE",
        "accent": "#5B21B6",
        "layout": "asymmetric",
        "style": "creative_blocks",
    },
    "crisp": {
        "primary": "#059669",
        "secondary": "#D1FAE5",
        "accent": "#047857",
        "layout": "clean",
        "style": "minimal_dividers",
    },
    "cubic": {
        "primary": "#DC2626",
        "secondary": "#FEE2E2",
        "accent": "#991B1B",
        "layout": "grid",
        "style": "block_sections",
    },
    "diamond": {
        "primary": "#0891B2",
        "secondary": "#CFFAFE",
        "accent": "#155E75",
        "layout": "centered_header",
        "style": "diamond_accents",
    },
    "dynamic": {
        "primary": "#EA580C",
        "secondary": "#FED7AA",
        "accent": "#C2410C",
        "layout": "two_column",
        "style": "angled_header",
    },
    "enfold": {
        "primary": "#4F46E5",
        "secondary": "#E0E7FF",
        "accent": "#3730A3",
        "layout": "wrapped",
        "style": "enclosed_sections",
    },
    "iconic": {
        "primary": "#0D9488",
        "secondary": "#CCFBF1",
        "accent": "#115E59",
        "layout": "icon_driven",
        "style": "icon_labels",
    },
    "impetus": {
        "primary": "#BE185D",
        "secondary": "#FCE7F3",
        "accent": "#9D174D",
        "layout": "bold_header",
        "style": "strong_contrast",
    },
    "influx": {
        "primary": "#6D28D9",
        "secondary": "#DDD6FE",
        "accent": "#4C1D95",
        "layout": "flowing",
        "style": "wave_dividers",
    },
    "initials": {
        "primary": "#1D4ED8",
        "secondary": "#BFDBFE",
        "accent": "#1E3A8A",
        "layout": "monogram",
        "style": "large_initials",
    },
    "lumina": {
        "primary": "#F59E0B",
        "secondary": "#FEF9C3",
        "accent": "#B45309",
        "layout": "bright",
        "style": "light_accents",
    },
    "minimo": {
        "primary": "#6B7280",
        "secondary": "#F9FAFB",
        "accent": "#374151",
        "layout": "minimal",
        "style": "ultra_clean",
    },
    "modern": {
        "primary": "#2563EB",
        "secondary": "#EFF6FF",
        "accent": "#1D4ED8",
        "layout": "modern_split",
        "style": "flat_design",
    },
    "muse": {
        "primary": "#EC4899",
        "secondary": "#FDF2F8",
        "accent": "#BE185D",
        "layout": "creative",
        "style": "artistic_flair",
    },
    "nanica": {
        "primary": "#10B981",
        "secondary": "#ECFDF5",
        "accent": "#065F46",
        "layout": "compact",
        "style": "tiny_sections",
    },
    "newcast": {
        "primary": "#3B82F6",
        "secondary": "#DBEAFE",
        "accent": "#1E40AF",
        "layout": "newspaper",
        "style": "column_layout",
    },
    "primo": {
        "primary": "#EF4444",
        "secondary": "#FEF2F2",
        "accent": "#B91C1C",
        "layout": "premium",
        "style": "elegant_borders",
    },
    "profile": {
        "primary": "#8B5CF6",
        "secondary": "#EDE9FE",
        "accent": "#6D28D9",
        "layout": "profile_photo",
        "style": "photo_header",
    },
    "simple": {
        "primary": "#4B5563",
        "secondary": "#F3F4F6",
        "accent": "#1F2937",
        "layout": "basic",
        "style": "plain_text",
    },
    "spectra": {
        "primary": "#06B6D4",
        "secondary": "#CFFAFE",
        "accent": "#0E7490",
        "layout": "spectrum",
        "style": "gradient_bar",
    },
    "squares": {
        "primary": "#F97316",
        "secondary": "#FFF7ED",
        "accent": "#C2410C",
        "layout": "grid_boxes",
        "style": "square_icons",
    },
    "synergy": {
        "primary": "#14B8A6",
        "secondary": "#F0FDFA",
        "accent": "#0F766E",
        "layout": "interconnected",
        "style": "linked_sections",
    },
    "valera": {
        "primary": "#A855F7",
        "secondary": "#FAF5FF",
        "accent": "#7E22CE",
        "layout": "sidebar_right",
        "style": "modern_sidebar_r",
    },
    "vibes": {
        "primary": "#F43F5E",
        "secondary": "#FFF1F2",
        "accent": "#E11D48",
        "layout": "playful",
        "style": "rounded_sections",
    },
    "vintage": {
        "primary": "#78716C",
        "secondary": "#F5F5F4",
        "accent": "#44403C",
        "layout": "retro",
        "style": "serif_ornaments",
    },
}


def _text_lines(x: float, y: float, count: int, width: float, color: str, gap: float = 8) -> str:
    """Generate placeholder text lines (thin rounded rects)."""
    lines = []
    for i in range(count):
        w = width if i < count - 1 else width * 0.6
        lines.append(
            f'<rect x="{x}" y="{y + i * gap}" width="{w}" height="3" rx="1.5" fill="{color}" opacity="0.5"/>'
        )
    return "\n    ".join(lines)


def _section_block(x: float, y: float, w: float, title_w: float, line_count: int, primary: str, text_color: str) -> str:
    """Generate a section: title bar + text lines."""
    return f"""<rect x="{x}" y="{y}" width="{title_w}" height="5" rx="2.5" fill="{primary}" opacity="0.8"/>
    {_text_lines(x, y + 12, line_count, w, text_color)}"""


def generate_sidebar_left(t: dict, name: str) -> str:
    primary, secondary = t["primary"], t["secondary"]
    accent = t["accent"]
    return f"""  <!-- Sidebar -->
    <rect x="0" y="0" width="70" height="297" fill="{primary}"/>
    <!-- Photo circle -->
    <circle cx="35" cy="40" r="18" fill="{secondary}" opacity="0.3"/>
    <circle cx="35" cy="40" r="15" fill="{secondary}" opacity="0.2"/>
    <!-- Sidebar text -->
    {_text_lines(12, 72, 3, 46, secondary, 9)}
    <!-- Sidebar sections -->
    <rect x="12" y="110" width="30" height="4" rx="2" fill="{secondary}" opacity="0.7"/>
    {_text_lines(12, 120, 4, 46, secondary, 8)}
    <rect x="12" y="160" width="26" height="4" rx="2" fill="{secondary}" opacity="0.7"/>
    {_text_lines(12, 170, 5, 46, secondary, 8)}
    <rect x="12" y="220" width="34" height="4" rx="2" fill="{secondary}" opacity="0.7"/>
    {_text_lines(12, 230, 4, 46, secondary, 8)}
    <!-- Main content -->
    <rect x="82" y="18" width="60" height="8" rx="2" fill="{accent}"/>
    {_text_lines(82, 34, 2, 110, "#9CA3AF", 7)}
    {_section_block(82, 56, 110, 45, 5, primary, "#6B7280")}
    {_section_block(82, 112, 110, 40, 4, primary, "#6B7280")}
    {_section_block(82, 162, 110, 35, 4, primary, "#6B7280")}
    {_section_block(82, 210, 110, 42, 3, primary, "#6B7280")}"""


def generate_top_header(t: dict, name: str) -> str:
    primary, secondary = t["primary"], t["secondary"]
    return f"""  <!-- Header -->
    <rect x="0" y="0" width="210" height="55" fill="{primary}"/>
    <rect x="18" y="14" width="80" height="9" rx="3" fill="white" opacity="0.9"/>
    {_text_lines(18, 30, 2, 130, "white", 7)}
    <!-- Body -->
    {_section_block(18, 68, 174, 50, 5, primary, "#6B7280")}
    {_section_block(18, 128, 174, 45, 5, primary, "#6B7280")}
    {_section_block(18, 188, 174, 40, 4, primary, "#6B7280")}
    {_section_block(18, 238, 174, 48, 3, primary, "#6B7280")}"""


def generate_traditional(t: dict, name: str) -> str:
    primary, accent = t["primary"], t["accent"]
    return f"""  <!-- Name -->
    <rect x="50" y="16" width="110" height="10" rx="2" fill="{primary}"/>
    {_text_lines(40, 32, 2, 130, "#9CA3AF", 7)}
    <line x1="18" y1="48" x2="192" y2="48" stroke="{primary}" stroke-width="1"/>
    <!-- Sections -->
    {_section_block(18, 58, 174, 50, 5, accent, "#6B7280")}
    <line x1="18" y1="110" x2="192" y2="110" stroke="#E5E7EB" stroke-width="0.5"/>
    {_section_block(18, 118, 174, 45, 5, accent, "#6B7280")}
    <line x1="18" y1="170" x2="192" y2="170" stroke="#E5E7EB" stroke-width="0.5"/>
    {_section_block(18, 178, 174, 40, 4, accent, "#6B7280")}
    <line x1="18" y1="222" x2="192" y2="222" stroke="#E5E7EB" stroke-width="0.5"/>
    {_section_block(18, 230, 174, 36, 3, accent, "#6B7280")}"""


def generate_two_column(t: dict, name: str) -> str:
    primary, secondary = t["primary"], t["secondary"]
    return f"""  <!-- Header -->
    <rect x="0" y="0" width="210" height="45" fill="{primary}"/>
    <rect x="18" y="12" width="75" height="8" rx="2" fill="white" opacity="0.9"/>
    {_text_lines(18, 26, 1, 120, "white", 7)}
    <!-- Two columns -->
    <line x1="105" y1="55" x2="105" y2="280" stroke="#E5E7EB" stroke-width="0.5" stroke-dasharray="2,2"/>
    <!-- Left column -->
    {_section_block(18, 58, 78, 35, 5, primary, "#6B7280")}
    {_section_block(18, 118, 78, 30, 4, primary, "#6B7280")}
    {_section_block(18, 168, 78, 28, 4, primary, "#6B7280")}
    <!-- Right column -->
    {_section_block(114, 58, 78, 35, 5, primary, "#6B7280")}
    {_section_block(114, 118, 78, 32, 4, primary, "#6B7280")}
    {_section_block(114, 168, 78, 30, 3, primary, "#6B7280")}"""


def generate_centered_header(t: dict, name: str) -> str:
    primary, secondary = t["primary"], t["secondary"]
    return f"""  <!-- Centered header -->
    <rect x="55" y="16" width="100" height="10" rx="3" fill="{primary}"/>
    {_text_lines(45, 32, 2, 120, "#9CA3AF", 7)}
    <!-- Diamond accent -->
    <rect x="99" y="48" width="12" height="12" rx="1" fill="{primary}" opacity="0.3" transform="rotate(45 105 54)"/>
    <!-- Sections -->
    {_section_block(18, 70, 174, 50, 5, primary, "#6B7280")}
    {_section_block(18, 130, 174, 45, 5, primary, "#6B7280")}
    {_section_block(18, 190, 174, 40, 4, primary, "#6B7280")}
    {_section_block(18, 240, 174, 36, 3, primary, "#6B7280")}"""


def generate_sidebar_right(t: dict, name: str) -> str:
    primary, secondary = t["primary"], t["secondary"]
    accent = t["accent"]
    return f"""  <!-- Main content -->
    <rect x="18" y="18" width="70" height="8" rx="2" fill="{accent}"/>
    {_text_lines(18, 34, 2, 110, "#9CA3AF", 7)}
    {_section_block(18, 56, 110, 45, 5, primary, "#6B7280")}
    {_section_block(18, 112, 110, 40, 5, primary, "#6B7280")}
    {_section_block(18, 170, 110, 35, 4, primary, "#6B7280")}
    <!-- Sidebar right -->
    <rect x="140" y="0" width="70" height="297" fill="{primary}"/>
    <circle cx="175" cy="40" r="16" fill="{secondary}" opacity="0.3"/>
    {_text_lines(150, 68, 3, 50, secondary, 8)}
    <rect x="150" y="100" width="28" height="4" rx="2" fill="{secondary}" opacity="0.7"/>
    {_text_lines(150, 110, 4, 46, secondary, 8)}
    <rect x="150" y="152" width="32" height="4" rx="2" fill="{secondary}" opacity="0.7"/>
    {_text_lines(150, 162, 5, 46, secondary, 8)}"""


def generate_grid(t: dict, name: str) -> str:
    primary, secondary = t["primary"], t["secondary"]
    return f"""  <!-- Header band -->
    <rect x="0" y="0" width="210" height="42" fill="{primary}"/>
    <rect x="18" y="10" width="85" height="9" rx="2" fill="white" opacity="0.9"/>
    {_text_lines(18, 25, 1, 140, "white", 7)}
    <!-- Grid blocks -->
    <rect x="14" y="52" width="86" height="68" rx="4" fill="{secondary}" stroke="{primary}" stroke-width="0.5"/>
    <rect x="110" y="52" width="86" height="68" rx="4" fill="{secondary}" stroke="{primary}" stroke-width="0.5"/>
    {_section_block(22, 60, 70, 30, 5, primary, "#6B7280")}
    {_section_block(118, 60, 70, 28, 5, primary, "#6B7280")}
    <rect x="14" y="130" width="86" height="60" rx="4" fill="{secondary}" stroke="{primary}" stroke-width="0.5"/>
    <rect x="110" y="130" width="86" height="60" rx="4" fill="{secondary}" stroke="{primary}" stroke-width="0.5"/>
    {_section_block(22, 138, 70, 26, 4, primary, "#6B7280")}
    {_section_block(118, 138, 70, 32, 4, primary, "#6B7280")}
    <rect x="14" y="200" width="182" height="55" rx="4" fill="{secondary}" stroke="{primary}" stroke-width="0.5"/>
    {_section_block(22, 208, 166, 40, 4, primary, "#6B7280")}"""


def generate_minimal(t: dict, name: str) -> str:
    primary, accent = t["primary"], t["accent"]
    return f"""  <!-- Ultra minimal -->
    <rect x="30" y="22" width="90" height="8" rx="2" fill="{accent}"/>
    {_text_lines(30, 36, 1, 100, "#9CA3AF", 7)}
    <line x1="30" y1="50" x2="180" y2="50" stroke="#E5E7EB" stroke-width="0.5"/>
    {_text_lines(30, 60, 5, 150, "#6B7280", 8)}
    <line x1="30" y1="110" x2="180" y2="110" stroke="#E5E7EB" stroke-width="0.5"/>
    {_text_lines(30, 120, 5, 150, "#6B7280", 8)}
    <line x1="30" y1="170" x2="180" y2="170" stroke="#E5E7EB" stroke-width="0.5"/>
    {_text_lines(30, 180, 4, 150, "#6B7280", 8)}
    <line x1="30" y1="220" x2="180" y2="220" stroke="#E5E7EB" stroke-width="0.5"/>
    {_text_lines(30, 230, 3, 150, "#6B7280", 8)}"""


def generate_bold_header(t: dict, name: str) -> str:
    primary, secondary = t["primary"], t["secondary"]
    return f"""  <!-- Bold header -->
    <rect x="0" y="0" width="210" height="70" fill="{primary}"/>
    <rect x="18" y="18" width="100" height="12" rx="3" fill="white" opacity="0.95"/>
    {_text_lines(18, 36, 2, 160, "white", 8)}
    <!-- Accent bar -->
    <rect x="0" y="70" width="210" height="4" fill="{secondary}"/>
    <!-- Content -->
    {_section_block(18, 88, 174, 50, 5, primary, "#6B7280")}
    {_section_block(18, 148, 174, 45, 5, primary, "#6B7280")}
    {_section_block(18, 208, 174, 40, 4, primary, "#6B7280")}"""


def generate_monogram(t: dict, name: str) -> str:
    primary, secondary = t["primary"], t["secondary"]
    accent = t["accent"]
    return f"""  <!-- Large initials -->
    <rect x="14" y="14" width="50" height="50" rx="6" fill="{primary}"/>
    <text x="39" y="48" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="white" text-anchor="middle">AB</text>
    <!-- Name beside initials -->
    <rect x="74" y="22" width="80" height="9" rx="2" fill="{accent}"/>
    {_text_lines(74, 38, 2, 110, "#9CA3AF", 7)}
    <!-- Sections -->
    {_section_block(18, 78, 174, 48, 5, primary, "#6B7280")}
    {_section_block(18, 138, 174, 42, 5, primary, "#6B7280")}
    {_section_block(18, 198, 174, 38, 4, primary, "#6B7280")}
    {_section_block(18, 248, 174, 44, 3, primary, "#6B7280")}"""


def generate_creative(t: dict, name: str) -> str:
    primary, secondary = t["primary"], t["secondary"]
    return f"""  <!-- Creative diagonal header -->
    <polygon points="0,0 210,0 210,50 0,70" fill="{primary}"/>
    <rect x="18" y="14" width="90" height="9" rx="3" fill="white" opacity="0.9"/>
    {_text_lines(18, 30, 1, 130, "white", 7)}
    <!-- Floating card -->
    <rect x="18" y="80" width="174" height="60" rx="6" fill="white" stroke="{primary}" stroke-width="1"/>
    {_section_block(28, 90, 154, 45, 4, primary, "#6B7280")}
    <rect x="18" y="150" width="174" height="60" rx="6" fill="white" stroke="{primary}" stroke-width="1"/>
    {_section_block(28, 160, 154, 40, 4, primary, "#6B7280")}
    <rect x="18" y="220" width="174" height="50" rx="6" fill="white" stroke="{primary}" stroke-width="1"/>
    {_section_block(28, 230, 154, 36, 3, primary, "#6B7280")}"""


def generate_flowing(t: dict, name: str) -> str:
    primary, secondary = t["primary"], t["secondary"]
    return f"""  <!-- Wave header -->
    <rect x="0" y="0" width="210" height="50" fill="{primary}"/>
    <path d="M0,50 Q52.5,65 105,50 Q157.5,35 210,50 L210,55 Q157.5,40 105,55 Q52.5,70 0,55 Z" fill="{secondary}"/>
    <rect x="18" y="12" width="85" height="9" rx="3" fill="white" opacity="0.9"/>
    {_text_lines(18, 27, 1, 120, "white", 7)}
    <!-- Sections -->
    {_section_block(18, 72, 174, 48, 5, primary, "#6B7280")}
    {_section_block(18, 132, 174, 42, 5, primary, "#6B7280")}
    {_section_block(18, 192, 174, 38, 4, primary, "#6B7280")}
    {_section_block(18, 242, 174, 44, 3, primary, "#6B7280")}"""


def generate_wrapped(t: dict, name: str) -> str:
    primary, secondary = t["primary"], t["secondary"]
    return f"""  <!-- Border frame -->
    <rect x="6" y="6" width="198" height="285" rx="4" fill="none" stroke="{primary}" stroke-width="1.5"/>
    <!-- Header inside frame -->
    <rect x="14" y="14" width="182" height="40" rx="3" fill="{secondary}"/>
    <rect x="22" y="22" width="80" height="8" rx="2" fill="{primary}"/>
    {_text_lines(22, 36, 2, 130, "#6B7280", 7)}
    <!-- Sections inside frame -->
    {_section_block(22, 66, 166, 48, 5, primary, "#6B7280")}
    {_section_block(22, 126, 166, 42, 5, primary, "#6B7280")}
    {_section_block(22, 186, 166, 38, 4, primary, "#6B7280")}
    {_section_block(22, 236, 166, 44, 3, primary, "#6B7280")}"""


def generate_icon_driven(t: dict, name: str) -> str:
    primary, secondary = t["primary"], t["secondary"]
    return f"""  <!-- Header -->
    <rect x="18" y="16" width="80" height="9" rx="3" fill="{primary}"/>
    {_text_lines(18, 32, 2, 140, "#9CA3AF", 7)}
    <!-- Icon + section pairs -->
    <circle cx="28" cy="62" r="8" fill="{secondary}" stroke="{primary}" stroke-width="0.8"/>
    {_section_block(44, 56, 148, 40, 4, primary, "#6B7280")}
    <circle cx="28" cy="112" r="8" fill="{secondary}" stroke="{primary}" stroke-width="0.8"/>
    {_section_block(44, 106, 148, 36, 4, primary, "#6B7280")}
    <circle cx="28" cy="162" r="8" fill="{secondary}" stroke="{primary}" stroke-width="0.8"/>
    {_section_block(44, 156, 148, 32, 4, primary, "#6B7280")}
    <circle cx="28" cy="212" r="8" fill="{secondary}" stroke="{primary}" stroke-width="0.8"/>
    {_section_block(44, 206, 148, 38, 3, primary, "#6B7280")}"""


def generate_gradient_bar(t: dict, name: str) -> str:
    primary, secondary = t["primary"], t["secondary"]
    accent = t["accent"]
    return f"""  <defs>
      <linearGradient id="grad_{name}" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:{primary};stop-opacity:1"/>
        <stop offset="100%" style="stop-color:{accent};stop-opacity:1"/>
      </linearGradient>
    </defs>
    <!-- Gradient top bar -->
    <rect x="0" y="0" width="210" height="6" fill="url(#grad_{name})"/>
    <!-- Header -->
    <rect x="18" y="18" width="90" height="9" rx="3" fill="{primary}"/>
    {_text_lines(18, 34, 2, 140, "#9CA3AF", 7)}
    <!-- Sections with left accent -->
    <rect x="14" y="58" width="3" height="40" rx="1.5" fill="{primary}"/>
    {_section_block(24, 58, 168, 45, 4, primary, "#6B7280")}
    <rect x="14" y="112" width="3" height="40" rx="1.5" fill="{primary}"/>
    {_section_block(24, 112, 168, 40, 4, primary, "#6B7280")}
    <rect x="14" y="166" width="3" height="40" rx="1.5" fill="{primary}"/>
    {_section_block(24, 166, 168, 36, 4, primary, "#6B7280")}
    <rect x="14" y="220" width="3" height="35" rx="1.5" fill="{primary}"/>
    {_section_block(24, 220, 168, 42, 3, primary, "#6B7280")}"""


def generate_grid_boxes(t: dict, name: str) -> str:
    primary, secondary = t["primary"], t["secondary"]
    return f"""  <!-- Header -->
    <rect x="18" y="14" width="85" height="9" rx="3" fill="{primary}"/>
    {_text_lines(18, 30, 1, 120, "#9CA3AF", 7)}
    <!-- Grid of square cards -->
    <rect x="14" y="48" width="56" height="56" rx="4" fill="{secondary}" stroke="{primary}" stroke-width="0.5"/>
    <rect x="77" y="48" width="56" height="56" rx="4" fill="{secondary}" stroke="{primary}" stroke-width="0.5"/>
    <rect x="140" y="48" width="56" height="56" rx="4" fill="{secondary}" stroke="{primary}" stroke-width="0.5"/>
    {_text_lines(20, 58, 4, 44, "#6B7280", 9)}
    {_text_lines(83, 58, 4, 44, "#6B7280", 9)}
    {_text_lines(146, 58, 4, 44, "#6B7280", 9)}
    <!-- Full width sections below -->
    {_section_block(18, 118, 174, 48, 5, primary, "#6B7280")}
    {_section_block(18, 178, 174, 42, 5, primary, "#6B7280")}
    {_section_block(18, 238, 174, 38, 3, primary, "#6B7280")}"""


def generate_newspaper(t: dict, name: str) -> str:
    primary, secondary = t["primary"], t["secondary"]
    return f"""  <!-- Newspaper header -->
    <line x1="18" y1="12" x2="192" y2="12" stroke="{primary}" stroke-width="2"/>
    <rect x="45" y="16" width="120" height="10" rx="2" fill="{primary}"/>
    <line x1="18" y1="30" x2="192" y2="30" stroke="{primary}" stroke-width="1"/>
    {_text_lines(18, 34, 1, 174, "#9CA3AF", 7)}
    <line x1="18" y1="44" x2="192" y2="44" stroke="{primary}" stroke-width="0.5"/>
    <!-- Three columns -->
    <line x1="75" y1="52" x2="75" y2="270" stroke="#E5E7EB" stroke-width="0.5"/>
    <line x1="138" y1="52" x2="138" y2="270" stroke="#E5E7EB" stroke-width="0.5"/>
    {_text_lines(18, 56, 15, 50, "#6B7280", 10)}
    {_text_lines(82, 56, 15, 50, "#6B7280", 10)}
    {_text_lines(145, 56, 15, 50, "#6B7280", 10)}"""


def generate_photo_header(t: dict, name: str) -> str:
    primary, secondary = t["primary"], t["secondary"]
    return f"""  <!-- Header with photo area -->
    <rect x="0" y="0" width="210" height="60" fill="{primary}"/>
    <circle cx="105" cy="42" r="22" fill="white"/>
    <circle cx="105" cy="42" r="20" fill="{secondary}"/>
    <!-- Name centered below -->
    <rect x="55" y="70" width="100" height="8" rx="2" fill="{primary}"/>
    {_text_lines(40, 84, 1, 130, "#9CA3AF", 7)}
    <!-- Content -->
    {_section_block(18, 100, 174, 48, 5, primary, "#6B7280")}
    {_section_block(18, 158, 174, 42, 5, primary, "#6B7280")}
    {_section_block(18, 218, 174, 38, 4, primary, "#6B7280")}"""


def generate_rounded_sections(t: dict, name: str) -> str:
    primary, secondary = t["primary"], t["secondary"]
    return f"""  <!-- Playful header -->
    <rect x="0" y="0" width="210" height="48" rx="0" fill="{primary}"/>
    <rect x="18" y="12" width="85" height="8" rx="4" fill="white" opacity="0.9"/>
    {_text_lines(18, 26, 1, 120, "white", 7)}
    <!-- Rounded section cards -->
    <rect x="14" y="58" width="182" height="52" rx="10" fill="{secondary}"/>
    {_section_block(24, 66, 162, 40, 3, primary, "#6B7280")}
    <rect x="14" y="120" width="182" height="52" rx="10" fill="{secondary}"/>
    {_section_block(24, 128, 162, 36, 3, primary, "#6B7280")}
    <rect x="14" y="182" width="182" height="52" rx="10" fill="{secondary}"/>
    {_section_block(24, 190, 162, 32, 3, primary, "#6B7280")}
    <rect x="14" y="244" width="182" height="40" rx="10" fill="{secondary}"/>
    {_section_block(24, 252, 162, 38, 2, primary, "#6B7280")}"""


def generate_retro(t: dict, name: str) -> str:
    primary, secondary = t["primary"], t["secondary"]
    accent = t["accent"]
    return f"""  <!-- Vintage ornament top -->
    <line x1="40" y1="14" x2="170" y2="14" stroke="{primary}" stroke-width="0.5"/>
    <circle cx="105" cy="14" r="3" fill="{primary}" opacity="0.5"/>
    <circle cx="40" cy="14" r="2" fill="{primary}" opacity="0.3"/>
    <circle cx="170" cy="14" r="2" fill="{primary}" opacity="0.3"/>
    <!-- Name serif style -->
    <rect x="40" y="22" width="130" height="10" rx="1" fill="{accent}"/>
    <line x1="40" y1="36" x2="170" y2="36" stroke="{primary}" stroke-width="0.5"/>
    {_text_lines(40, 42, 2, 130, "#9CA3AF", 7)}
    <line x1="40" y1="58" x2="170" y2="58" stroke="{primary}" stroke-width="0.5"/>
    <!-- Content with serif feel -->
    {_section_block(24, 68, 162, 48, 5, accent, "#6B7280")}
    <line x1="40" y1="126" x2="170" y2="126" stroke="#D1D5DB" stroke-width="0.5"/>
    {_section_block(24, 136, 162, 42, 5, accent, "#6B7280")}
    <line x1="40" y1="194" x2="170" y2="194" stroke="#D1D5DB" stroke-width="0.5"/>
    {_section_block(24, 204, 162, 38, 4, accent, "#6B7280")}
    <!-- Ornament bottom -->
    <line x1="40" y1="260" x2="170" y2="260" stroke="{primary}" stroke-width="0.5"/>
    <circle cx="105" cy="260" r="3" fill="{primary}" opacity="0.5"/>"""


def generate_interconnected(t: dict, name: str) -> str:
    primary, secondary = t["primary"], t["secondary"]
    return f"""  <!-- Header -->
    <rect x="18" y="16" width="85" height="9" rx="3" fill="{primary}"/>
    {_text_lines(18, 32, 2, 140, "#9CA3AF", 7)}
    <!-- Connected sections with line -->
    <line x1="28" y1="56" x2="28" y2="260" stroke="{primary}" stroke-width="1" opacity="0.3"/>
    <circle cx="28" cy="62" r="4" fill="{primary}"/>
    {_section_block(40, 56, 150, 42, 4, primary, "#6B7280")}
    <circle cx="28" cy="112" r="4" fill="{primary}"/>
    {_section_block(40, 106, 150, 38, 4, primary, "#6B7280")}
    <circle cx="28" cy="162" r="4" fill="{primary}"/>
    {_section_block(40, 156, 150, 34, 4, primary, "#6B7280")}
    <circle cx="28" cy="212" r="4" fill="{primary}"/>
    {_section_block(40, 206, 150, 40, 3, primary, "#6B7280")}
    <circle cx="28" cy="254" r="4" fill="{primary}"/>
    {_section_block(40, 248, 150, 36, 2, primary, "#6B7280")}"""


def generate_elegant_borders(t: dict, name: str) -> str:
    primary, secondary = t["primary"], t["secondary"]
    accent = t["accent"]
    return f"""  <!-- Double border header -->
    <rect x="10" y="10" width="190" height="50" rx="2" fill="none" stroke="{primary}" stroke-width="1.5"/>
    <rect x="13" y="13" width="184" height="44" rx="1" fill="none" stroke="{primary}" stroke-width="0.5"/>
    <rect x="30" y="20" width="100" height="9" rx="2" fill="{primary}"/>
    {_text_lines(30, 36, 2, 150, "#9CA3AF", 7)}
    <!-- Sections with left border -->
    <rect x="16" y="72" width="2" height="42" fill="{primary}"/>
    {_section_block(26, 72, 166, 45, 4, accent, "#6B7280")}
    <rect x="16" y="126" width="2" height="42" fill="{primary}"/>
    {_section_block(26, 126, 166, 40, 4, accent, "#6B7280")}
    <rect x="16" y="180" width="2" height="42" fill="{primary}"/>
    {_section_block(26, 180, 166, 36, 4, accent, "#6B7280")}
    <rect x="16" y="234" width="2" height="35" fill="{primary}"/>
    {_section_block(26, 234, 166, 42, 3, accent, "#6B7280")}"""


# Map layout types to generator functions
LAYOUT_GENERATORS = {
    "sidebar_left": generate_sidebar_left,
    "top_header": generate_top_header,
    "traditional": generate_traditional,
    "asymmetric": generate_creative,
    "clean": generate_minimal,
    "grid": generate_grid,
    "centered_header": generate_centered_header,
    "two_column": generate_two_column,
    "wrapped": generate_wrapped,
    "icon_driven": generate_icon_driven,
    "bold_header": generate_bold_header,
    "flowing": generate_flowing,
    "monogram": generate_monogram,
    "bright": generate_top_header,
    "minimal": generate_minimal,
    "modern_split": generate_two_column,
    "creative": generate_creative,
    "compact": generate_minimal,
    "newspaper": generate_newspaper,
    "premium": generate_elegant_borders,
    "profile_photo": generate_photo_header,
    "basic": generate_traditional,
    "spectrum": generate_gradient_bar,
    "grid_boxes": generate_grid_boxes,
    "interconnected": generate_interconnected,
    "sidebar_right": generate_sidebar_right,
    "playful": generate_rounded_sections,
    "retro": generate_retro,
}


def generate_svg(name: str, config: dict) -> str:
    """Generate a complete SVG for a given template."""
    layout = config["layout"]
    generator = LAYOUT_GENERATORS.get(layout, generate_traditional)
    inner = generator(config, name)

    return f"""<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 297" width="210" height="297">
  <!-- Background -->
  <rect width="210" height="297" fill="white"/>

  <!-- Template: {name} -->
  {inner}

  <!-- Template name label -->
  <rect x="0" y="280" width="210" height="17" fill="white" opacity="0.85"/>
  <text x="105" y="293" font-family="Arial, Helvetica, sans-serif" font-size="7" font-weight="600"
        fill="{config['primary']}" text-anchor="middle" letter-spacing="1.5">
    {name.upper()}
  </text>
</svg>"""


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    generated = []
    for name, config in TEMPLATES.items():
        svg_content = generate_svg(name, config)
        output_path = OUTPUT_DIR / f"{name}.svg"
        output_path.write_text(svg_content, encoding="utf-8")
        generated.append(name)
        print(f"  Generated: {output_path.name}")

    print(f"\nDone! Generated {len(generated)} SVG preview images in:")
    print(f"  {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
