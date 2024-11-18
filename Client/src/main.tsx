import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { EthereumContextProvider } from './contexts/contractContext.tsx'
import { BrowserRouter } from 'react-router-dom'
import { MyDataProvider } from './contexts/myDataContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
    <EthereumContextProvider>
      <MyDataProvider>
    <App />
      </MyDataProvider>
    </EthereumContextProvider>
      </BrowserRouter>
  </StrictMode>,
)
