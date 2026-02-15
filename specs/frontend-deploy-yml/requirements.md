# Requirements — cPanel Git Deployment Configuration

## Introduction

Automate deployment of the Pensée Bohème static Nuxt 3 site to cPanel shared hosting via Git push. The `.cpanel.yml` configuration file defines deployment tasks that copy the generated static site from the repository to the web server's public directory.

**Value**: Eliminates manual FTP uploads, reduces deployment errors, enables continuous deployment workflow for content updates (galleries, products, pages).

## Alignment with Product Vision

Supports product goals:
- **Professional signal** — Git-based deployment workflow demonstrates technical maturity for a small artisan business
- **Content freshness** — Streamlined deployment enables faster gallery updates, critical for showcasing recent work (primary conversion tool per `specs/product.md`)
- **Maintainability** — Automated deployment reduces friction for non-technical site updates (new products, gallery additions)

Aligns with technical constraints:
- Static site generation from API (`api.pensee-boheme.fr`)
- Image-heavy content requiring efficient deployment
- No dynamic server-side logic on frontend hosting

## Requirements

### REQ-1: Deployment Configuration File
**As a** developer deploying the site
**I want** a `.cpanel.yml` file in the repository root
**So that** cPanel automatically deploys the site on Git push

**Acceptance Criteria**:
- File located at repository root: `.cpanel.yml`
- Valid YAML syntax starting with `---`
- Contains `deployment.tasks` array with shell commands
- Uses cPanel's `$DEPLOYPATH` environment variable for target directory
- Includes comments explaining each deployment step

### REQ-2: Static Site Output Deployment
**As a** developer pushing changes
**I want** the generated static site files copied to the web root
**So that** the production site reflects the latest build

**Acceptance Criteria**:
- Copies entire `.output/public/` directory (Nuxt static generation output)
- Uses `/bin/cp -R` for recursive directory copy (per cPanel docs: no wildcards allowed)
- Preserves directory structure: assets, `_nuxt`, HTML files, `sitemap.xml`, `robots.txt`
- Target path configurable via environment variable
- Does NOT copy source files (components, pages, server, etc.)

### REQ-3: Dependency Installation
**As a** deployment pipeline
**I want** Node.js dependencies installed before build
**So that** static generation has all required modules

**Acceptance Criteria**:
- Runs `yarn install --production=false` (dev dependencies needed for build)
- Uses Yarn per `package.json` packageManager field (`yarn@1.22.22`)
- Executes before static generation command

### REQ-4: Static Generation with Production API
**As a** deployment process
**I want** the site built with production API endpoints
**So that** deployed site fetches data from live backend

**Acceptance Criteria**:
- Executes `yarn generate:prod` (sets `NUXT_PUBLIC_API_BASE_URL=https://api.pensee-boheme.fr/api`)
- Pre-renders routes: `/home`, `/galeries`, `/engagement`, `/infos-pratiques`
- Fetches galleries, products, pages, Instagram data from production API at build time
- Generates SEO files: `sitemap.xml`, `robots.txt`
- Ignores admin routes (`/admin/**`) per `nitro.prerender.ignore`

### REQ-5: Deployment Task Ordering
**As a** Git deployment system
**I want** tasks executed sequentially
**So that** build completes before file copying

**Acceptance Criteria**:
- Task execution order:
  1. Install dependencies (`yarn install`)
  2. Generate static site (`yarn generate:prod`)
  3. Copy output to deployment path (`/bin/cp -R .output/public/* $DEPLOYPATH`)
- Each task must complete successfully before next task runs
- Build failures prevent deployment (do not copy stale/broken files)

### REQ-6: Clean Working Tree Requirement
**As a** cPanel Git deployment system
**I want** to validate repository state before deployment
**So that** uncommitted changes do not cause deployment inconsistencies

**Acceptance Criteria**:
- Deployment requires clean working tree (per cPanel docs)
- All changes must be committed before push triggers deployment
- System disables deployment if working tree is dirty

## Non-Functional Requirements

### Architecture
- Deployment configuration as code (`.cpanel.yml` version-controlled)
- Idempotent deployment: repeated runs produce same result
- No server-side rendering on production (pure static files)
- Build happens in repository context, not on web server

### Performance
- Minimize deployment artifacts: exclude `node_modules`, source files, `.nuxt` cache
- Copy only `.output/public/` directory (~10-50MB for image-heavy site)
- Leverage cPanel's sequential task execution (no parallelization overhead)

### Security
- Production API URL embedded in static files at build time (public data only)
- No environment secrets in `.cpanel.yml` (uses cPanel environment variables)
- Admin routes (`/admin/**`) not pre-rendered or deployed (client-side only)
- `node_modules` not deployed (production dependencies already bundled in output)

### Reliability
- Fail-fast on dependency installation errors
- Fail-fast on static generation errors (API unreachable, build failures)
- Do not overwrite production files if build fails
- Preserve previous deployment if current deployment fails mid-task

### Usability
- Single command deployment: `git push origin main`
- No manual FTP or SSH required
- Comments in `.cpanel.yml` explain each task for future maintainers
- Compatible with existing package.json scripts (no new dependencies)
