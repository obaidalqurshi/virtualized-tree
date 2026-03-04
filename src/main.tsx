import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {PrimeReactProvider} from 'primereact/api'
import Tailwind from 'primereact/passthrough/tailwind';
import 'primeicons/primeicons.css';
        

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrimeReactProvider value={{ pt: Tailwind}}>
    <App />
    </PrimeReactProvider>
  </StrictMode>,
)
