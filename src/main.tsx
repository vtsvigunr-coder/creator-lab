import { createRoot } from 'react-dom/client'
import './styles/reset.css'
import './styles/fonts.css'
import './styles/tokens.css'
import App from './App.tsx'

// A reload always lands on the hero. The page is one long scroll-driven sequence, so being
// dropped back in mid-animation leaves half the entrances already spent. This runs at module
// scope, before the browser would restore the previous offset and before React mounts.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
window.scrollTo(0, 0)

createRoot(document.getElementById('root')!).render(<App />)
