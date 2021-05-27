export const expectStringifiedToEqual = <T>(actual: T, expected: T) => {
  expect(JSON.stringify(actual)).toEqual(JSON.stringify(expected));
};
