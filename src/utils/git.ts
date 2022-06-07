import { SimpleGit } from 'simple-git';

const getLastCommitHash = (git: SimpleGit): Promise<string> =>
  git
    .log({ from: 'HEAD~', to: 'HEAD' })
    .then(log => log.latest?.hash ?? '')
    // repo has less than 2 commits
    .catch(() =>
      git
        .log()
        // repo has 1 commit
        .then(log => log.latest?.hash ?? '')
        // repo has no commits
        .catch(() => ''),
    );

export default getLastCommitHash;
