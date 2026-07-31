import { createRoot } from 'react-dom/client'
import './styles/reset.css'
import './styles/fonts.css'
import './styles/tokens.css'
import Page404 from './pages/not-found/Page404'
import { LanguageProvider } from './i18n/LanguageContext'

createRoot(document.getElementById('root')!).render(
  <LanguageProvider>
    <Page404 />
  </LanguageProvider>,
)
