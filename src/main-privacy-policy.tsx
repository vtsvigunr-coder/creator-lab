import { createRoot } from 'react-dom/client'
import './styles/reset.css'
import './styles/fonts.css'
import './styles/tokens.css'
import PrivacyPolicyPage from './pages/legal/PrivacyPolicyPage'
import { LanguageProvider } from './i18n/LanguageContext'

if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
window.scrollTo(0, 0)

createRoot(document.getElementById('root')!).render(
  <LanguageProvider>
    <PrivacyPolicyPage />
  </LanguageProvider>,
)
