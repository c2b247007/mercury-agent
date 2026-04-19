import { tool } from 'ai';
import { z } from 'zod';
import { execSync } from 'node:child_process';

export function createGitCommitTool() {
  return tool({
    description: 'Record changes to the repository. Creates a new commit with staged changes.',
    parameters: z.object({
      message: z.string().describe('Commit message'),
    }),
    execute: async ({ message }) => {
      try {
        const escapedMsg = message.replace(/"/g, '\\"');
        const result = execSync(`git commit -m "${escapedMsg}"`, { encoding: 'utf-8', timeout: 10000 });
        return result.trim() || 'Committed successfully.';
      } catch (err: any) {
        const stderr = err.stderr?.trim() || '';
        if (stderr.includes('nothing to commit')) {
          return 'Nothing to commit — no staged changes.';
        }
        return `Error: ${stderr || err.message}`;
      }
    },
  });
}