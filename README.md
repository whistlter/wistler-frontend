# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
# whistler-admin
# whistler-admin

## Vercel Build Notifications → WhatsApp (via CallMeBot)

Get WhatsApp group messages whenever a Vercel build starts, succeeds, fails, or is canceled.

### How it works

Vercel Build Event → Webhook → `/api/vercel-webhook` → CallMeBot API → WhatsApp Group

### Step 1 — Set up CallMeBot for your WhatsApp group

1. Save `+34 644 59 91 41` as a contact (CallMeBot)
2. Add that contact to your WhatsApp group
3. In the group, send: `I allow callmebot to send me messages`
4. The bot replies with your **phone number** and **API key** — save both

### Step 2 — Add environment variables in Vercel

Go to your Vercel project → **Settings → Environment Variables** and add:

| Key | Value |
|-----|-------|
| `CALLMEBOT_PHONE` | Phone number from step 1 (with country code, no `+`) |
| `CALLMEBOT_APIKEY` | API key from step 1 |
| `VERCEL_WEBHOOK_SECRET` | Any random secret string — you'll use the same value in step 3 |

### Step 3 — Create the Vercel webhook

Go to [vercel.com/account/webhooks](https://vercel.com/account/webhooks) → **Add** and set:

- **URL**: `https://your-deployment-url.vercel.app/api/vercel-webhook`
- **Secret**: same value as `VERCEL_WEBHOOK_SECRET`
- **Events**: Deployment Created, Deployment Ready, Deployment Error, Deployment Canceled

### Example notification

```
🚀 Vercel — Build started
Project: whistler-admin
Branch: feature/build
Author: suleiman
Commit: feat: add activity detail pages
```

```
✅ Vercel — Build successful
Project: whistler-admin
Branch: feature/build
Author: suleiman
URL: https://whistler-admin.vercel.app
```
