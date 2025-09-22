import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import App from './app/App.tsx'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Provider } from 'react-redux'
import { store } from './shared/store/index.ts'

import { I18nextProvider } from "react-i18next";
import i18n from "./app/providers/i18n/config";

if (process.env.NODE_ENV === 'development') {
  // @ts-ignore
  window.store = store;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DndProvider backend={HTML5Backend}>
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <App />
        </Provider>
      </I18nextProvider>
    </DndProvider>
  </StrictMode>,
)
