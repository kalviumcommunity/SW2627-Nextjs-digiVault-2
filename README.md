# DigiVault

A simple Next.js document vault with password login, PostgreSQL, Prisma, document uploads,
folders, search, downloads, and expiring share links.

## Run it

```bash
npm install
npm run db:up
npm run db:push
npm run dev
```

Open http://localhost:3000. Create an account first, then log in with the username,
email address, or phone number and password you registered.

## Database

PostgreSQL runs through Docker Compose. The default local connection is configured in `.env`:

```text
postgresql://digivault:digivault@localhost:5432/digivault?schema=public
```

Useful commands:

```bash
npm run db:up       # Start PostgreSQL
npm run db:push     # Create/update tables from Prisma schema
npm run db:down     # Stop PostgreSQL
```

Authentication is intentionally simple: passwords are hashed with bcrypt and sessions
use an HTTP-only JWT cookie. OTP and QR login are not part of this implementation.

## Pages

| Route | Screen |
|---|---|
| `/` | Login |
| `/home` | Dashboard |
| `/documents` | Issued Documents (search, filter, sort, infinite scroll) |
| `/search` | Search Documents (category browser) |
| `/drive` | DigiVault Drive (folders) |
| `/about` | About DigiVault (FAQ accordion) |
| `/share/[token]` | Public shared-document access |

## Upload validation

Centralized in `src/lib/validation.ts`:
- Max file size: 10 MB
- Storage quota: 1 GB per user
- Supported types: PDF, JPG, JPEG, PNG, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT

## Stack

Next.js App Router, TypeScript, Tailwind CSS v4, Prisma, PostgreSQL, bcrypt, JWT,
and lucide-react.
