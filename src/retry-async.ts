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
  if(tries > 0){
    // TODO: delay should take a () => Promise
    await delay(index, backoff.constant, backoff.linear);
    return success(await func()) ||
      retryOne(func, success, tries - 1, backoff, index + 1)
  }  
  return false;
};

const delay = async ( x: number, constant: number = 0, linear: number = 0) => {
  // Let's not worry about the first attempt.
  if (x > 0) {
    const ms = constant + x * linear;
    return new Promise((res) => setTimeout(res, ms));
  }
};

type Backoff = {
  constant?: number;
  linear?: number;
};
