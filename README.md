# PreGame

AI-powered press conference prep for professional athletes and coaches. Paste a raw statement, and the app runs a 3-call LLM pipeline — risk assessment → professional translation → adversarial reporter follow-up — so you know exactly what you're walking into before you step up to the podium.

## Features

- **Risk Assessment** — flags problematic phrases, identifies reputational risks, and generates example negative headlines
- **Professional Translation** — rewrites your statement to be press-conference-ready while retaining your core message
- **Adversarial Reporter** — simulates a hostile journalist with 2–3 tough follow-up questions designed to destabilize
- **Crisis Mitigation Rate** — tracks what percentage of your runs successfully eliminated all identified risk factors this session

## Setup

```bash
# 1. Clone the repo
git clone https://github.com/your-username/PreGame.git
cd PreGame/pregame-app

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.local.example .env.local
# Open .env.local and add your OpenAI API key:
# OPENAI_API_KEY=sk-...

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4** + **shadcn/ui**
- **Vercel AI SDK** (`ai`, `@ai-sdk/openai`) — `generateObject` + `generateText`
- **OpenAI gpt-4o**
- **Zod** for schema validation
