# Test Videos

Failure videos captured during test runs are stored here and excluded from version control.

Files follow the naming pattern:
- webship-js: `<timestamp>.<feature>.<scenario>.FAILED.webm`
- Playwright: captured automatically on test failure (see `video: 'retain-on-failure'` in `playwright.spec.config.ts`)

These files are generated automatically — do not commit them.
