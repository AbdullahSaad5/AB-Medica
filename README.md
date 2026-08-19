# AB Medica

<!-- repo-hygiene: reposhuttle-standard -->

**Customer-facing web application for AB Medica.**

## Overview

Customer-facing web application for AB Medica.

This README records the repository's purpose, verified local workflow, major technology choices, and maintenance status so the project can be understood without first reverse-engineering the source tree.

[View the deployed project](https://ab-medica.vercel.app)

## Highlights

- Application routing and production builds through Next.js
- Interactive 3D rendering powered by Three.js
- Utility-first styling with Tailwind CSS
- Static typing across the primary application code
- Hosted project link available from the repository metadata

## Tech stack

TypeScript, Next.js, React, Tailwind CSS, Three.js

## Quick start

```bash
git clone <repository-url>
cd <repository-directory>
yarn install
yarn run dev
```

Replace the placeholders with this repository's clone URL and local directory.

## Available commands

| Command | Purpose |
| --- | --- |
| `yarn run dev` | Start the local development workflow. |
| `yarn run build` | Create a production build. |
| `yarn run start` | Start the application. |
| `yarn run lint` | Run static-analysis and lint checks. |

## Configuration

No repository-specific configuration file is required for the basic workflow documented above.

## Project structure

```text
app/  # application routes, layouts, and features
public/  # static files served as-is
```

## Repository status

This repository is maintained as a project reference and portfolio artifact.

## Development

Before submitting a change, run `yarn run lint`, `yarn run build`.
Keep changes focused, avoid committing generated artifacts unless the project already tracks them, and update this README whenever setup or behavior changes.

## Security and configuration hygiene

Keep secrets in local environment variables or an ignored `.env` file. Never commit API keys, access tokens, private keys, production database URLs, or customer data. If a credential is committed, revoke and rotate it; deleting the file in a later commit does not remove it from Git history.

## Contributing

Open an issue or provide context before making a large change. Prefer small pull requests with a clear purpose, verification notes, and screenshots for visible UI changes.

## License

No license file is currently included. Unless the repository owner states otherwise, the source is not offered under an open-source license.
