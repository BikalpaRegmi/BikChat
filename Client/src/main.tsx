import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { EthereumContextProvider } from './contexts/contractContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EthereumContextProvider>

    <App />
    </EthereumContextProvider>
  </StrictMode>,
)