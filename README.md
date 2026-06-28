# TrueClaim AI — Healthcare Claim Auditing Agent

An AI-powered platform that audits healthcare claims by cross-referencing itemized bills and Explanation of Benefits (EOB) documents against Machine-Readable Files (MRF) to detect billing errors, overcharges, and network rate discrepancies.

Built with **Next.js 16**, **Tailwind CSS v4**, **shadcn/ui**, and **AWS S3** for storage.

## Features

- **PDF Upload** — Upload EOBs and itemized hospital bills directly to S3 via presigned URLs
- **AI-Powered Audit** — Backend agent (AWS Lambda + API Gateway + Gemini AI) processes claims against MRF rates
- **Real-Time Dashboard** — Polling-based audit results table with status tracking (completed / failed / processing)
- **Detailed Results** — View extracted payer, provider, and patient data alongside discrepancy analysis
- **File Access** — Download source uploads and final audit reports directly from S3
- **Dark Mode** — Full dark theme support via CSS variables and `next-themes`
- **Responsive Layout** — Collapsible sidebar, mobile-friendly design

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.9 (Turbopack) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + `tw-animate-css` |
| UI Components | shadcn/ui (base-vega) + `@base-ui/react` |
| Icons | lucide-react |
| Storage | AWS S3 (`ap-south-1`) |
| AI | Google Gemini |
| Backend | AWS API Gateway + Lambda |

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- AWS credentials (see `.env.example`)

### Installation

```bash
git clone <repo-url>
cd trueclaim-ai-demo
npm install
```

### Environment Variables

Copy the template and fill in your values:

```bash
# Required
S3_BUCKET=your-bucket-name
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
NEXT_PUBLIC_BACKEND_URL=https://your-api-gateway-url.amazonaws.com

# AI
GEMINI_API_KEY=your-gemini-api-key
GEMINI_PROJECT_NAME=projects/your-project-id
GEMINI_PROJECT_NUMBER=your-project-number
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app redirects to the upload page.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Architecture

```
User Uploads PDF  ──►  Next.js (/upload)
                           │
                           ▼
                   POST /api/uploads/presign
                           │
                     ┌─────┴──────┐
                     ▼            ▼
              S3 Presigned      S3 Bucket
              URL (signed)     (file stored)
                     │
                     ▼
              Backend API (Lambda)
              (Gemini AI audit)
                     │
                     ▼
              Audit Results DB
                     │
                     ▼
              Next.js (/audits)
              (polled every 5s)
```

## Project Structure

```
src/
├── app/
│   ├── api/uploads/presign/route.ts   # S3 presigned URL endpoint
│   ├── audits/                         # Audit results dashboard
│   │   ├── page.tsx                    # Server component with Suspense
│   │   └── audit-content.tsx           # Client component (table + stats)
│   ├── upload/page.tsx                 # PDF upload page
│   ├── layout.tsx                      # Root layout
│   ├── page.tsx                        # Redirects to /upload
│   └── globals.css                     # Tailwind v4 + theme variables
├── components/
│   ├── layout/                         # DashboardShell, Sidebar, Header
│   ├── ui/                             # shadcn/ui components (button, card, table, etc.)
│   └── upload/                         # Upload card component
└── lib/
    └── utils.ts                        # cn() helper
```

## Pages

- **`/upload`** — Upload PDF claims to S3 for processing
- **`/audits`** — View all audits with status, discrepancies, and download links
- **`/audits?filter=<key>`** — Filter audits by filename or ID after upload

## API

### `POST /api/uploads/presign`

Returns a presigned S3 URL for direct browser-to-S3 upload.

**Response:**
```json
{
  "key": "uploads/<uuid>.pdf",
  "uploadUrl": "https://<bucket>.s3.<region>.amazonaws.com/..."
}
```

## Security

- AWS credentials are server-side only (never exposed to the client)
- S3 uploads use short-lived presigned URLs (5-minute expiry)
- `.env` files are gitignored — do not commit secrets
- HIPAA compliance references in the UI indicate workspace posture