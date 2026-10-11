import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import GrowthOS from './GrowthOS.jsx'
import './growth.css'

createRoot(document.getElementById('growth-root')).render(
  <StrictMode>
    <GrowthOS />
  </StrictMode>,
)
