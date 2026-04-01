# Project Guidelines

## Code Style

- Use TypeScript and React function components (`.tsx`) under `src/`.
- Respect strict TypeScript settings from `tsconfig.app.json` (`strict`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`).
- Keep imports and module syntax compatible with bundler mode (`moduleResolution: "bundler"`, `verbatimModuleSyntax: true`).
- Follow existing ESLint flat config in `eslint.config.js`; do not disable rules unless explicitly requested.

## Architecture

- Keep the current single-entry React app structure unless a task requires expansion:
- `src/main.tsx`: app bootstrap and root render.
- `src/App.tsx`: top-level UI composition.
- `src/index.css`: global styles and Tailwind integration.
- Preserve the Vite plugin stack in `vite.config.ts` (React + React Compiler Babel preset + Tailwind).
- Use `react-router` for application routing and prefer route-based organization in `src/routes` or `src/pages` as the app grows.

## Build and Test

- Install dependencies with `bun install` (lockfile is `bun.lock`).
- Run development server with `bun run dev`.
- Build with `bun run build`.
- Lint with `bun run lint`.
- Preview production build with `bun run preview`.

## Conventions

- Prefer small, focused components and colocate feature code in `src/` as the project grows.
- Keep global styling concerns in `src/index.css`; add component-specific styling close to components when introduced.
- Prefer `shadcn/ui` as the default component foundation for new UI building blocks.
- Prefer `lucide-react` for icons to keep iconography consistent across the app.
- Use `framer-motion` only when animations bring clear UX value; avoid decorative motion by default.
- Avoid adding new tooling/config unless required by the task.

## Design Workflow

- A Stitch MCP server setup is available in `.vscode/` and is used for website mockups.
- When implementing screens from mockups, align implementation with Stitch outputs and keep consistency with project conventions.

## References

- Project overview notes: `README.md`.
- Lint configuration: `eslint.config.js`.
- TypeScript app config: `tsconfig.app.json`.
- Build tooling: `vite.config.ts`.
