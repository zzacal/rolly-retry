export const retryAsync = async <T>(
  funcs: Array<() => Promise<T>>,
  success: (result: T) => boolean = () => false,
  tries: number = 1,
  backoff: Backoff = {}
) => {
  await funcs.reduce<Promise<boolean>>(
    async (result, current: () => Promise<T>) => {
      return (
        (await result) || (await retryOne(current, success, tries, backoff))
      );
    },
    Promise.resolve(false)
  );
};

const retryOne = async <T>(
  func: () => Promise<T>,
  success: (result: T) => boolean,
  tries: number,
  backoff: Backoff,
  index: number = 0
): Promise<boolean> => {
  await delay(index, backoff.constant, backoff.linear, backoff.exponential);
  return tries > 0
    ? success(await func()) ||
        retryOne(func, success, tries - 1, backoff, index + 1)
    : false;
};

const delay = async (
  x: number = 0,
  constant: number = 0,
  linear: number = 0,
  exponential: { base: number; coefficient: number } = {
    base: 0,
    coefficient: 1,
  }
) => {
  // Let's not worry about the first attempt.
  if (x > 0) {
    const { base, coefficient} = exponential;
    const ms = constant + x * linear + x * (base ^ coefficient);
    return new Promise((res) => setTimeout(res, ms));
  }
};

type Backoff = {
  constant?: number;
  linear?: number;
  exponential?: { base: number; coefficient: number };
};
