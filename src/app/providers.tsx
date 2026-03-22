/**
 * Providers — root provider composition shell.
 * Phase 1: placeholder only.
 * Phase 2+: wire theme context, session/auth context, query client, etc.
 */
import type { ReactNode } from 'react'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  // Phase 2: wrap with QueryClientProvider, SessionProvider, ThemeProvider, etc.
  return <>{children}</>
}
