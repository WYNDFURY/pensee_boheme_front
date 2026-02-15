# Design — cPanel Git Deployment Configuration

## Overview

Implement automated deployment pipeline for Pensée Bohème Nuxt 3 static site via cPanel Git Version Control system. The `.cpanel.yml` configuration file orchestrates dependency installation, static site generation, and file deployment to web server public directory on Git push events.

**Design Goal**: Zero-touch deployment from `git push` to live site with fail-fast error handling and minimal deployment footprint.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Developer Workflow                            │
│                                                                   │
│  1. git add .                                                    │
│  2. git commit -m "Update galleries"                            │
│  3. git push origin main  ◄────────────────────┐                │
└─────────────────────────────────────────────────│────────────────┘
                                                  │
                                                  │ Triggers
                                                  │
┌─────────────────────────────────────────────────▼────────────────┐
│              cPanel Git Version Control System                   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Repository Clone in cPanel                              │   │
│  │  ~/repositories/pensee-boheme-front/                     │   │
│  │                                                           │   │
│  │  - Checks out pushed commits                             │   │
│  │  - Validates clean working tree                          │   │
│  │  - Reads .cpanel.yml                                     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                          │                                        │
│                          │ Executes tasks                        │
│                          ▼                                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Task 1: Install Dependencies                            │   │
│  │  $ export DEPLOYPATH=/home/user/public_html              │   │
│  │  $ yarn install --frozen-lockfile                        │   │
│  │                                                           │   │
│  │  - Installs production + dev dependencies                │   │
│  │  - Uses yarn.lock for reproducibility                    │   │
│  │  - Fails if lock file out of sync                        │   │
│  └──────────────────────────────────────────────────────────┘   │
│                          │                                        │
│                          │ On success                            │
│                          ▼                                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Task 2: Generate Static Site                            │   │
│  │  $ yarn generate:prod                                    │   │
│  │                                                           │   │
│  │  - Sets NUXT_PUBLIC_API_BASE_URL=https://api...          │   │
│  │  - Fetches data from production API                      │   │
│  │  - Pre-renders 4 routes + dynamic gallery pages          │   │
│  │  - Generates sitemap.xml, robots.txt                     │   │
│  │  - Outputs to .output/public/                            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                          │                                        │
│                          │ On success                            │
│                          ▼                                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Task 3: Deploy Static Files                             │   │
│  │  $ /bin/cp -R .output/public/* $DEPLOYPATH               │   │
│  │                                                           │   │
│  │  - Copies HTML, CSS, JS, images to web root              │   │
│  │  - Preserves directory structure                         │   │
│  │  - Overwrites existing files (atomic replacement)        │   │
│  └──────────────────────────────────────────────────────────┘   │
│                          │                                        │
└──────────────────────────┼────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Web Server Public Directory                     │
│                  /home/user/public_html/                        │
│                                                                  │
│  - index.html (redirects to /home)                              │
│  - /home/index.html                                             │
│  - /galeries/index.html                                         │
│  - /galeries/[slug]/index.html (dynamic)                        │
│  - /engagement/index.html                                       │
│  - /infos-pratiques/index.html                                  │
│  - /admin/ (client-side routes, 200.html fallback)              │
│  - /_nuxt/ (JS/CSS bundles)                                     │
│  - /_ipx/ (optimized images)                                    │
│  - sitemap.xml                                                  │
│  - robots.txt                                                   │
│  - 200.html (SPA fallback)                                      │
│  - 404.html                                                     │
└─────────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. `.cpanel.yml` Configuration File

**Location**: Repository root
**Format**: YAML
**Purpose**: Define deployment tasks executed by cPanel on Git push

**Structure**:
```yaml
---
deployment:
  tasks:
    - export DEPLOYPATH=/home/username/public_html
    - yarn install --frozen-lockfile
    - yarn generate:prod
    - /bin/cp -R .output/public/* $DEPLOYPATH
```

**Key Design Decisions**:
- Use `export` to set environment variable scoped to entire task sequence
- Use `--frozen-lockfile` to enforce yarn.lock consistency (fail if package.json/yarn.lock mismatch)
- Use absolute path `/bin/cp` to avoid shell alias issues in cPanel environment
- Use `$DEPLOYPATH` variable for portability (can change target directory without editing multiple lines)
- No wildcard expansion per cPanel docs restriction

### 2. Deployment Path Environment Variable

**Variable**: `DEPLOYPATH`
**Scope**: All tasks in deployment sequence
**Value**: `/home/{cpanel_username}/public_html`

**Rationale**:
- Avoid hardcoding paths in multiple commands
- Enable easy retargeting (e.g., subdirectory, staging path)
- Clear separation of configuration from execution logic

**Alternative Considered**: Using cPanel environment variable via `.bashrc`
**Rejected**: `.cpanel.yml` should be self-contained, no external dependencies

### 3. Dependency Installation Task

**Command**: `yarn install --frozen-lockfile`

**Flags**:
- `--frozen-lockfile`: Fail if lock file needs update (prevents drift)
- No `--production` flag: Dev dependencies required for build (Nuxt CLI, Vite, TypeScript, ESLint)

**Expected Behavior**:
- Exit code 0 on success
- Exit code ≠ 0 on failure → cPanel aborts remaining tasks
- Installs ~800 packages (~300MB in node_modules)

**Performance**:
- Cold install: ~2-3 minutes (cPanel shared hosting)
- Warm install: ~30-60 seconds (if node_modules cached)

**Error Cases**:
| Error | Cause | Resolution |
|-------|-------|------------|
| Lock file out of sync | package.json modified without yarn install | Run `yarn install` locally, commit yarn.lock |
| Network timeout | npm registry unreachable | Retry deployment, check cPanel network |
| Disk quota exceeded | node_modules too large | Request quota increase or optimize dependencies |

### 4. Static Site Generation Task

**Command**: `yarn generate:prod`
**Expands to**: `cross-env NUXT_PUBLIC_API_BASE_URL=https://api.pensee-boheme.fr/api nuxt generate`

**Process**:
1. Nuxt builds client bundle (Vite)
2. Nitro builds server (for pre-rendering)
3. Crawler fetches pre-render routes from `nitro.prerender.routes`
4. API calls made to production backend (`https://api.pensee-boheme.fr/api`)
5. HTML files written to `.output/public/`
6. SEO files generated (sitemap.xml via @nuxtjs/sitemap, robots.txt via @nuxtjs/robots)

**Output Structure** (`.output/public/`):
```
├── index.html                    # Root redirect
├── 200.html                      # SPA fallback (admin routes)
├── 404.html                      # Error page
├── home/
│   └── index.html                # /home
├── galeries/
│   ├── index.html                # /galeries
│   └── [slug]/
│       └── index.html            # Dynamic routes
├── engagement/
│   └── index.html
├── infos-pratiques/
│   └── index.html
├── admin/                        # Client-side only (no SSG)
├── _nuxt/                        # JS/CSS bundles
│   ├── *.js
│   └── *.css
├── _ipx/                         # Image optimization cache
├── __sitemap__/                  # Sitemap chunks
├── sitemap.xml
└── robots.txt
```

**Expected Behavior**:
- Exit code 0 on successful generation
- Exit code ≠ 0 on build/API errors → cPanel aborts deployment
- Build time: ~1-3 minutes (depends on gallery count)

**Error Cases**:
| Error | Cause | Resolution |
|-------|-------|------------|
| API unreachable | Backend down or network issue | Fix backend, retry deployment |
| Build timeout | Too many galleries/images | Optimize image count or increase timeout |
| TypeScript errors | Type mismatch in components | Fix types locally, commit, push |
| Out of memory | Large bundle + limited cPanel RAM | Reduce bundle size or request memory increase |

### 5. File Deployment Task

**Command**: `/bin/cp -R .output/public/* $DEPLOYPATH`

**Breakdown**:
- `/bin/cp`: Absolute path to copy command (avoid alias issues)
- `-R`: Recursive copy (directories + contents)
- `.output/public/*`: All files/directories in generated output
- `$DEPLOYPATH`: Target directory (`/home/user/public_html`)

**Behavior**:
- Overwrites existing files with same name
- Creates directories if missing
- Preserves file permissions
- Atomic per-file (not atomic for entire deployment)

**Expected State After Copy**:
- All HTML files accessible at corresponding URLs
- Static assets (images, fonts) served directly by Apache/LiteSpeed
- SPA fallback (200.html) handles client-side routing for /admin
- Old files from previous deployments remain (no cleanup)

**Cleanup Strategy**: Not implemented (incremental override)
- Old hashed bundles (e.g., `_nuxt/old-hash.js`) accumulate over time
- Impact: Disk usage grows, but stale files are unreferenced (no functional issue)
- Mitigation: Manual cleanup via SSH/cPanel File Manager every ~6 months

**Alternative Considered**: Full directory replacement (`rm -rf $DEPLOYPATH/* && cp -R ...`)
**Rejected**: High risk if `cp` fails after `rm` → site goes offline

## Data Models

### Deployment Configuration Schema

**File**: `.cpanel.yml`

```typescript
interface CpanelDeploymentConfig {
  deployment: {
    tasks: string[]  // Array of BASH commands
  }
}
```

**Validation**:
- Must be valid YAML
- Must start with `---` document marker
- `deployment.tasks` must be array of strings
- Each task must be valid BASH command

**Example**:
```yaml
---
# cPanel Git Deployment Configuration for Pensée Bohème
deployment:
  tasks:
    # Set deployment target (public_html root)
    - export DEPLOYPATH=/home/username/public_html

    # Install all dependencies (production + dev needed for build)
    - yarn install --frozen-lockfile

    # Generate static site with production API URL
    - yarn generate:prod

    # Deploy generated files to web server
    - /bin/cp -R .output/public/* $DEPLOYPATH
```

### Environment Variables

| Variable | Scope | Value | Purpose |
|----------|-------|-------|---------|
| `DEPLOYPATH` | Deployment tasks | `/home/{user}/public_html` | Target directory for static files |
| `NUXT_PUBLIC_API_BASE_URL` | Nuxt build | `https://api.pensee-boheme.fr/api` | Production API endpoint (set by `yarn generate:prod`) |

## Error Handling

### Task Execution Model

**Sequential Execution**: Tasks run in array order, stopping on first non-zero exit code.

**Error Propagation**:
```
Task 1 (yarn install) → exit 0 → Continue
Task 2 (yarn generate:prod) → exit 1 → ABORT (do not run Task 3)
```

**Benefit**: Prevents deploying broken builds (fail-fast).

### Error Scenarios and Responses

#### 1. Dependency Installation Failure

**Trigger**: `yarn install --frozen-lockfile` exits with code ≠ 0

**Causes**:
- yarn.lock out of sync with package.json
- Network timeout fetching packages
- Disk quota exceeded

**System Response**:
- cPanel aborts deployment
- Previous deployment remains live (no changes)
- Error logged in cPanel Git interface

**User Action**:
- Check cPanel error logs
- Run `yarn install` locally to regenerate lock file if needed
- Commit and push fixed yarn.lock
- Retry deployment

#### 2. Static Generation Failure

**Trigger**: `yarn generate:prod` exits with code ≠ 0

**Causes**:
- Production API unreachable (network/backend down)
- TypeScript compilation errors
- Out of memory during build
- Invalid component code

**System Response**:
- cPanel aborts before file copy
- Previous static files remain deployed
- Build output logged to cPanel Git interface

**User Action**:
- Check API health (`https://api.pensee-boheme.fr/api/galleries`)
- Review build logs for TypeScript/Nuxt errors
- Fix errors locally, test with `yarn generate:prod`, commit, push

#### 3. File Copy Failure

**Trigger**: `/bin/cp -R .output/public/* $DEPLOYPATH` exits with code ≠ 0

**Causes**:
- Disk quota exceeded
- Permission denied on target directory
- Source directory missing (impossible if Task 2 succeeded)

**System Response**:
- Partial deployment possible (some files copied before error)
- Site may be in inconsistent state

**User Action**:
- Check cPanel disk usage quota
- Verify `public_html` permissions (755)
- SSH cleanup if partial deployment occurred
- Retry deployment after fixing quota/permissions

### Rollback Strategy

**No Automated Rollback**: cPanel Git Version Control does not support automatic rollback on failure.

**Manual Rollback**:
1. Identify last working commit: `git log`
2. Revert to previous commit: `git revert <commit-hash>` or `git reset --hard <commit-hash>`
3. Push: `git push origin main --force` (if using reset)
4. cPanel redeploys previous version

**Prevention Over Rollback**:
- Test `yarn generate:prod` locally before push
- Use Git branches for risky changes (merge only after local validation)
- Keep `main` branch stable (deployable at all times)

## Testing Strategy

### Pre-Deployment Testing (Local)

**Required before `git push`**:

1. **Dependency Installation**:
   ```bash
   rm -rf node_modules
   yarn install --frozen-lockfile
   # Should exit 0 with no lock file warnings
   ```

2. **Static Generation**:
   ```bash
   yarn generate:prod
   # Should complete successfully
   # Check .output/public/ for expected files
   ```

3. **Output Validation**:
   ```bash
   ls -la .output/public/
   # Verify presence of:
   # - index.html, 200.html, 404.html
   # - home/, galeries/, engagement/, infos-pratiques/
   # - _nuxt/, sitemap.xml, robots.txt
   ```

4. **Preview Build**:
   ```bash
   yarn preview
   # Visit http://localhost:3000
   # Test navigation, galleries, forms
   ```

### Deployment Testing (cPanel)

**After `git push`**:

1. **cPanel Git Interface**:
   - Navigate to Git Version Control in cPanel
   - Verify deployment status (success/failure)
   - Review deployment logs for errors

2. **File System Verification**:
   - SSH or cPanel File Manager
   - Check `/home/user/public_html/` contains updated files
   - Verify file modification timestamps

3. **Live Site Validation**:
   - Visit `https://pensee-boheme.fr`
   - Test home page, galleries, navigation
   - Check browser console for JS errors
   - Validate sitemap: `https://pensee-boheme.fr/sitemap.xml`
   - Validate robots.txt: `https://pensee-boheme.fr/robots.txt`

4. **SEO Verification**:
   - Google Search Console: Fetch as Google
   - Structured data validator (schema.org)
   - PageSpeed Insights (performance regression)

### Rollback Testing

**Before relying on deployment in production**:

1. Deploy known-good commit
2. Introduce intentional error (e.g., syntax error in component)
3. Push and verify cPanel aborts deployment
4. Verify site still serves previous version
5. Revert error, push, verify recovery

## Performance Considerations

### Build Time Optimization

**Current Build Time**: ~1-3 minutes (depends on gallery count)

**Bottlenecks**:
- API fetching during pre-render (galleries, products, pages)
- Image optimization via `@nuxt/image`
- Vite bundle generation

**Optimization Strategies**:
- **Not Implemented** (deferred):
  - Build caching (`.nuxt`, `.output` persistence)
  - Incremental static regeneration
  - Parallel API fetching

**Rationale for Deferral**:
- cPanel executes tasks from repository clone (no persistent cache)
- SSG model requires full rebuild for content updates
- Build time acceptable for content update frequency (1-2x/week)

### Deployment Footprint

**Disk Usage**:
- `node_modules`: ~300MB
- `.output/public`: ~10-50MB (varies with gallery image count)
- Repository files: ~5MB

**Total**: ~350MB per deployment

**cPanel Disk Quota**: Typically 5-50GB on shared hosting
**Impact**: Negligible (< 1% of quota)

### Network Performance

**Deployment Traffic**:
- Yarn package fetching: ~200MB (first install)
- API data fetching during build: ~1-5MB (JSON responses)
- Git push: ~1-10MB (incremental changes)

**Total**: ~200-250MB per fresh deployment, ~10-20MB incremental

**cPanel Network**: Shared hosting, no bandwidth guarantees
**Expected Duration**: 2-5 minutes end-to-end

## Security Considerations

### Secrets and Environment Variables

**No Secrets in `.cpanel.yml`**:
- File is committed to Git (public if repository is public)
- Contains only public configuration (API URL, deployment path)

**Production API URL**:
- `https://api.pensee-boheme.fr/api` — public, read-only endpoints
- No authentication required for GET requests (galleries, products, pages)
- Admin routes (`/login`, `/products`, `/galleries` POST/PATCH/DELETE) protected by Sanctum token (not in `.cpanel.yml`)

**Deployment Path**:
- `/home/username/public_html` — server-side path, not exploitable

**Risk Assessment**: **Low**
- No credentials, tokens, or private keys in deployment config
- API URL is already exposed in frontend bundle (Nuxt public runtime config)

### File Permissions

**Repository Files**: Default cPanel permissions (644 for files, 755 for directories)

**Generated Static Files**: Inherit repository permissions
- HTML, CSS, JS: 644 (world-readable, required for web server)
- Directories: 755 (readable + executable for traversal)

**Risk Assessment**: **None**
- Static files are public by design (served via HTTP)
- No server-side code execution (pure HTML/CSS/JS)

### Dependency Security

**Vulnerability Scanning**:
- Run `yarn audit` before deployment
- Address high/critical vulnerabilities
- Ignore dev-only vulnerabilities (not bundled in production)

**Dependency Pinning**:
- `yarn.lock` ensures reproducible builds
- No `^` or `~` version ranges at runtime (resolved at lock time)

**Supply Chain Risk**:
- 800+ dependencies (Nuxt, Vue, Vite, UI libraries)
- Mitigation: Regular updates, audit before major releases

### Admin Route Protection

**Admin Routes Not Pre-rendered**:
- `nitro.prerender.ignore: ['/admin/**']`
- Admin pages are client-side only (200.html fallback)
- Authentication enforced in browser (localStorage token + middleware)

**Risk**: Admin pages accessible via direct URL
**Mitigation**:
- `auth.global.ts` middleware redirects unauthenticated users
- Backend enforces Sanctum auth on all protected endpoints
- Frontend auth is convenience layer, not security boundary

**Impact**: **None** (backend is single source of truth for authorization)

## Monitoring and Observability

### Deployment Monitoring

**cPanel Git Interface**:
- Deployment status: Success/Failure
- Task execution logs (stdout/stderr)
- Timestamp of last deployment

**Access**: cPanel → Git Version Control → Repository → Deployment Logs

**Log Retention**: cPanel provider-dependent (typically 7-30 days)

### Build Logs

**Captured Output**:
- Yarn install: Package count, warnings, errors
- Nuxt generate: Build duration, pre-rendered routes, bundle sizes
- File copy: Standard output (usually silent unless error)

**Example Success Log**:
```
[Task 1] export DEPLOYPATH=/home/user/public_html
[Task 2] yarn install --frozen-lockfile
✓ 823 packages installed in 45s
[Task 3] yarn generate:prod
✓ Building client...
✓ Building server...
✓ Pre-rendering 4 routes...
✓ Generated in 92s
[Task 4] /bin/cp -R .output/public/* $DEPLOYPATH
Deployment completed successfully
```

**Example Failure Log**:
```
[Task 2] yarn install --frozen-lockfile
error Your lockfile needs to be updated, but yarn was run with --frozen-lockfile
Deployment aborted with exit code 1
```

### Site Health Monitoring

**Post-Deployment Checks** (manual):
- HTTP 200 response on key pages (`/`, `/home`, `/galeries`)
- No console errors (browser DevTools)
- Sitemap accessible (`/sitemap.xml`)

**External Monitoring** (recommended, not implemented):
- Uptime monitoring (UptimeRobot, Pingdom)
- Google Search Console (crawl errors, sitemap status)
- Web vitals tracking (PageSpeed Insights API)

### Error Alerting

**Current State**: No automated alerts

**Failure Detection**:
- Developer checks cPanel Git interface after push
- User reports if site is broken

**Recommended Enhancement** (future):
- cPanel email notification on deployment failure (if supported by provider)
- Slack/Discord webhook on successful deployment (via cPanel API or custom script)

### Metrics to Track

**Deployment Metrics**:
| Metric | Source | Frequency |
|--------|--------|-----------|
| Deployment success rate | cPanel logs | Per deployment |
| Build duration | Nuxt generate output | Per deployment |
| Deployed file count | `ls -R` in public_html | Per deployment |
| Disk usage | cPanel dashboard | Weekly |

**Site Metrics** (post-deployment):
| Metric | Source | Frequency |
|--------|--------|-----------|
| Page load time | PageSpeed Insights | Per deployment |
| Lighthouse score | Chrome DevTools | Per deployment |
| Broken links | Manual testing or tool | Per deployment |
| Sitemap errors | Google Search Console | Weekly |

## Deployment Workflow Example

### Initial Setup (One-Time)

1. **Create cPanel Git Repository**:
   - cPanel → Git Version Control → Create
   - Repository URL: `https://github.com/user/pensee-boheme-front.git`
   - Repository Path: `/home/username/repositories/pensee-boheme-front`
   - Clone repository to cPanel server

2. **Configure Deployment Path**:
   - Edit `.cpanel.yml` to set `DEPLOYPATH=/home/username/public_html`
   - Replace `username` with actual cPanel username

3. **Add `.cpanel.yml` to Repository**:
   ```bash
   git add .cpanel.yml
   git commit -m "Add cPanel deployment configuration"
   git push origin main
   ```

4. **Trigger First Deployment**:
   - cPanel detects push, executes tasks
   - Monitor deployment logs for success

5. **Verify Deployment**:
   - Visit `https://pensee-boheme.fr`
   - Test all pages, galleries, forms

### Regular Update Workflow

1. **Local Development**:
   ```bash
   # Make changes (update gallery, fix bug, etc.)
   git add .
   git commit -m "Update spring gallery photos"
   ```

2. **Pre-Deployment Testing**:
   ```bash
   yarn generate:prod
   yarn preview
   # Test locally at http://localhost:3000
   ```

3. **Deploy**:
   ```bash
   git push origin main
   # cPanel automatically triggers deployment
   ```

4. **Monitor**:
   - Check cPanel Git interface for deployment status
   - Visit site to verify changes live

5. **Rollback** (if needed):
   ```bash
   git revert HEAD
   git push origin main
   # cPanel redeploys previous version
   ```

## Implementation Checklist

- [ ] Create `.cpanel.yml` in repository root
- [ ] Set `DEPLOYPATH` environment variable (customize for cPanel username)
- [ ] Test `yarn install --frozen-lockfile` locally
- [ ] Test `yarn generate:prod` locally
- [ ] Commit `.cpanel.yml` to Git
- [ ] Configure cPanel Git Version Control (connect repository)
- [ ] Push to trigger first deployment
- [ ] Monitor cPanel deployment logs
- [ ] Verify live site functionality
- [ ] Document deployment process in project README or CLAUDE.md
- [ ] Test rollback procedure (intentional error → revert → redeploy)
- [ ] Establish monitoring (Google Search Console, uptime checker)
