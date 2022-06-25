import simpleGit from 'simple-git';

import { getDependenciesLastUpdates } from './parseFile';

describe('getDependenciesLastUpdates', () => {
  const git = simpleGit();

  it('should resolve absolute dependency at root', async () => {
    const result = await getDependenciesLastUpdates(git, 'doc', {
      updatedAt: new Date(),
      dependencies: ['dep'],
      other: {},
    });
    expect(result[0].file).toBe('dep');
  });

  it('should resolve nested absolute dependency', async () => {
    const result = await getDependenciesLastUpdates(git, 'doc', {
      updatedAt: new Date(),
      dependencies: ['deps/dep'],
      other: {},
    });
    expect(result[0].file).toBe('deps/dep');
  });

  it('should resolve relative dependency at same level', async () => {
    const result = await getDependenciesLastUpdates(git, 'src/doc', {
      updatedAt: new Date(),
      dependencies: ['./dep'],
      other: {},
    });
    expect(result[0].file).toBe('src/dep');
  });

  it('should resolve relative dependency at upper level', async () => {
    const result = await getDependenciesLastUpdates(git, 'docs/doc', {
      updatedAt: new Date(),
      dependencies: ['../dep'],
      other: {},
    });
    expect(result[0].file).toBe('docs/../dep');
  });
});
