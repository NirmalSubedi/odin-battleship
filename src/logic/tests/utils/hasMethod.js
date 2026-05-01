const hasMethod = (constructor = {}, method = "") => {
  expect(Object.hasOwn(constructor.prototype, method)).toBe(true);
  expect(typeof constructor.prototype[method]).toBe("function");
};

export { hasMethod };
