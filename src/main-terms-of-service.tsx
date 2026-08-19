import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/reset.css'
import './styles/fonts.css'
import './styles/tokens.css'
import TermsOfServicePage from './pages/legal/TermsOfServicePage'
import { LanguageProvider } from './i18n/LanguageContext'

if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
window.scrollTo(0, 0)

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <LanguageProvider>
      <TermsOfServicePage />
    </LanguageProvider>
  </BrowserRouter>,
)
