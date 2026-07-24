# Repo rules for Claude Code

## Commit authorship

Never add a `Co-Authored-By: Claude ...` (or any AI/model) trailer to commit
messages, and never alter git author/committer identity away from the local
`git config user.name` / `user.email`. Commits in this repo must show only
the human developer as author — no exceptions, no opt-in prompts.
