# 🌍 Global IT Research Agent 

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-Black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/Gemini_AI-1da1f2?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/Bright_Data-00b8ff?style=for-the-badge&logo=data&logoColor=white" alt="Bright Data" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
</div>

<br />

**Global IT Research Agent** — это мощный аналитический инструмент, созданный для исследования IT-рынка в режиме реального времени. 

Приложение собирает актуальные данные по вакансиям с помощью **Bright Data**, а затем **Gemini AI** структурирует и анализирует эту информацию, выдавая подробный отчет по зарплатам, стекам технологий и трендам.

---

## 🔥 Главные фичи

- **⚡ Live Данные:** Скрейпинг актуальных вакансий в реальном времени.
- **🤖 AI Аналитика:** Глубокий анализ рынка от Gemini 2.5 Flash.
- **🌍 Мультиязычность:** Поддержка 6 языков интерфейса (RU, EN, KZ, ZH, DE, FR).
- **⚖️ Режим сравнения:** Анализируй две профессии одновременно и сравнивай зарплаты и перспективы.
- **📄 Экспорт в PDF:** Скачивай готовые аналитические отчеты в один клик.
- **🕶️ Cyberpunk UI:** Потрясающий хакерский дизайн с эффектом матрицы.

## ⚙️ Как это работает?

1. **Поиск:** Вы вводите IT-специальность (например, `Flutter разработчик`) и выбираете регион (Global, KZ, US и т.д.).
2. **Скрейпинг:** Система делает запрос через `Bright Data` для получения сотен живых вакансий.
3. **Анализ:** `Gemini AI` читает эти данные, выделяет ключевые навыки, средние зарплаты и тренды.
4. **Результат:** Вы получаете красивый, структурированный отчет на экране.

## 🚀 Быстрый старт

Убедитесь, что у вас установлен Node.js (v18+).

```bash
# 1. Клонируйте репозиторий
git clone https://github.com/your-username/cis-research-agent.git
cd cis-research-agent

# 2. Установите зависимости
npm install

# 3. Добавьте переменные окружения (.env.local)
# GEMINI_API_KEY=ваш_ключ
# И другие необходимые ключи

# 4. Запустите сервер разработки
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере, чтобы увидеть приложение.

## 🛠️ Технологический стек

- **Фреймворк:** [Next.js 15](https://nextjs.org/) (App Router)
- **Стилизация:** [Tailwind CSS](https://tailwindcss.com/)
- **AI:** [Google Gemini API](https://deepmind.google/technologies/gemini/)
- **Парсинг:** Bright Data
- **PDF Генерация:** `jspdf` & `html2canvas-pro`
- **Markdown:** `react-markdown`

## 🏆 Создано для Хакатона 2026
Разработано с ❤️ **@Prosto_Proger**. 

---
>_"The Matrix is everywhere. It is all around us. Even now, in this very room."_
