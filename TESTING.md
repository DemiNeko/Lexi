# Проверки этой версии

## Выполнено

- `node --check assets/app.js`.
- Проверка 181 уникального идентификатора/слова, трёх юнитов, диапазонов печатных страниц,
  наличия переводов/примеров и равенства данных в vocabulary.json и assets/words.js.
- Chromium / Playwright: отрисовка главной, карточек, теста, написания, словаря и статистики.
- Переворот карточки, сохранение слова, запись ответа и добавление ошибки через три
  следующих задания. Завершение сессии и итоговый список ошибок.
- Выбор правильного и неправильного варианта в тесте; четыре различных варианта
  с обязательным присутствием правильного ответа для всех 181 слов в обоих направлениях.
- Ввод правильного английского ответа в верхнем регистре и отклонение неверного ответа.
  Проверка всех перечисленных русских переводов и английских aliases.
- Поиск в словаре по-русски, раскрытие примера, фильтры, безопасная обработка строки
  `<img src=x onerror=alert(1)>` как текста.
- Переключение темы, экспорт/импорт прогресса; повторная инициализация страницы с
  сохранённым состоянием сессии и прогресса.
- Мобильная ширина 390px: главная, настройки практики, тест, написание, словарь;
  отсутствие горизонтальной прокрутки. Проверки дополнительных ширин перечислены
  в отчёте, когда они выполнены.

При указанном smoke-прогоне неперехваченных JavaScript-ошибок не было.

## Как запускались браузерные проверки

Среда не разрешала браузеру навигацию на localhost/file URLs. Поэтому тот же HTML/CSS/JS
был отрисован через `page.set_content` без сетевых запросов, а Web Storage был заменён
детерминированной in-memory фикстурой. Она позволила проверить сериализацию, восстановление
состояния, импорт и экспорт, но это не отдельная проверка физического хранения localStorage
во всех браузерах. Скрипт приложения использует нативный localStorage и обрабатывает его отказ.

## Не проверено внешними действиями

- Реальный запуск `publish.ps1` в Windows и создание репозитория в GitHub.
- Деплой в GitHub Pages и доступность публичного URL.
- Реальная слышимость/качество голоса speechSynthesis.
- Safari, Firefox и системные ограничения хранилища на всех устройствах.

Репозиторий и сайт нельзя считать опубликованными только потому, что эти файлы подготовлены.
Скрипт публикации сверялся с официальным GitHub CLI / Pages API; его успешный запуск
и проверка публичного адреса остаются отдельным этапом.

## Kazakh localization regression checks

`npm test` verifies complete Kazakh data for all 181 entries and data-file parity.
`node tests/browser.cjs` (optional Playwright installation) tests:

- Every Russian/Kazakh answer and English alias; four unambiguous quiz choices.
- Kazakh character distinctions, case and punctuation normalization.
- Language switching and persistence, cards, correct/incorrect typing, quizzes,
  mistake repetition, translated examples and three-language dictionary search.
- Legacy direction migration and progress preservation; old/new JSON import/export.
- All six views at 320, 390, 768 and 1440 px; dark theme and runtime errors.
- Kazakh date/weekday labels independent of the browser's installed Intl locales.
