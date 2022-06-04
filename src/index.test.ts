import { shouldFileBeUpdated } from 'index';

describe('shouldFileBeUpdated', () => {
  it('should not require update if documentation id not committed', () => {
    expect(
      shouldFileBeUpdated('', { lastUpdate: undefined, dependencies: [] })
        .updateRequired,
    ).toBeFalsy();

    expect(
      shouldFileBeUpdated('', {
        lastUpdate: undefined,
        dependencies: [{ file: '', lastUpdate: undefined }],
      }).updateRequired,
    ).toBeFalsy();

    expect(
      shouldFileBeUpdated('', {
        lastUpdate: undefined,
        dependencies: [{ file: '', lastUpdate: new Date() }],
      }).updateRequired,
    ).toBeFalsy();
  });

  it('should not require update if all dependencies were updated before documentation', () => {
    expect(
      shouldFileBeUpdated('', {
        lastUpdate: new Date(3),
        dependencies: [
          { file: '', lastUpdate: new Date(1) },
          { file: '', lastUpdate: new Date(2) },
        ],
      }).updateRequired,
    ).toBeFalsy();
  });

  it('should require update if all dependencies were updated after documentation', () => {
    expect(
      shouldFileBeUpdated('', {
        lastUpdate: new Date(1),
        dependencies: [
          { file: '', lastUpdate: new Date(2) },
          { file: '', lastUpdate: new Date(3) },
        ],
      }).updateRequired,
    ).toBeTruthy();
  });

  it('should require update if some dependencies were updated after documentation', () => {
    expect(
      shouldFileBeUpdated('', {
        lastUpdate: new Date(2),
        dependencies: [
          { file: '', lastUpdate: new Date(1) },
          { file: '', lastUpdate: new Date(3) },
        ],
      }).updateRequired,
    ).toBeTruthy();
  });

  it('should return dependencies that were updated after documentation as updatedDependencies', () => {
    expect(
      shouldFileBeUpdated('', {
        lastUpdate: new Date(2),
        dependencies: [
          { file: 'a', lastUpdate: new Date(1) },
          { file: 'b', lastUpdate: new Date(3) },
        ],
      }).updatedDependencies,
    ).toEqual(['b']);
  });
});
