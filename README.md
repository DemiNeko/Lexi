# lexi. — Academic English

Независимый тренажёр слов из **Units 1–3 Cambridge Academic English Intermediate (B1+)**.
181 слово и выражение: Unit 1 — 60, Unit 2 — 55, Unit 3 — 66.

## Языки / Тілдер

Переключатель **Русский / Қазақша** находится в верхней панели и сохраняет выбор.
На обоих языках доступны интерфейс, переводы всех 181 слова, примеры, подсказки,
карточки, тесты и ввод ответов. В режиме Қазақша направления — English → Қазақша,
Қазақша → English и смешанное. Английские слова и их озвучивание остаются английскими.
Поиск понимает английский, русский и казахский. Прогресс и закладки общие для языков;
старые экспорты и незавершённые занятия поддерживаются.

**Қазақша:** жоғарғы панельден «Қазақша» таңда. Интерфейс, сөздердің аудармалары,
мысалдар мен кеңестер қазақша көрсетіледі. Жауапты карточкадағы кез келген берілген
аудармамен жазуға болады. Тіл ауысқанда прогресс сақталады.

## Development

Open `index.html` directly, or serve this folder with a static HTTP server.
The site has no runtime dependencies or build step.

- `npm test`: syntax, 181 entries, complete RU/KK translations, examples and notes,
  and synchronization between `vocabulary.json` and `assets/words.js`.
- Optional browser tests: install `playwright`, run `npx playwright install chromium`,
  then `node tests/browser.cjs`. `CHROMIUM_PATH` can select an existing Chromium.
- UI translations are in `assets/i18n.js`. Word translations use `kk`, `exampleKk`,
  and `noteKk`, alongside the original Russian fields.
