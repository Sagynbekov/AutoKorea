# CLAUDE.md (AI Instructions)

## Project: AutoKorea
A disciplined car export marketplace built with React + Vite + TypeScript.

## Commands
- `npm run dev`          # Start development server
- `npm run build`        # Production build
- `npm run lint`         # Check code style and architecture
- `npm test`             # Run vitest suite
- `npm run verify:arch`  # Run dependency-cruiser checks

## Structure
- `src/api/`        # API client and response types
- `src/components/` # React UI components (Atom/Molecule style)
- `src/services/`   # Business logic (filtering, calculations)
- `src/models/`     # TypeScript interfaces and domain schemas
- `src/__tests__/`  # Unit tests mirroring src structure
- `src/reference/`  # Canonical examples to follow

## Decisions & Style
- **Architecture**: Layered (Components -> Services -> Models).
- **Naming**: `kebab-case` for files, `PascalCase` for components.
- **Exports**: Named exports only, no `default export`.
- **State**: Use React Context for global app state, local state for UI.
- **AI Rule**: ALWAYS follow the EPCV (Explore -> Plan -> Code -> Verify) cycle.

## Boundaries (CRITICAL)
- **ALWAYS**: Consult `docs/PRD.md` before new features.
- **ALWAYS**: Use `const` and `async/await`.
- **NEVER**: Use `any` type — use specific interfaces.
- **NEVER**: Commit without passing `npm test`.
- **ASK FIRST**: Before adding any major NPM package.
