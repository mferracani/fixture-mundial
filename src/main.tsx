import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import { ResultsProvider } from './store/results'
import { SettingsProvider } from './store/settings'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: true,
      gcTime: 1000 * 60 * 60, // 1h: mantener cache para mostrar última data
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <ResultsProvider>
          <App />
        </ResultsProvider>
      </SettingsProvider>
    </QueryClientProvider>
  </StrictMode>,
)
