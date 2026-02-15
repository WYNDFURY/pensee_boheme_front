# GitHub Actions Deployment Setup

This project uses GitHub Actions to automatically build and deploy to cPanel when pushing to the `main` branch.

## How It Works

1. **Trigger**: Push to `main` branch
2. **Build**: GitHub Actions runs `yarn generate:prod` (creates static files)
3. **Deploy**: FTP uploads `.output/public/` to cPanel's `public_html/`

## Initial Setup

### 1. Get FTP Credentials from cPanel

**In cPanel**:
- Navigate to **FTP Accounts**
- Use existing account or create new one
- Note these values:
  - **Server**: Usually your domain or `ftp.yourdomain.com`
  - **Username**: FTP username (e.g., `penseebo` or `penseebo@pensee-boheme.fr`)
  - **Password**: FTP password

### 2. Add GitHub Secrets

**In GitHub Repository**:
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add these three secrets:

| Secret Name | Value | Example |
|-------------|-------|---------|
| `FTP_SERVER` | Your FTP server address | `ftp.pensee-boheme.fr` |
| `FTP_USERNAME` | Your FTP username | `penseebo` |
| `FTP_PASSWORD` | Your FTP password | `your-secure-password` |

### 3. Verify Deployment Path

The workflow deploys to `./public_html/` by default. If your cPanel uses a different directory:

**Edit `.github/workflows/deploy.yml`:**
```yaml
server-dir: ./public_html/  # Change if needed
```

Common alternatives:
- `./public_html/`
- `./htdocs/`
- `./www/`

### 4. First Deployment

```bash
git add .github/
git commit -m "Add GitHub Actions deployment"
git push origin main
```

**Watch the deployment**:
- GitHub → **Actions** tab
- Click on your workflow run
- Monitor each step (Checkout, Build, Deploy)

## Deployment Workflow

### Regular Deployment
```bash
# Make changes
git add .
git commit -m "Update content"
git push origin main
# GitHub Actions automatically builds and deploys
```

### Monitor Deployment
- **GitHub**: Repository → Actions tab → Latest workflow run
- **Duration**: ~3-5 minutes (install → build → deploy)
- **Success**: Green checkmark ✅
- **Failure**: Red X ❌ (click to see logs)

### Verify Live Site
After successful deployment, verify:
- `https://pensee-boheme.fr` loads
- New changes are visible
- No console errors
- Sitemap accessible: `https://pensee-boheme.fr/sitemap.xml`

## Troubleshooting

### Build Fails

**Error**: `yarn install` or `yarn generate:prod` fails

**Solutions**:
- Check GitHub Actions logs for error message
- Test locally: `yarn generate:prod`
- Fix error, commit, push

### FTP Deploy Fails

**Error**: `Connection refused` or `Login failed`

**Solutions**:
- Verify FTP credentials in GitHub secrets
- Test FTP connection with FileZilla
- Check cPanel FTP settings (port, passive mode)

**Error**: `Permission denied`

**Solutions**:
- Verify FTP user has write permissions to `public_html/`
- Check directory ownership in cPanel File Manager

### Site Not Updating

**Possible causes**:
- Deployment succeeded but files not changed
- Browser cache (hard refresh: Ctrl+Shift+R)
- CDN cache (if using Cloudflare, purge cache)

**Verify deployment**:
- Check file timestamps in cPanel File Manager
- Compare `public_html/` files with `.output/public/` locally

## Advanced Configuration

### Deploy to Subdirectory

To deploy to a subdomain or subdirectory:

```yaml
server-dir: ./subdomain/public_html/  # For subdomain
server-dir: ./public_html/subfolder/  # For subdirectory
```

### Deploy Only on Tag

To deploy only when tagging a release:

```yaml
on:
  push:
    tags:
      - 'v*'  # Trigger on tags like v1.0.0
```

### Deploy to Staging First

Create separate workflows for staging and production:

```yaml
# .github/workflows/deploy-staging.yml
on:
  push:
    branches: [develop]
# Deploy to staging server

# .github/workflows/deploy-production.yml
on:
  push:
    branches: [main]
# Deploy to production server
```

## Security Notes

- **Never commit FTP credentials** to Git
- Use GitHub Secrets for all sensitive data
- Rotate FTP password regularly
- Use strong, unique passwords
- Consider using SFTP instead of FTP if available

## Rollback Procedure

If deployment breaks the site:

### Option 1: Revert Git Commit
```bash
git revert HEAD
git push origin main
# GitHub Actions redeploys previous version
```

### Option 2: Manual Upload
- Build last working commit locally
- Upload `.output/public/` via FTP manually

### Option 3: Restore from Backup
- Use cPanel backup system
- Restore `public_html/` from previous backup
