import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/reset.css'
import './styles/fonts.css'
import './styles/tokens.css'
import App from './App.tsx'
import { LanguageProvider, useTranslation } from './i18n/LanguageContext'

// A reload always lands on the hero. The page is one long scroll-driven sequence, so being
// dropped back in mid-animation leaves half the entrances already spent. This runs at module
// scope, before the browser would restore the previous offset and before React mounts.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
window.scrollTo(0, 0)

// Keyed on the language so switching remounts the whole tree. Every section's ScrollTrigger is
// measured once on mount against the text it is pinned to, and the two languages set different
// text lengths — reusing the mounted tree would leave those triggers measuring the old copy.
function LocalizedApp() {
  const { lang } = useTranslation()
  return <App key={lang} />
}

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <LanguageProvider>
      <LocalizedApp />
    </LanguageProvider>
  </BrowserRouter>,
)
