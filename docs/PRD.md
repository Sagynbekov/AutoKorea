# Product Requirements Document (PRD) - AutoKorea

## 1. Overview
| Item | Description |
| :--- | :--- |
| **What** | A web-based platform for browsing and managing Korean car inventory for export. |
| **Who** | Enthusiasts and dealers looking to buy cars directly from South Korea. |
| **Why** | To provide a disciplined, transparent way to see car specs, pricing, and shipping status. |

## 2. Core Features (MVP)
1. **Car Catalog**: List of available cars with filters (brand, year, price).
2. **Search**: Instant search by VIN or model name.
3. **Vehicle Details**: Page showing photo gallery, engine specs, and technical condition.
4. **Export Calculator**: Simple tool to estimate shipping costs from Korea to the target port.

## 3. Non-Goals (CRITICAL!)
- **No Online Payments**: We won't handle credit cards or crypto in v1.
- **No Real-time Chat**: Users will use external WhatsApp/Telegram.
- **No User Profiles**: Admin only dashboard, browse for everyone else.
- **No Native Mobile App**: Web-only (responsive).

## 4. Technical Constraints
- **Language**: TypeScript (Strict mode).
- **Frontend**: React 19 + Vite.
- **Styling**: Tailwind CSS (Mobile-first).
- **Animation**: `motion/react` for smooth transitions.
- **Storage**: Local state or simple JSON for prototype phase.

## 5. Success Criteria
- [ ] Users can filter the car list in under 1 second.
- [ ] Images load lazily to prevent lag.
- [ ] PRD-compliant folder structure confirmed.
- [ ] `npm run lint` and `npm test` pass before any commit.

## 6. Implementation Phases
### Phase 1: Foundation (Current)
- Setup project structure, GEMINI.md, and basic routing.
- **Verification**: `npm run dev` shows an empty catalog grid.

### Phase 2: Core Logic
- Implement Car Service and Catalog components.
- **Verification**: Data is fetched from `src/services/car-service.ts`.
