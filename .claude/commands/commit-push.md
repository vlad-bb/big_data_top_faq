Stage all changes, create a meaningful commit, push, and open a PR.

Follow these steps exactly:

1. Run `git status` to see what changed.
2. Run `git diff HEAD` to understand the nature of the changes.
3. Run `git log --oneline -5` to learn the commit message style used in this repo.
4. Stage all changed and untracked files with `git add -A`. Before staging, warn the user if any file looks sensitive (.env, credentials, keys).
5. Write a concise commit message (imperative mood, under 72 chars) that describes WHY the change was made, not just what files changed. Use the repo's existing commit style.
6. Commit with that message, adding the co-author trailer:
   Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
7. Detect the base branch using this logic (run as a single shell block):
   ```bash
   BASE=$(git log --decorate --simplify-by-decoration --oneline HEAD \
     | grep -v "HEAD" \
     | head -1 \
     | sed -n 's/.*origin\/\([^,)]*\).*/\1/p' \
     | head -1)
   # Fall back to the repo default branch if parent branch cannot be detected
   if [ -z "$BASE" ]; then
     BASE=$(git remote show origin | grep 'HEAD branch' | awk '{print $NF}')
   fi
   echo "Base branch: $BASE"
   ```
   Use `$BASE` as the target for the PR.
8. Push the current branch to origin. If the branch has no upstream yet, use `git push -u origin HEAD`.
9. Create a PR with `gh pr create --base "$BASE"` targeting the base branch detected in step 7. Write a short PR body with: a summary bullet list of what changed and why, and a test plan.
10. Return the PR URL to the user.

If any step fails, stop and explain what went wrong before continuing.
