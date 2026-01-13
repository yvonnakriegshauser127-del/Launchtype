import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'
import ruRU from 'antd/locale/ru_RU'
import enUS from 'antd/locale/en_US'
import ukUA from 'antd/locale/uk_UA'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import 'dayjs/locale/en'
import 'dayjs/locale/uk'
import App from './App'
import './index.css'

// Заглушка для получения языка из настроек профиля
const getLocale = () => {
  const lang = localStorage.getItem('language') || 'ru'
  switch (lang) {
    case 'en':
      dayjs.locale('en')
      return enUS
    case 'uk':
      dayjs.locale('uk')
      return ukUA
    default:
      dayjs.locale('ru')
      return ruRU
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider locale={getLocale()}>
      <App />
    </ConfigProvider>
  </React.StrictMode>,
)

