# AstroViewer

A multi-band astronomical data fusion (JSP) visualization application built with React, Three.js, and TypeScript.

- Definitions
  - Combine observation images from multiple telescopes/bands (usually in FITS format) by aligning and fusing them into a more complete, higher-quality astronomical image that highlights complementary information from different data sources (spatial resolution, band, exposure time, etc.).
- Inputs / Outputs
  - Input: FITS files (or converted JSON/PNG) with astronomical coordinates/metadata (WCS, exposure, filter, etc.). See the project’s conversion script `convert_fits_json.py`.
  - Output: PNGs / multi-layer canvases suitable for display, or fused data for further processing.
- Core process (common steps)
  1. Data ingestion: obtain FITS paths from a backend/API or storage (see architecture notes in the project README).
  2. Calibration & registration: reproject using WCS info, perform sub-pixel alignment and star matching.
  3. PSF / brightness normalization: match point spread functions and brightness scales across telescopes.
  4. Fusion algorithms: multi-scale or weight-based fusion (the JSP fusion algorithm mentioned in the project is shown in the architecture diagram in README).
  5. Visualization rendering: display in the front end with Canvas / WebGL (Three.js), supporting layers, color mapping, zoom, and pan.
- Interaction & configuration
  - Allow users to adjust telescope parameters (weights, gamma/contrast, pseudo-color mapping), select bands to fuse, toggle source detection or pseudo-color overlays, etc.
- Architecture (mapped to this repo)
  - Frontend: JSP UI (React + Vite), entry is `index.html`, configuration in `vite.config.ts`.
  - Backend/API (conceptual): provides FITS paths and performs server-side fusion or format conversion (FITS -> PNG/JSON).
  - Storage: object storage or filesystem for FITS and fusion outputs.

## Environment requirements

### Node.js

Node.js >= 18 is recommended.

### Package manager

This project uses pnpm as the package manager:

```bash
npm install -g pnpm
```

### Turbo

Install Turbo to support the monorepo:

```bash
pnpm install turbo --global
```

## Quick start

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev

# Or start the JSP-UI app only
cd apps/jsp-ui
pnpm dev
```

## Project structure

This is a Turborepo monorepo containing:

### Apps

- `jsp-ui`: The main astronomical visualization app, built with React + TypeScript + Vite

### Packages

- `@zj-astro/ui`: Shared React component library
- `@repo/eslint-config`: ESLint configurations
- `@repo/typescript-config`: TypeScript configurations
- `operators`: Operator utilities

## Developer tools

The project is configured with:

- TypeScript — static type checking
- ESLint — linting
- Prettier — code formatting

## Dev commands

```bash
# Development mode — start all apps
pnpm dev

# Start a specific app only
turbo dev --filter=jsp-ui

# Build all apps
pnpm build

# Lint
pnpm lint

# Format
pnpm format
```

## Dependency management

> ⚠️ Use pnpm to manage dependencies; do not use npm or yarn

```bash
# Install all dependencies
pnpm install

# Add a dependency to a specific app
pnpm add <package-name> --filter jsp-ui

# Add a dependency at the root workspace
pnpm add <package-name> -w
```
