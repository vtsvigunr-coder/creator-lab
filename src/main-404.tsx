import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/reset.css'
import './styles/fonts.css'
import './styles/tokens.css'
import Page404 from './pages/not-found/Page404'
import { LanguageProvider } from './i18n/LanguageContext'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <LanguageProvider>
      <Page404 />
    </LanguageProvider>
  </BrowserRouter>,
)
