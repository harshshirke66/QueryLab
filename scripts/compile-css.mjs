import { __unstable__loadDesignSystem } from '@tailwindcss/node';
import fs from 'fs';
import path from 'path';

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next') {
        results = results.concat(getFiles(full));
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.jsx') || file.endsWith('.js')) {
      results.push(full);
    }
  });
  return results;
}

async function buildCss() {
  const allFiles = getFiles('src');
  console.log(`[QUERYLAB] Scanning ${allFiles.length} source files for Tailwind classes...`);

  const candidates = new Set();
  for (const f of allFiles) {
    const content = fs.readFileSync(f, 'utf8');
    // Extract className strings
    const classAttrMatches = content.match(/className=(?:{[^}]+}|["'][^"']+["'])/g) || [];
    for (const match of classAttrMatches) {
      const tokens = match.match(/[a-zA-Z0-9_\-\/\[\]#:%.:><]+/g) || [];
      for (const t of tokens) {
        if (!t.startsWith('class') && !t.startsWith('const') && !t.startsWith('return')) {
          candidates.add(t);
        }
      }
    }
    // Also extract raw tokens
    const allTokens = content.match(/[a-zA-Z0-9_\-\/\[\]#:%.:><]+/g) || [];
    for (const t of allTokens) {
      if (t.length >= 2 && !t.includes('//') && !t.includes('/*')) {
        candidates.add(t);
      }
    }
  }

  // Ensure essential font-size and spacing tokens are always included
  const essentialCandidates = [
    'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl', 'text-6xl', 'text-7xl', 'text-8xl',
    'sm:text-sm', 'sm:text-base', 'sm:text-lg', 'sm:text-xl', 'sm:text-2xl', 'sm:text-3xl', 'sm:text-4xl', 'sm:text-5xl', 'sm:text-6xl', 'sm:text-7xl',
    'lg:text-sm', 'lg:text-base', 'lg:text-lg', 'lg:text-xl', 'lg:text-2xl', 'lg:text-3xl', 'lg:text-4xl', 'lg:text-5xl', 'lg:text-6xl', 'lg:text-7xl',
    'font-thin', 'font-normal', 'font-medium', 'font-semibold', 'font-bold', 'font-extrabold', 'font-black',
    'tracking-tighter', 'tracking-tight', 'tracking-normal', 'tracking-wide', 'tracking-wider', 'tracking-widest',
    'leading-none', 'leading-tight', 'leading-snug', 'leading-normal', 'leading-relaxed', 'leading-loose',
    'h-12', 'h-14', 'h-16', 'h-20', 'w-12', 'w-14', 'w-16', 'w-20',
    'gap-1', 'gap-2', 'gap-3', 'gap-4', 'gap-6', 'gap-8',
    'p-1', 'p-2', 'p-3', 'p-4', 'p-6', 'p-8',
    'px-2', 'px-3', 'px-4', 'px-5', 'px-6', 'px-8',
    'py-1', 'py-1.5', 'py-2', 'py-2.5', 'py-3', 'py-4',
  ];
  for (const ec of essentialCandidates) {
    candidates.add(ec);
  }

  console.log(`[QUERYLAB] Extracted ${candidates.size} candidate tokens.`);

  const design = await __unstable__loadDesignSystem('@import "tailwindcss";', { base: process.cwd() });
  const rawGeneratedRules = design.candidatesToCss([...candidates]);
  const generatedCss = rawGeneratedRules.join('\n');

  console.log(`[QUERYLAB] Generated ${rawGeneratedRules.length} utility CSS rules.`);

  // Extract Tailwind Theme Variables (ensures text-6xl, text-7xl, colors, shadows all resolve correctly)
  let tailwindThemeVars = '';
  for (const [key, entry] of design.theme.entries()) {
    if (entry && entry.value) {
      tailwindThemeVars += `  ${key}: ${entry.value};\n`;
    }
  }

  // Custom QueryLab Theme & Base Tokens
  const themeAndBase = `/*! QUERYLAB Design System v1.0 | Handcrafted for Data Analytics */

:root {
  /* Tailwind v4 Built-in Theme Values */
${tailwindThemeVars}

  /* QueryLab Custom Design System Colors */
  --bg-base: #0B0D10;
  --bg-secondary: #11151B;
  --bg-surface: #171C24;
  --bg-elevated: #1D2430;
  --border-base: #29313D;
  --border-subtle: #1F2733;
  --text-primary: #F4F5F7;
  --text-secondary: #969EAA;
  --text-muted: #64748B;
  --accent-lime: #A3E635;
  --accent-lime-hover: #8ECE2B;
  --accent-indigo: #7C9EFF;
  --accent-indigo-hover: #658BF2;

  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
  --radius-full: 9999px;
  --spacing: 0.25rem;

  --container-sm: 24rem;
  --container-md: 28rem;
  --container-lg: 32rem;
  --container-xl: 36rem;
  --container-2xl: 42rem;
  --container-3xl: 48rem;
  --container-4xl: 56rem;
  --container-5xl: 64rem;
  --container-6xl: 72rem;
  --container-7xl: 80rem;
}

* {
  box-sizing: border-box;
  border-color: #29313D;
}

html, body {
  background-color: #0B0D10;
  color: #F4F5F7;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", "Geist", sans-serif;
  margin: 0;
  padding: 0;
  min-height: 100%;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  cursor: pointer;
  background: transparent;
  border: none;
  font-family: inherit;
  color: inherit;
}

input, select, textarea {
  font-family: inherit;
  color: inherit;
}

code, pre, .font-mono {
  font-family: ui-monospace, SFMono-Regular, "Geist Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

/* Custom scrollbars */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: #0B0D10; }
::-webkit-scrollbar-thumb { background: #29313D; border-radius: 9999px; }
::-webkit-scrollbar-thumb:hover { background: #3E4A5C; }

/* Utility: hide scrollbars completely */
.no-scrollbar::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
}
.no-scrollbar {
  -ms-overflow-style: none !important;
  scrollbar-width: none !important;
}

/* Subtle Linear-style grid */
.bg-grid-subtle {
  background-size: 32px 32px;
  background-image: 
    linear-gradient(to right, rgba(41, 49, 61, 0.35) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(41, 49, 61, 0.35) 1px, transparent 1px);
}

.bg-radial-fade {
  background: radial-gradient(circle at 50% 20%, rgba(163, 230, 53, 0.08) 0%, transparent 60%);
}

.glow-lime-sm {
  box-shadow: 0 0 20px -5px rgba(163, 230, 53, 0.3);
}

.glow-lime {
  box-shadow: 0 0 35px -5px rgba(163, 230, 53, 0.45);
}
`;

  const finalCss = themeAndBase + '\n\n' + generatedCss;
  fs.writeFileSync('src/app/globals.css', finalCss);
  console.log(`[QUERYLAB] Wrote ${finalCss.length} bytes into src/app/globals.css!`);
}

buildCss();
