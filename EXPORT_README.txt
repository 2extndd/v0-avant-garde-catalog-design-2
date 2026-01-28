v0dev_repo2_export

This folder is intended to be copied into the GitHub repo:
https://github.com/2extndd/v0-avant-garde-catalog-design-2

Contains:
- Full Web UI (Next.js App Router) including pages, components, styles, public assets
- Includes API routes under app/api (config/products/orders) so the project is functionally complete.

If you want a DESIGN-ONLY repo for v0.dev (recommended sometimes):
- delete: app/api
- optionally delete: prisma/ and lib/prisma.ts

Copy instructions (run inside the repo2 folder):
1) Delete old repo contents except .git
   find . -mindepth 1 -maxdepth 1 ! -name ".git" -exec rm -rf {} +
2) Copy this export into repo2 root:
   cp -R /path/to/v0dev_repo2_export/* .
3) Commit & push.

Notes
- Do NOT copy sqlite database files (*.db). This export excludes them.
- The UI spec for v0 is in the main repo file: V0_PROMPT_SITE_UI.txt
