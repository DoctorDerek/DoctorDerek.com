# DoctorDerek.com

The personal website of [Dr. Derek Austin](https://doctorderek.com).

## Tech Stack

This repository contains the frontend source code for my website.

- **Framework:** Next.js 16, React 19
- **Language:** TypeScript 6 (Strict Mode)
- **Styling:** Tailwind CSS v4
- **State Management:** XState v5
- **Animations:** Tailwind CSS, Motion, and Rive

## Architectural Highlights

- **Deterministic Global State:** UI timing logic—such as the SVG background cross-fade and 3D logo perspective toggling—is orchestrated outside of React using a parallel state machine (`machines/globalMachine.ts` and XState v5). This safely decouples state from the render cycle, preventing race conditions.
- **AI-Assisted Architecture:** Built utilizing LLM-assisted workflows to accelerate development, with strict architectural constraints—such as strict static typing and single-responsibility components—to prevent technical debt.
- **Main-Thread Optimization:** Heavy visual assets are offloaded to maintain a 60fps scrolling experience. The background particle engine runs in raw HTML5 Canvas (`components/ParticleCanvas.tsx`), while interactive vector graphics utilize the Rive runtime (`@rive-app/react-canvas`), minimizing DOM repaints.

## Links

- [Live Website](https://doctorderek.com)
- [Medium Blog (@DoctorDerek)](https://doctorderek.medium.com/)
- [GitHub (@DoctorDerek)](https://github.com/DoctorDerek)

## Local Development

Use [fnm](https://github.com/Schniz/fnm) for Node version management and [pnpm](https://pnpm.io/) as the package manager:

```bash
fnm use
corepack enable pnpm
pnpm install
pnpm dev
```
