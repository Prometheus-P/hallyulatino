# Repository Guidelines

## Project Structure & Module Organization
- `src/`: Astro pages, layouts, components, styles. Pages live in `src/pages/`, shared UI in `src/components/ui/`, SEO helpers in `src/components/seo/`, and global styles in `src/styles/`.
- `src/content/`: MDX content organized by collection (`dramas`, `kpop`, `noticias`, `guias`) with schemas in `config.ts`.
- `public/`: Static assets (favicons, robots.txt, shared images). Built output goes to `dist/`.
- `tests/`: Lightweight TS checks for content, build, and SEO; Playwright config sits at `playwright.config.ts`.

## Build, Test, and Development Commands
- `pnpm dev`: Start local dev server on `http://localhost:4321`.
- `pnpm build`: Production build into `dist/`.
- `pnpm preview`: Serve the built site for validation.
- `pnpm check`: Type and Astro diagnostics.
- `pnpm test`: Run content, build, and SEO validation (`tests/...`). Use before pushing.
- `pnpm test:e2e`: Playwright smoke/e2e suite; `pnpm test:e2e:ui` opens the UI runner.
- `pnpm tdd:red|green|refactor`: Convenience wrappers for the TDD loop.

## Coding Style & Naming Conventions
- TypeScript and Astro with ES modules; prefer `pnpm` over npm/yarn.
- Indentation: 2 spaces; keep imports ordered (stdlib → third-party → local).
- Components: PascalCase files (`HeroBanner.astro`, `SeoHead.tsx`). Utility modules camelCase.
- Content filenames use kebab-case (`mi-drama.mdx`) and include required frontmatter fields defined in `src/content/config.ts`.
- Tailwind utilities live inline; favor semantic class groups and avoid unused globals in `src/styles/global.css`.

## Testing Guidelines
- Unit-like checks run via `pnpm test` (validates frontmatter, build viability, and SEO metadata).
- E2E flows use Playwright; add new specs under `tests/` or `tests/e2e/` and name them descriptively (`navigation.spec.ts`).
- Prefer arranging fixtures under `tests/fixtures` if adding sample content.
- Aim for green `pnpm test` and `pnpm build` before opening a PR; attach failing cases when proposing fixes.

## Commit & Pull Request Guidelines
- Commit format: `<type>(<scope>): <subject>` using lower-case type (`feat`, `fix`, `docs`, `content`, `test`, `chore`, etc.). Example: `fix(seo): correct og image path`.
- Keep commits focused; separate content changes from code refactors when possible.
- PRs: include a short summary of changes, linked issue (if any), and screenshots for visual updates (desktop + mobile). Note any skipped tests or TODOs.
- Branch naming: `<type>/<description>` such as `feat/search-filter` or `content/add-bts-profile`.

## Security & Configuration Tips
- Do not commit secrets; `.env` values should stay local. If needed, document keys in `ENVIRONMENT.md` without real tokens.
- When adding third-party scripts or analytics, ensure they are preload-safe for Astro SSG and respect existing SEO defaults (sitemap, robots).
