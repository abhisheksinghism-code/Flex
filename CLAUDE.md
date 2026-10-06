@AGENTS.md

## Git workflow (standing instruction)

Never push directly to `main`. For every change:

1. Create a new branch (e.g. `feature/<short-description>` or `fix/<short-description>`).
2. Commit the change there.
3. Push the branch to `origin`.
4. Give the user a one-click PR link:
   `https://github.com/abhisheksinghism-code/Flex/compare/main...<branch>?expand=1`

The user reviews the PR (and its Vercel preview deploy) on GitHub and clicks
Merge themselves. Never merge a PR or push to `main` from the command line,
even if the user says it's approved in chat — the merge happens on GitHub,
by the user.
