# DoctorDerek.com

[![Production](https://img.shields.io/website?url=https%3A%2F%2Fwww.doctorderek.com%2F&up_message=live&down_message=offline&label=production&logo=vercel&logoColor=white)](https://www.doctorderek.com/) [![Codecov](https://codecov.io/gh/DoctorDerek/DoctorDerek.com/graph/badge.svg)](https://app.codecov.io/gh/DoctorDerek/DoctorDerek.com) [![Test and Lint](https://github.com/DoctorDerek/DoctorDerek.com/actions/workflows/test-and-lint.yml/badge.svg)](https://github.com/DoctorDerek/DoctorDerek.com/actions/workflows/test-and-lint.yml) [![Playwright](https://github.com/DoctorDerek/DoctorDerek.com/actions/workflows/playwright.yml/badge.svg)](https://github.com/DoctorDerek/DoctorDerek.com/actions/workflows/playwright.yml)

The public website and engineering portfolio of [Dr. Derek Austin](https://www.doctorderek.com/), built to present six live projects and the engineering behind them.

## Tech Stack

This repository contains the full-stack Next.js source code for my public portfolio hub.

- **Framework:** Next.js 16, React 19
- **Language:** TypeScript 6 (Strict Mode)
- **Styling:** Tailwind CSS v4
- **State:** XState v5
- **Motion and Rendering:** Motion, Rive, HTML Canvas, and fullPage.js
- **Quality:** Vitest, React Testing Library, Playwright, and Codecov
- **Deployment:** Vercel and GitHub Actions

## Architectural Highlights

- **Deterministic Global State:** An XState parallel machine owns logo and background transitions outside the React render cycle (`machines/globalMachine.ts`).
- **Motion-Aware Interaction:** The browser’s `prefers-reduced-motion` signal controls fullPage.js effects, Motion transitions, Rive ambience, and particle rendering.
- **Server-Rendered Publishing Feed:** Next.js fetches, cleans, and revalidates the live Medium RSS feed before handing posts to the client experience.
- **AI-Assisted Engineering with Human Verification:** Functional specifications and persistent project context guide implementation; strict TypeScript, automated tests, and manual QA verify the result.

## Links

- [Live Website](https://www.doctorderek.com/)
- [Medium Blog (@DoctorDerek)](https://doctorderek.medium.com/)
- [GitHub (@DoctorDerek)](https://github.com/DoctorDerek)

## Local Development

Use [fnm](https://github.com/Schniz/fnm) for Node version management and [pnpm](https://pnpm.io/) as the package manager. In PowerShell:

```powershell
fnm env --use-on-cd | Out-String | Invoke-Expression
fnm use
corepack enable pnpm
pnpm install
pnpm dev
```

## Verification

Run the complete local quality gate before submitting changes:

```powershell
pnpm format
pnpm lint
pnpm exec tsc --noEmit
pnpm exec vitest run --coverage
pnpm build
pnpm test:e2e
pnpm audit --prod
```
