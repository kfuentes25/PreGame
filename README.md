# PreGame

AI-powered press conference prep for professional athletes and coaches. Paste a raw statement, and the app runs a 3-call LLM pipeline — risk assessment → professional translation → adversarial reporter follow-up — so you know exactly what you're walking into before you step up to the podium.

## Features

- **Risk Assessment** — flags problematic phrases, identifies reputational risks, and generates example negative headlines
- **Professional Translation** — rewrites your statement to be press-conference-ready while retaining your core message
- **Adversarial Reporter** — simulates a hostile journalist with 2–3 tough follow-up questions designed to destabilize
- **Crisis Mitigation Rate** — tracks what percentage of your runs successfully eliminated all identified risk factors this session

---

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js 18.17 or later** — [https://nodejs.org](https://nodejs.org)
  - To check: `node -v`
- **npm 9 or later** (comes with Node.js)
  - To check: `npm -v`
- An **OpenAI API key** — [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)

---

## Setup

### macOS / Linux

```bash
# 1. Clone the repo
git clone https://github.com/your-username/PreGame.git
cd PreGame/pregame-app

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.local.example .env.local
```

Open `.env.local` in any text editor and add your key:
```
OPENAI_API_KEY=sk-...
```

```bash
# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

### Windows (Command Prompt or PowerShell)

```cmd
:: 1. Clone the repo
git clone https://github.com/your-username/PreGame.git
cd PreGame\pregame-app

:: 2. Install dependencies
npm install

:: 3. Configure environment (Command Prompt)
copy .env.local.example .env.local
```

If you're using **PowerShell**, use this instead:
```powershell
Copy-Item .env.local.example .env.local
```

Open `.env.local` in Notepad or any editor and add your key:
```
OPENAI_API_KEY=sk-...
```

```cmd
:: 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Note:** Make sure you are inside the `pregame-app` folder (not the root `PreGame` folder) before running `npm install` or `npm run dev`.

---

## Troubleshooting

### `Module not found: Can't resolve '@/lib/types'`
This means the `lib/` directory is missing. Make sure you cloned the full repository and that `pregame-app/lib/types.ts` exists. If it's missing, re-clone:
```bash
git clone https://github.com/your-username/PreGame.git
```

### `npm install` fails or hangs
- Make sure you are in the `pregame-app` directory, not the root `PreGame` directory.
- Try clearing the npm cache: `npm cache clean --force`, then run `npm install` again.
- On Windows, if you see permission errors, run Command Prompt or PowerShell **as Administrator**.

### `Error: OPENAI_API_KEY is missing` or blank responses
- Make sure `.env.local` exists inside `pregame-app/` (not `.env.local.example`).
- Make sure the key starts with `sk-` and has no extra spaces or quotes around it.
- Restart the dev server after editing `.env.local`.

### Port 3000 already in use
Run on a different port:
```bash
npm run dev -- -p 3001
```

### Node version errors
This project requires Node.js 18.17+. Check your version with `node -v`. If it's outdated, download the latest LTS from [https://nodejs.org](https://nodejs.org).

---

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4** + **shadcn/ui**
- **Vercel AI SDK** (`ai`, `@ai-sdk/openai`) — `generateObject` + `generateText`
- **OpenAI gpt-4o**
- **Zod** for schema validation
