# Auto Commit and Deploy

## Context
The user wants their code to be automatically version-controlled and deployed after every significant change without having to manually request it.

## Behavioral Rules
1. **Always Commit and Push**: After successfully implementing a change, feature, or fix, ALWAYS use the `run_command` tool to stage, commit, and push the code to the GitHub repository.
   - Example: `git add . && git commit -m "feat: <description>" && git push`
2. **Deploy to Vercel**: After pushing the code, ensure it is deployed to Vercel. 
   - If the repository is linked to Vercel, the push itself will trigger the deployment.
   - Alternatively, if requested or required, run the `vercel` CLI command (e.g., `vercel --prod`) to explicitly deploy the application.
3. **Notify the User**: Briefly mention in your response that the code has been pushed and/or deployed.
