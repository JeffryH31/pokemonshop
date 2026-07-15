import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { router } from './router'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#16161f',
            color: '#f0ece4',
            border: '1px solid #2a2a38',
            borderRadius: '12px',
            fontSize: '13px',
          },
          success: {
            iconTheme: {
              primary: '#e5b13a',
              secondary: '#0a0a0f',
            },
          },
          error: {
            iconTheme: {
              primary: '#f87171',
              secondary: '#0a0a0f',
            },
          },
        }}
      />
    </QueryClientProvider>
  )
}
