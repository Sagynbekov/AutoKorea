# GEMINI.md

## Commands
- `npm run dev` - Start dev server (port 3000)
- `npm run build` - Production build
- `npm run lint` - Run linter check

## Structure
- `docs/PRD.md` - Product Requirements Document
- `src/components/` - UI components (React)
- `src/services/` - Business logic and API calls
- `src/models/` - Data types and schemas
- `src/__tests__/` - Unit and integration tests

## Style
- Use Tailwind CSS for styling
- Use `motion` (from `motion/react`) for animations
- Functional components with TypeScript
- Named exports preferred over default exports

## Boundaries
- **ALWAYS**: Consult `docs/PRD.md` before starting a task.
- **ALWAYS**: Use the EPCV cycle (Explore -> Plan -> Code -> Verify).
- **NEVER**: Implement features not listed in the PRD Core Features.
- **ASK FIRST**: Before adding new npm dependencies.
- **ASK FIRST**: Before changing the established file structure.
