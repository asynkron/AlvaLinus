# AlvaLinus

AlvaLinus is a static React, TypeScript, Vite, and Shadcn-style website foundation.
It has no backend runtime, API server, database, authentication, or serverless
functions. The production output is static assets in `dist/`.

## Commands

Install dependencies:

```sh
npm install
```

Start the development server:

```sh
npm run dev
```

Build deployable static assets:

```sh
npm run build
```

Run tests:

```sh
npm test
```

Run the repository quality target:

```sh
make quality
```

## Project Structure

- `src/pages/` contains page-level React components.
- `src/components/` contains reusable components, including Shadcn-compatible UI primitives in `src/components/ui/`.
- `src/data/` contains typed static content used by the first page.
- `src/types/` contains shared TypeScript contracts.

## Static Deployment

Publish the generated `dist/` directory to any static hosting platform. The app
does not require a Node.js process after `npm run build`.
