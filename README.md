# SajuMuse PDF Generator

Transforms Korean Four Pillars (사주명리학) JSON data into premium English PDF reports using Claude AI.

## Features

- **4 Tiers**: Basic (~30p), Love (~60p), Full (~80p), Premium (~60+p with yearly breakdown)
- **5 Themes**: Classic, Modern, Minimal, Elegant, Love (pastel pink)
- **AI-Powered**: Claude Sonnet generates personalized analysis per section
- **3-Layer Terminology**: Natural English + Classical + Original (漢字)
- **PDF Components**: Saju chart, Yongsin chart, Yin-Yang bars, Shinsal table, Daeun timeline, Nyunun/Wolun cards

## Tech Stack

- Next.js 14+ (App Router, TypeScript strict)
- @react-pdf/renderer (PDF generation)
- @anthropic-ai/sdk (Claude API)
- Zustand (state management)
- Tailwind CSS (web UI)

## Getting Started

```bash
npm install
```

### Environment Variables

Create `.env.local`:

```env
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Fonts (Optional)

Place these `.ttf` files in `src/fonts/` for proper CJK rendering:

- `Inter-Regular.ttf`, `Inter-Bold.ttf`
- `PlayfairDisplay-Regular.ttf`, `PlayfairDisplay-Bold.ttf`
- `NotoSansKR-Regular.ttf`

Without fonts, PDFs render with Helvetica fallback.

### Run

```bash
npm run dev        # Development server
npm run build      # Production build
npm run typecheck  # TypeScript check
```

Open http://localhost:3000

## Usage

1. Select a tier (Basic / Love / Full / Premium)
2. Upload or paste saju JSON data
3. Optionally upload a cover image
4. Choose a PDF theme
5. Click "Generate PDF with AI" or "Quick test" (dummy text)
6. Download the generated PDF

## API Routes

| Route | Method | Description |
|---|---|---|
| `/api/translate` | POST | Claude AI analysis for a single part |
| `/api/generate-pdf` | POST | Render PDF from saju data + texts |

Both routes have `maxDuration: 120s` for Vercel Pro.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx            # Main generator UI
│   └── api/
│       ├── translate/      # Claude API endpoint
│       └── generate-pdf/   # PDF rendering endpoint
├── components/
│   ├── ui/                 # Web UI components (Tailwind)
│   └── pdf/                # @react-pdf/renderer components
│       └── styles/         # PDF styles & themes
├── lib/
│   ├── types/              # TypeScript types (saju, tier, theme, pdf)
│   ├── constants/          # Tiers, themes, terms, part keys
│   ├── translate/          # Claude API client & prompts
│   └── utils/              # JSON parsing, info extraction, tier filtering
├── store/                  # Zustand store
└── fonts/                  # TTF font files (gitignored)
```

## Deploy

Deployed on Vercel (Pro plan recommended for 120s API timeout).

```bash
vercel --prod
```
