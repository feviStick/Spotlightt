const compatibilityDb = {
  pragma: () => undefined,
  exec: () => undefined,
  prepare: () => ({
    get: () => null,
    all: () => [],
    run: () => undefined,
  }),
  transaction: (fn: () => void) => fn,
};

export default compatibilityDb;
