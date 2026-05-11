const isInheritedProperty = (object, property) => {
  expect(property in object).toBe(true);
  expect(Object.hasOwn(object, property)).toBe(false);
};

export { isInheritedProperty };
