# Implementation Plan — cPanel Git Deployment Configuration

## Overview

Implement automated Git deployment for Pensée Bohème static site via cPanel. Create `.cpanel.yml` configuration, validate deployment pipeline locally, document process, and perform initial deployment with rollback testing.

## Phase 1: Create Deployment Configuration

**Goal**: Create valid `.cpanel.yml` file with deployment tasks
**Target**: Repository root contains working deployment configuration
**Validation**: YAML syntax validation, local file inspection

### Task 1.1: Create `.cpanel.yml` file
- Create file at repository root: `.cpanel.yml`
- Add YAML document marker: `---`
- Add `deployment:` key with `tasks:` array
- Add inline comments explaining each task

### Task 1.2: Configure deployment path variable
- Add `export DEPLOYPATH=/home/USERNAME/public_html` as first task
- Include comment: "Set deployment target (replace USERNAME with actual cPanel username)"
- Note: USERNAME placeholder to be replaced during cPanel setup

### Task 1.3: Add dependency installation task
- Add `yarn install --frozen-lockfile` command
- Include comment: "Install all dependencies (production + dev needed for build)"
- Rationale: `--frozen-lockfile` ensures yarn.lock consistency, fails on drift

### Task 1.4: Add static generation task
- Add `yarn generate:prod` command
- Include comment: "Generate static site with production API URL"
- Command expands to: `cross-env NUXT_PUBLIC_API_BASE_URL=https://api.pensee-boheme.fr/api nuxt generate`

### Task 1.5: Add file deployment task
- Add `/bin/cp -R .output/public/* $DEPLOYPATH` command
- Include comment: "Deploy generated files to web server"
- Use absolute path `/bin/cp` to avoid shell alias issues
- Use `$DEPLOYPATH` variable reference (not hardcoded path)

**Phase 1 Validation**:
```bash
# Validate YAML syntax
cat .cpanel.yml
# Should display valid YAML with 4 tasks under deployment.tasks array
```

**User Action**: Review `.cpanel.yml` content, verify comments and task order

---

## Phase 2: Local Pre-Deployment Testing

**Goal**: Validate deployment tasks execute successfully in local environment
**Target**: All tasks complete without errors locally
**Validation**: Exit codes, output inspection, file system verification

### Task 2.1: Test dependency installation
- Delete `node_modules` directory
- Run `yarn install --frozen-lockfile`
- Verify exit code 0
- Verify ~800 packages installed
- Check for yarn.lock warnings (should be none)

**Expected Output**:
```
✓ 823 packages installed in 45s
```

### Task 2.2: Test static generation with production API
- Run `yarn generate:prod`
- Verify exit code 0
- Check build output for errors
- Verify pre-rendered routes: `/home`, `/galeries`, `/engagement`, `/infos-pratiques`
- Verify API calls successful (no 404/500 errors in logs)

**Expected Output**:
```
✓ Building client...
✓ Building server...
✓ Pre-rendering 4 routes...
✓ Generated in 92s
```

### Task 2.3: Verify output structure
- Check `.output/public/` directory exists
- Verify presence of:
  - `index.html` (root redirect)
  - `200.html` (SPA fallback)
  - `404.html` (error page)
  - `home/index.html`
  - `galeries/index.html`
  - `engagement/index.html`
  - `infos-pratiques/index.html`
  - `_nuxt/` directory (JS/CSS bundles)
  - `sitemap.xml`
  - `robots.txt`
- Check for dynamic gallery routes: `galeries/[slug]/index.html`

**Validation Command**:
```bash
ls -la .output/public/
tree .output/public/ -L 2  # If tree available
```

### Task 2.4: Preview build locally
- Run `yarn preview`
- Navigate to `http://localhost:3000`
- Test key pages:
  - Home page loads
  - Galleries page loads with images
  - Gallery detail page loads
  - Navigation works
  - Forms render correctly
- Check browser console for errors (should be none)

**Phase 2 Validation**:
- All commands exit with code 0
- No TypeScript errors
- No API fetch errors
- Preview site fully functional

**User Action**: Manually test preview site, verify all pages load correctly

---

## Phase 3: Documentation and Version Control

**Goal**: Document deployment process and commit configuration to Git
**Target**: CLAUDE.md updated, `.cpanel.yml` committed, rollback procedure documented
**Validation**: Git commit history, documentation completeness

### Task 3.1: Update CLAUDE.md with deployment section
- Add "## Deployment" section after "## Commands"
- Document deployment workflow:
  - Prerequisites (cPanel Git Version Control configured)
  - Deployment command: `git push origin main`
  - Monitoring: Check cPanel Git interface for logs
  - Validation: Visit live site
- Document rollback procedure:
  - Identify last working commit: `git log`
  - Revert: `git revert <commit-hash>`
  - Push: `git push origin main`
- Add note about `.cpanel.yml` USERNAME placeholder replacement

**Content Structure**:
```markdown
## Deployment

### Automated Deployment via cPanel Git

Push to `main` branch triggers automated deployment to production.

**Deployment Pipeline**:
1. Install dependencies (`yarn install --frozen-lockfile`)
2. Generate static site (`yarn generate:prod`)
3. Copy output to web server (`/home/user/public_html`)

**Pre-Deployment Checklist**:
- Test locally: `yarn generate:prod && yarn preview`
- Verify no TypeScript errors
- Ensure yarn.lock is committed

**Monitoring**:
- cPanel → Git Version Control → Deployment Logs
- Watch for exit code 0 (success) or ≠ 0 (failure)

**Rollback**:
```bash
git revert HEAD
git push origin main
```

**Initial Setup** (one-time):
1. Configure cPanel Git repository (point to GitHub repo)
2. Replace `USERNAME` in `.cpanel.yml` with actual cPanel username
3. Trigger first deployment via push
```

### Task 3.2: Add `.cpanel.yml` to version control
- Stage file: `git add .cpanel.yml`
- Commit with message: "Add cPanel deployment configuration"
- Do not push yet (wait for Phase 4)

### Task 3.3: Add deployment documentation to CLAUDE.md
- Stage CLAUDE.md changes: `git add CLAUDE.md`
- Commit with message: "Document cPanel deployment process"

**Phase 3 Validation**:
```bash
git log --oneline -2
# Should show 2 new commits:
# - "Document cPanel deployment process"
# - "Add cPanel deployment configuration"

git show HEAD:.cpanel.yml
# Should display .cpanel.yml content
```

**User Action**: Review git commits, verify documentation is clear and accurate

---

## Phase 4: Initial cPanel Deployment

**Goal**: Configure cPanel Git repository and trigger first production deployment
**Target**: Site deployed and live at `https://pensee-boheme.fr`
**Validation**: HTTP 200 responses, functional site, deployment logs show success

### Task 4.1: Configure cPanel Git repository (manual)
- Log into cPanel
- Navigate to Git Version Control
- Click "Create" repository
- Configure:
  - Repository URL: `https://github.com/{user}/{repo}.git` (actual GitHub URL)
  - Repository Path: `/home/{username}/repositories/pensee-boheme-front`
  - Branch: `main`
- Click "Create" to clone repository to cPanel

**Expected Outcome**: Repository cloned to cPanel server

### Task 4.2: Update `.cpanel.yml` with actual cPanel username
- Edit `.cpanel.yml` locally
- Replace `USERNAME` placeholder with actual cPanel username
- Example: `/home/pensee01/public_html`
- Commit change: `git commit -am "Configure deployment path for cPanel"`

### Task 4.3: Trigger first deployment
- Push commits to trigger deployment:
  ```bash
  git push origin main
  ```
- cPanel detects push and executes `.cpanel.yml` tasks

**Expected Behavior**: cPanel starts deployment automatically

### Task 4.4: Monitor deployment logs
- In cPanel Git interface, navigate to repository
- Click "Manage" → "Deployment Logs"
- Watch for task execution:
  - Task 1: export DEPLOYPATH (instant)
  - Task 2: yarn install (~1-3 minutes)
  - Task 3: yarn generate:prod (~1-3 minutes)
  - Task 4: /bin/cp (~10-30 seconds)
- Verify "Deployment completed successfully" message

**Success Indicators**:
- No error messages
- Exit code 0 for all tasks
- Timestamp shows recent deployment

**Failure Handling**:
- If Task 2 fails: Check yarn.lock sync, retry
- If Task 3 fails: Check API availability, review Nuxt errors
- If Task 4 fails: Check disk quota, verify permissions

### Task 4.5: Verify live site functionality
- Visit `https://pensee-boheme.fr`
- Test pages:
  - Home page loads with correct content
  - Galleries page displays thumbnails
  - Click gallery → detail page loads with images
  - Navigation menu works
  - Footer renders correctly
- Check SEO files:
  - `https://pensee-boheme.fr/sitemap.xml` (HTTP 200)
  - `https://pensee-boheme.fr/robots.txt` (HTTP 200)
- Open browser DevTools console:
  - No JavaScript errors (red messages)
  - No 404 errors for assets

### Task 4.6: Verify file system deployment
- SSH to cPanel or use File Manager
- Navigate to `/home/{username}/public_html/`
- Verify presence of:
  - `index.html`
  - `home/`, `galeries/`, `engagement/`, `infos-pratiques/` directories
  - `_nuxt/` directory with JS/CSS bundles
  - `sitemap.xml`, `robots.txt`
- Check file modification timestamps match deployment time

**Phase 4 Validation**:
- Deployment logs show success
- Site is live and functional
- All static files deployed correctly
- SEO files accessible

**User Action**: Perform manual smoke test of live site, verify all critical pages load

---

## Phase 5: Rollback Testing

**Goal**: Validate rollback procedure works correctly
**Target**: Site recovers from intentional deployment failure
**Validation**: Deployment aborts on error, previous version remains live

### Task 5.1: Introduce intentional error
- Create new branch: `git checkout -b test-rollback`
- Introduce syntax error in component:
  - Edit `app/pages/home.vue`
  - Add invalid TypeScript: `const x: string = 123;`
- Commit: `git commit -am "Test: Introduce intentional error"`
- Push: `git push origin test-rollback`
- Merge to main: `git checkout main && git merge test-rollback && git push origin main`

**Expected Behavior**: Deployment triggers, should fail at Task 3 (yarn generate:prod)

### Task 5.2: Verify deployment aborts
- Monitor cPanel deployment logs
- Verify error message appears:
  ```
  [Task 3] yarn generate:prod
  ERROR: TypeScript compilation error in app/pages/home.vue
  Type 'number' is not assignable to type 'string'
  Deployment aborted with exit code 1
  ```
- Verify Task 4 (file copy) does NOT execute

### Task 5.3: Verify site remains functional
- Visit `https://pensee-boheme.fr`
- Verify site serves PREVIOUS version (before error)
- No broken pages
- No 500 errors

**Expected Outcome**: Old deployment unaffected by failed new deployment

### Task 5.4: Revert and redeploy
- Revert error commit:
  ```bash
  git revert HEAD
  git push origin main
  ```
- Monitor cPanel deployment logs
- Verify deployment succeeds
- Verify site still functional

### Task 5.5: Clean up test branch
- Delete test branch:
  ```bash
  git branch -d test-rollback
  git push origin --delete test-rollback
  ```

**Phase 5 Validation**:
- Intentional error causes deployment failure
- Deployment aborts before file copy
- Site serves previous version during failed deployment
- Revert successfully restores working state

**User Action**: Confirm rollback procedure documented, test passed

---

## Phase 6: Final Documentation and Handoff

**Goal**: Complete documentation for ongoing deployment usage
**Target**: README or CLAUDE.md has complete deployment guide
**Validation**: Documentation review, all procedures tested

### Task 6.1: Document common deployment scenarios
Add to CLAUDE.md deployment section:

**Scenarios**:
1. **Regular content update** (new gallery):
   - Make changes, commit, push
   - Monitor deployment logs
   - Verify live site

2. **Dependency update**:
   - Update package.json
   - Run `yarn install` locally
   - Commit yarn.lock
   - Push (cPanel runs `yarn install --frozen-lockfile`)

3. **Emergency rollback**:
   - Identify last working commit: `git log --oneline -5`
   - Revert: `git revert <commit-hash>`
   - Push: `git push origin main`

4. **Troubleshooting deployment failure**:
   - Check cPanel logs for error message
   - Test locally: `yarn generate:prod`
   - Fix error, commit, push

### Task 6.2: Add deployment troubleshooting guide
Add to CLAUDE.md:

**Common Errors**:

| Error | Cause | Solution |
|-------|-------|----------|
| `yarn.lock needs update` | package.json changed without running yarn install | Run `yarn install` locally, commit yarn.lock |
| `API unreachable` | Backend down or network issue | Check `https://api.pensee-boheme.fr/api/galleries`, retry after backend recovery |
| `TypeScript error` | Type mismatch in component | Fix types locally, test with `yarn generate:prod` |
| `Disk quota exceeded` | Too many deployments, old files accumulating | Clean up old `_nuxt` bundles via cPanel File Manager |

### Task 6.3: Update spec documentation
- Mark all tasks as completed in `tasks.md`
- Add deployment completion date
- Archive spec folder or mark as implemented

**Phase 6 Validation**:
- Documentation covers all common scenarios
- Troubleshooting guide is actionable
- No open questions or TODOs

**User Action**: Final review of all documentation, deployment workflow tested end-to-end

---

## Implementation Checklist

**Phase 1: Create Deployment Configuration**
- [ ] Create `.cpanel.yml` file
- [ ] Add DEPLOYPATH export
- [ ] Add yarn install task
- [ ] Add yarn generate:prod task
- [ ] Add file copy task

**Phase 2: Local Pre-Deployment Testing**
- [ ] Test dependency installation
- [ ] Test static generation
- [ ] Verify output structure
- [ ] Preview build locally

**Phase 3: Documentation and Version Control**
- [ ] Update CLAUDE.md with deployment section
- [ ] Commit `.cpanel.yml`
- [ ] Commit CLAUDE.md changes

**Phase 4: Initial cPanel Deployment**
- [ ] Configure cPanel Git repository
- [ ] Update USERNAME in `.cpanel.yml`
- [ ] Push to trigger deployment
- [ ] Monitor deployment logs
- [ ] Verify live site
- [ ] Verify file system

**Phase 5: Rollback Testing**
- [ ] Introduce intentional error
- [ ] Verify deployment aborts
- [ ] Verify site remains functional
- [ ] Revert and redeploy
- [ ] Clean up test branch

**Phase 6: Final Documentation**
- [ ] Document common scenarios
- [ ] Add troubleshooting guide
- [ ] Mark spec as complete

---

## Success Criteria

Deployment configuration is considered successfully implemented when:

1. ✅ `.cpanel.yml` exists in repository root with valid syntax
2. ✅ `git push origin main` triggers automated deployment
3. ✅ Deployment completes in 2-5 minutes with exit code 0
4. ✅ Live site reflects pushed changes within 5 minutes
5. ✅ Failed deployments abort before file copy (fail-fast)
6. ✅ Rollback procedure restores previous version
7. ✅ Documentation enables non-technical user to deploy
8. ✅ No manual FTP or SSH required for normal deployments

---

## Notes

**cPanel Username Placeholder**: `.cpanel.yml` contains `USERNAME` placeholder that must be replaced with actual cPanel username during initial setup (Phase 4, Task 4.2). This allows committing the file to Git without exposing server-specific paths.

**Build Time Variability**: Static generation time (1-3 minutes) depends on:
- Number of galleries (API fetching)
- Number of images (processing)
- cPanel server load (shared hosting)

**Disk Usage**: Each deployment adds ~10-50MB to public_html. Old `_nuxt` bundles (with content hashes) accumulate over time. Recommend manual cleanup every 6 months via cPanel File Manager or SSH.

**API Dependency**: Deployment requires production API (`https://api.pensee-boheme.fr/api`) to be available during build. If API is down, deployment fails at Task 3. No workaround (static site requires data at build time).

**No Build Caching**: cPanel executes tasks from repository clone, no persistent `.nuxt` or `.output` cache. Every deployment is a full rebuild. This ensures reproducibility but increases build time.
