/**
 * services/api.ts
 *
 * Phase 1: Base API client stub.
 * Phase 2+: Wire real HTTP transport (fetch/axios/ky) + auth headers.
 *
 * Service layer responsibilities:
 * - API clients and request functions
 * - Mutation / query service wrappers
 * - Auth / session service helpers
 * - Transport adapters and normalized response mapping
 *
 * Must NOT contain: UI rendering, page composition, domain component markup.
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

// Phase 2+: configuredApiClient = createApiClient({ baseUrl: API_BASE_URL })
// Phase 2+: Auth token injection, error normalization, retry policy
