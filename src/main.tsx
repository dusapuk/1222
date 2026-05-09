import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initMarketplaceData } from './lib/data'

const rootEl = document.getElementById('root')!

// Marketplace catalogue is fetched as a separate static asset
// (`/data/marketplace.json`) instead of being inlined in the JS bundle.
// We block the React mount on it so all components see populated data.
// On failure we still mount the app — pages will render their empty /
// "not found" branches and surface the issue to the user.
initMarketplaceData()
  .catch((err) => {
    console.error('[marketplace] failed to load /data/marketplace.json', err)
  })
  .finally(() => {
    createRoot(rootEl).render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  })
