# 🚀 Deployment Instructions

## Deploying to GitHub Pages

The Secure Share website is configured to automatically deploy to GitHub Pages when changes are pushed to the `main` or `copilot/deploy-website` branches.

### One-Time Setup Required

To enable deployment, the repository owner needs to enable GitHub Pages:

1. **Go to Repository Settings**
   - Navigate to: https://github.com/rigvida04/Secure_Share._/settings/pages

2. **Configure GitHub Pages**
   - Under "Build and deployment"
   - Select **Source**: GitHub Actions
   - Click **Save**

3. **Verify Deployment**
   - The GitHub Actions workflow will automatically run
   - Once complete, the website will be available at: **https://rigvida04.github.io/Secure_Share._/**
   - You can check the deployment status in the [Actions tab](https://github.com/rigvida04/Secure_Share._/actions)

### Automatic Deployment

Once GitHub Pages is enabled:
- Every push to `main` or `copilot/deploy-website` branches will trigger an automatic deployment
- The deployment workflow is defined in `.github/workflows/deploy.yml`
- Deployments typically complete within 1-2 minutes

### Manual Deployment

You can also trigger a manual deployment:
1. Go to the [Actions tab](https://github.com/rigvida04/Secure_Share._/actions)
2. Select the "Deploy to GitHub Pages" workflow
3. Click "Run workflow"
4. Select the branch and click "Run workflow"

## Current Status

✅ Website code is ready  
✅ Deployment workflow is configured  
⏳ Waiting for GitHub Pages to be enabled in repository settings

Once GitHub Pages is enabled, the website will be live at:
### 🔗 https://rigvida04.github.io/Secure_Share._/
