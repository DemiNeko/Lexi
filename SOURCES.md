# Источники и границы подборки

Основной источник текущего курса — приложенный пользователем скан **Cambridge Academic English Intermediate Student’s Book**, файл `Cambridge Academic English Intermediate Students Book_compressed.pdf` (180 страниц PDF). Распознаны и сверены страницы Units 3–5. Unit 5 — **On budget**, печатные страницы 70–81. Между Unit 4 и Unit 5 находятся страницы Lecture skills B, они не включены.

В таблице — печатные страницы; в предоставленном PDF соответствующая страница имеет номер на 1 больше. Это местоположение всего фрагмента, а не утверждение о точной странице каждой словоформы. Диапазоны юнитов у архивных слов сохранены без уточнения вымышленных страниц. Часть заголовков — редакционные подписи для удобной навигации.

Состав включает основные Reading, статьи для письма, образцы эссе и связные учебные фрагменты. Повторные цитаты из того же текста не создают новый источник. Отдельные примеры предложений, инструкции, таблицы слов, планы в пунктах и задания без связного текста не служат основанием отбора.

| Unit | Текст | Страницы книги | Карточек |
|---|---|---|---:|
| 3 | Economic terms in context | 43 | 18 |
| 3 | The Great Depression | 43–44 | 46 |
| 3 | Advice on a presentation | 48 | 9 |
| 3 | Giving youth a hand | 49 | 25 |
| 3 | Lost output: graph description | 51 | 12 |
| 3 | The 1973–1974 stock market crash | 53 | 9 |
| 4 | Into the Information Age | 54–55 | 50 |
| 4 | Internet marketing: Selling | 57–58 | 42 |
| 4 | Internet marketing: Communication | 58 | 14 |
| 4 | IT and tourism: essay drafts | 62–63 | 29 |
| 4 | Travel bargains: summary paragraph | 58 | 14 |
| 4 | The digital divide | 64 | 16 |
| 5 | Personal budgets | 71 | 23 |
| 5 | Budgets, long-term plans and corporate objectives | 72 | 29 |
| 5 | Budgeting in the developing world | 76 | 12 |
| 5 | Microfinance and poverty: first draft | 77–78 | 34 |
| 5 | Who and How Many Are the Poor? | 78–79 | 29 |
| 5 | Defining poverty: presentation introduction | 80–81 | 8 |
| 5 | Saving up: a budgeting analogy | 73 | 10 |

## Как отбирались слова

353 карточки — содержательная лексика и полезные выражения этих текстов, а не дословная выгрузка каждого служебного слова. Словоформы приведены к словарной форме. Близкие формулировки отмечены вариантами написания: например, `standard of living` / `living standard`, `information explosion` / `explosion of information`, `online` / `on-line`. Одно и то же слово повторно используется в нескольких источниках с одним ID и общим прогрессом. Уже существовавшие самостоятельные карточки не удалялись и не объединялись принудительно.

Русские и казахские переводы предназначены для обучения. Все новые короткие примеры написаны специально для тренажёра, не скопированы из книги. Полные тексты и сканы не включены в распространяемые файлы. Исторические определения бедности в книге не выдаются за современные нормативы.

## Сохранённые источники предыдущей версии

База GitHub: DemiNeko/Lexi, main `b811d5a7ad63b79642deec71c7892b7c5ad464eb`, 181 карточка. Точный снимок — `tests/fixtures/legacy-vocabulary.json`.

Предыдущая расширенная версия: 759 карточек из подготовленного пользователем тематического файла `Cambridge_Units_1-4_English_Russian_Vocabulary.md` (750 исходных строк), снимок — `tests/fixtures/previous-vocabulary.json`. Исходная подборка сохранена в `data/source-vocabulary.md`, результаты сопоставления — `data/merge-report.json`. Она не определяет текущий отбор по текстам Units 3–5; слова за его пределами находятся в архиве.

144 новые карточки и переводы — `data/reading-additions.tsv`; постоянные ID — `data/reading-identities.json`; тексты и отобранные термины — `data/readings.json`; итоговое сопоставление — `data/reading-report.json`.

Явная поправка прежнего перевода: `bargain price` — «выгодная цена», вместо обрезанного «выгодная». Она хранится в `data/content-corrections.json`, ID не изменён. Три английских варианта написания добавлены без удаления прежних.
