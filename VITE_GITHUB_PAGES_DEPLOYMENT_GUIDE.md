# Complete Guide: Deploying Vite/React/TypeScript to GitHub Pages

**Based on real deployment challenges and solutions from the livre-final project**

---

## Table of Contents
1. [Project Structure Requirements](#1-project-structure-requirements)
2. [Essential Dependencies](#2-essential-dependencies)
3. [Critical Configuration Files](#3-critical-configuration-files)
4. [GitHub Actions Workflow](#4-github-actions-workflow)
5. [GitHub Repository Setup](#5-github-repository-setup)
6. [Deployment Checklist](#6-deployment-checklist)
7. [Major Issues & Solutions](#7-major-issues--solutions)
8. [DO's and DON'Ts](#8-dos-and-donts)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. Project Structure Requirements

### ✅ Correct Structure (Flat Root)

```
your-repo/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── src/                        # Source code
│   ├── components/
│   ├── pages/
│   └── main.tsx
├── public/                     # Static assets
├── dist/                       # Build output (gitignored)
├── node_modules/               # Dependencies (gitignored)
├── index.html                  # Entry point
├── package.json                # Dependencies & scripts
├── package-lock.json           # Lock file (MUST commit)
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript config
├── .eslintrc.json              # ESLint config (REQUIRED)
├── tailwind.config.js          # Tailwind (if used)
├── postcss.config.js           # PostCSS (if used)
└── .gitignore
```

### ❌ Problematic Structure (Nested)

```
your-repo/
├── codex-collective/           # ❌ Nested app directory
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
└── package.json                # ❌ Root package.json
```

**Problem**: GitHub Actions runs from repository root. Nested structures require extra configuration and cause build failures.

**Solution**: Either:
- **Option A**: Move all files to root (recommended)
- **Option B**: Configure workflow with `working-directory` for nested structure (complex)

---

## 2. Essential Dependencies

### package.json

```json
{
  "name": "your-vite-app",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}
```

### Must-Have Dependencies

| Package | Purpose | Category |
|---------|---------|----------|
| `react`, `react-dom` | Framework | dependencies |
| `@vitejs/plugin-react` | Vite React support | devDependencies |
| `typescript` | Type checking | devDependencies |
| `eslint` | Linting (required for CI) | devDependencies |
| `@typescript-eslint/eslint-plugin` | TS linting | devDependencies |
| `@typescript-eslint/parser` | TS parsing | devDependencies |
| `eslint-plugin-react-hooks` | React hooks linting | devDependencies |
| `vite` | Build tool | devDependencies |

### ⚠️ Version Warnings

- **Vite**: Use v5.x (stable). Avoid v7+ unless you know what you're doing.
- **ESLint**: Use v8.x. v9+ has breaking configuration changes.
- **React**: v18.2+ is stable.

---

## 3. Critical Configuration Files

### A. vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/',  // ⚠️ CRITICAL: Must match GitHub repo name
  server: {
    port: 3000,
    open: true,
  },
});
```

**Key Points**:
- `base` must be `/repo-name/` (with leading and trailing slashes)
- If your repo is `https://github.com/user/my-app`, use `base: '/my-app/'`
- For custom domains, use `base: '/'`

### B. .eslintrc.json

**⚠️ REQUIRED** - Deployment will fail without this!

```json
{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "plugins": [
    "@typescript-eslint",
    "react-refresh"
  ],
  "rules": {
    "react-refresh/only-export-components": [
      "warn",
      { "allowConstantExport": true }
    ],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { "argsIgnorePattern": "^_" }
    ]
  },
  "ignorePatterns": [
    "dist",
    "node_modules",
    "*.config.js",
    "*.config.ts"
  ]
}
```

**Why Required**:
- The `npm run lint` step in GitHub Actions will fail without it
- Creates a `.eslintrc.json` or `eslint.config.js` file

### C. tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### D. .gitignore

```
# Dependencies
node_modules/

# Build output
dist/
dist-ssr/
*.local

# Environment
.env
.env.local

# Editor
.vscode/*
!.vscode/extensions.json
.idea/
.DS_Store
*.swp

# Logs
logs/
*.log
npm-debug.log*

# OS
Thumbs.db
```

**⚠️ DO NOT IGNORE**:
- `package-lock.json` (required for reproducible builds)
- `.eslintrc.json` (required for CI)
- `vite.config.ts` (required for build)

---

## 4. GitHub Actions Workflow

### .github/workflows/deploy.yml

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main  # Trigger on push to main branch
  workflow_dispatch:  # Allow manual trigger

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'  # Cache npm dependencies

      - name: Install dependencies
        run: npm ci  # Use 'ci' for clean install

      - name: Lint
        run: npm run lint  # Will fail if no ESLint config

      - name: Build
        run: npm run build  # Runs 'tsc && vite build'

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'  # Upload build output

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build  # Wait for build job to complete
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Key Workflow Components

| Step | Purpose | Common Issues |
|------|---------|---------------|
| `actions/checkout@v4` | Clone repository | Submodule conflicts |
| `actions/setup-node@v4` | Install Node.js | Wrong Node version |
| `npm ci` | Install dependencies | Missing package-lock.json |
| `npm run lint` | Run ESLint | Missing .eslintrc.json |
| `npm run build` | Build project | TypeScript errors, wrong base path |
| `upload-pages-artifact@v3` | Upload dist folder | Wrong path (must be './dist') |
| `deploy-pages@v4` | Deploy to GitHub Pages | Permissions not set |

---

## 5. GitHub Repository Setup

### Step-by-Step Configuration

#### A. Enable GitHub Pages

1. Go to repository **Settings**
2. Navigate to **Pages** (left sidebar)
3. Under **Build and deployment**:
   - **Source**: Select **GitHub Actions** (NOT "Deploy from a branch")
4. Save changes

**Screenshot Reference**:
```
Settings > Pages > Source: GitHub Actions
```

#### B. Verify Repository Permissions

1. Go to **Settings** > **Actions** > **General**
2. Scroll to **Workflow permissions**
3. Select **Read and write permissions**
4. Check **Allow GitHub Actions to create and approve pull requests**
5. Save

#### C. Branch Protection (Optional but Recommended)

1. Go to **Settings** > **Branches**
2. Add rule for `main` branch:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging

---

## 6. Deployment Checklist

### Pre-Deployment

- [ ] Project structure is flat (no nested app directories)
- [ ] All dependencies installed: `npm install`
- [ ] `package-lock.json` exists and is committed
- [ ] `.eslintrc.json` exists and is committed
- [ ] `vite.config.ts` has correct `base` path
- [ ] Local build succeeds: `npm run build`
- [ ] Local preview works: `npm run preview`
- [ ] Linting passes: `npm run lint`
- [ ] TypeScript compiles: `tsc --noEmit`
- [ ] `.gitignore` does NOT ignore `package-lock.json` or config files

### GitHub Setup

- [ ] Repository exists on GitHub
- [ ] `.github/workflows/deploy.yml` is committed
- [ ] GitHub Pages source is set to **GitHub Actions**
- [ ] Workflow permissions set to **Read and write**
- [ ] No `.gitmodules` file exists (no submodules)

### First Deployment

- [ ] Push to `main` branch
- [ ] Check **Actions** tab for workflow run
- [ ] Wait for both `build` and `deploy` jobs to complete (2-5 minutes)
- [ ] Visit `https://username.github.io/repo-name/`
- [ ] Test all routes (if using React Router)
- [ ] Check browser console for errors

---

## 7. Major Issues & Solutions

### Issue #1: Nested Project Structure

**Symptom**: Workflow fails with "Cannot find module 'vite'"

**Cause**:
```
repo/
├── my-app/              # App is in subdirectory
│   ├── package.json
│   └── src/
└── .github/workflows/   # Workflow runs from root
```

**Solution**: Move all files to root
```bash
# From repo root
mv my-app/* .
mv my-app/.* .
rm -rf my-app/
git add .
git commit -m "chore: flatten project structure for GitHub Pages"
git push
```

---

### Issue #2: Missing ESLint Configuration

**Symptom**: Build fails with "No ESLint configuration found"

**Error Message**:
```
Oops! Something went wrong! :(
ESLint: 8.55.0
No ESLint configuration found in /home/runner/work/repo/repo.
```

**Cause**: The `npm run lint` step requires `.eslintrc.json` or `eslint.config.js`

**Solution**: Create `.eslintrc.json` (see section 3B)

**Quick Fix**:
```bash
cat > .eslintrc.json << 'EOF'
{
  "env": { "browser": true, "es2021": true },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": ["@typescript-eslint", "react-refresh"],
  "ignorePatterns": ["dist", "node_modules"]
}
EOF
git add .eslintrc.json
git commit -m "fix: add ESLint configuration for CI/CD"
git push
```

---

### Issue #3: Wrong Base Path

**Symptom**: Deployed site shows blank page, assets fail to load (404)

**Browser Console**:
```
GET https://username.github.io/assets/index-abc123.js 404 (Not Found)
```

**Cause**: `vite.config.ts` missing or wrong `base` path

**Wrong**:
```typescript
export default defineConfig({
  plugins: [react()],
  // base: '/',  ❌ Wrong for GitHub Pages
});
```

**Correct**:
```typescript
export default defineConfig({
  plugins: [react()],
  base: '/repo-name/',  // ✅ Must match repository name
});
```

**Solution**:
```bash
# Edit vite.config.ts
# Add: base: '/your-repo-name/',
git add vite.config.ts
git commit -m "fix: add base path for GitHub Pages deployment"
git push
```

---

### Issue #4: Submodule Conflicts

**Symptom**: Workflow fails with "fatal: No url found for submodule path"

**Cause**: `.gitmodules` file exists with broken references

**Solution**: Remove submodules
```bash
# Remove submodule entry
git rm --cached path/to/submodule
rm -rf path/to/submodule
rm .gitmodules
git add .
git commit -m "fix: remove broken submodule configuration"
git push
```

---

### Issue #5: Missing package-lock.json

**Symptom**: `npm ci` fails in workflow

**Error**:
```
npm ERR! `npm ci` can only install packages when your package.json and package-lock.json are in sync.
```

**Cause**: `package-lock.json` was gitignored or deleted

**Solution**:
```bash
# Regenerate lockfile
rm -f package-lock.json
npm install
git add package-lock.json
git commit -m "fix: add package-lock.json for reproducible builds"
git push
```

---

### Issue #6: SPA Routing (404 on Refresh)

**Symptom**: React Router routes work on navigation but 404 on page refresh

**Cause**: GitHub Pages doesn't support client-side routing by default

**Solution**: Vite automatically handles this with the build output. No additional configuration needed.

**Verify**:
- The `dist/` folder should contain `index.html`
- Vite build includes SPA fallback handling

---

### Issue #7: Vite Version Incompatibility

**Symptom**: Build fails with cryptic errors after upgrading Vite

**Error**:
```
Error: Failed to parse source for import analysis
```

**Cause**: Vite v7+ has breaking changes

**Solution**: Stick to Vite v5.x
```bash
npm install --save-dev vite@^5.0.8
npm install
git add package.json package-lock.json
git commit -m "fix: revert to Vite v5 for stability"
git push
```

---

## 8. DO's and DON'Ts

### ✅ DO

| Action | Reason |
|--------|--------|
| Commit `package-lock.json` | Ensures reproducible builds |
| Use `npm ci` in CI/CD | Faster and more reliable than `npm install` |
| Set `base` path in Vite config | Required for GitHub Pages asset loading |
| Test locally with `npm run build && npm run preview` | Catches issues before deployment |
| Use flat project structure | Simplifies GitHub Actions configuration |
| Enable GitHub Actions in Pages settings | Required for automatic deployment |
| Use Node 20 in workflow | Long-term support version |
| Include ESLint configuration | Required for lint step in workflow |
| Use semantic commit messages | Easy to track deployment history |
| Check Actions tab after push | Monitor build and deployment status |

### ❌ DON'T

| Action | Consequence |
|--------|-------------|
| Gitignore `package-lock.json` | Unpredictable builds, CI failures |
| Use nested app directories | Workflow can't find dependencies |
| Forget `base` path in Vite config | Blank page, 404 assets |
| Skip ESLint configuration | Lint step fails in CI |
| Use Git submodules for app code | Deployment conflicts |
| Upgrade to Vite v7+ without testing | Breaking changes cause failures |
| Use `npm install` in CI | Slower and less reliable |
| Set Pages source to "branch" | Conflicts with GitHub Actions workflow |
| Hardcode URLs without base path | Assets won't load on GitHub Pages |
| Push broken code to main | Triggers failed deployment |

---

## 9. Troubleshooting

### Debugging Workflow Failures

#### Step 1: Check Actions Tab
1. Go to repository **Actions** tab
2. Click the failed workflow run
3. Expand the failed step (usually `Lint` or `Build`)
4. Read the error message

#### Step 2: Reproduce Locally
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Run exact CI commands
npm ci
npm run lint
npm run build
npm run preview
```

#### Step 3: Common Error Messages

| Error | Likely Cause | Fix |
|-------|--------------|-----|
| "Cannot find module 'vite'" | Nested structure or missing deps | Flatten structure, commit package-lock.json |
| "No ESLint configuration found" | Missing .eslintrc.json | Create ESLint config (see section 3B) |
| "404 Not Found" for assets | Wrong base path | Update vite.config.ts base path |
| "npm ci can only install..." | package-lock.json out of sync | Run `npm install` and commit lockfile |
| "fatal: No url found for submodule" | Broken .gitmodules | Remove submodules (see Issue #4) |
| TypeScript errors during build | Type errors in code | Fix TypeScript errors locally first |

### Manual Deployment Test

```bash
# 1. Clean build
npm run build

# 2. Serve locally (simulates GitHub Pages)
npx serve dist -p 8080

# 3. Open browser
# Visit: http://localhost:8080/repo-name/
# Note: Include the base path in URL
```

### Verify Deployment

After successful workflow run:

1. **Check deployment URL**:
   - Format: `https://username.github.io/repo-name/`
   - Wait 2-5 minutes for DNS propagation

2. **Test routes** (if using React Router):
   ```
   https://username.github.io/repo-name/
   https://username.github.io/repo-name/about
   https://username.github.io/repo-name/contact
   ```

3. **Check browser console**:
   - No 404 errors for assets
   - No CORS errors
   - No module loading errors

4. **Verify assets load**:
   - Images display correctly
   - CSS styles applied
   - JavaScript runs without errors

---

## Quick Start Template

### 1. Create Vite Project

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
```

### 2. Install Linting Dependencies

```bash
npm install --save-dev \
  eslint \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser \
  eslint-plugin-react-hooks \
  eslint-plugin-react-refresh
```

### 3. Create .eslintrc.json

```json
{
  "env": { "browser": true, "es2021": true },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": ["@typescript-eslint", "react-refresh"],
  "ignorePatterns": ["dist", "node_modules"]
}
```

### 4. Update vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/my-app/',  // Change to your repo name
});
```

### 5. Create GitHub Workflow

```bash
mkdir -p .github/workflows
```

Create `.github/workflows/deploy.yml` (copy from section 4)

### 6. Initialize Git & Deploy

```bash
git init
git add .
git commit -m "feat: initial commit with GitHub Pages deployment"
git remote add origin https://github.com/username/my-app.git
git push -u origin main
```

### 7. Configure GitHub Pages

1. Go to **Settings** > **Pages**
2. Source: **GitHub Actions**
3. Save

### 8. Verify Deployment

- Check **Actions** tab
- Wait for workflow to complete
- Visit `https://username.github.io/my-app/`

---

## Summary of Critical Requirements

| Requirement | Why Critical |
|-------------|--------------|
| Flat project structure | GitHub Actions runs from repo root |
| `.eslintrc.json` committed | `npm run lint` step will fail without it |
| `package-lock.json` committed | Reproducible builds in CI |
| `base: '/repo-name/'` in Vite config | Asset paths must be correct for GitHub Pages |
| GitHub Pages source = "GitHub Actions" | Enables automatic deployment |
| Workflow permissions = "Read and write" | Allows deployment to Pages |
| `npm ci` in workflow | Faster, more reliable than `npm install` |
| No Git submodules for app code | Causes checkout conflicts |
| Node 20 in workflow | LTS version, most compatible |

---

## Lessons from livre-final Project

This guide was created after resolving these real deployment issues:

1. ✅ **Removed nested submodule structure** (commit 3721835)
   - Problem: `codex-collective/` subdirectory was a Git submodule
   - Solution: Flattened structure to root

2. ✅ **Added ESLint configuration** (commit 3ca0a32)
   - Problem: `npm run lint` failed in CI
   - Solution: Created `.eslintrc.json`

3. ✅ **Configured base path** (commit cc0c578)
   - Problem: Assets returned 404 errors
   - Solution: Added `base: '/livre-final/'` to Vite config

4. ✅ **Reverted Vite v7 upgrade** (commit ae3540b)
   - Problem: Breaking changes in Vite v7
   - Solution: Stayed on stable Vite v5

All deployments now succeed automatically on push to `main`. 🎉

---

## Additional Resources

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#github-pages)
- [GitHub Actions for Pages](https://github.com/actions/deploy-pages)
- [React Router with GitHub Pages](https://reactrouter.com/en/main/start/tutorial)
- [ESLint Configuration](https://eslint.org/docs/latest/use/configure/)

---

**Last Updated**: Based on livre-final deployment (2025-11-07)
**Tested With**: Vite 5.0.8, React 18.2, Node 20, GitHub Actions
