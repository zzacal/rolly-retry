export const retryAsync = async <T>(
  funcs: Array<() => Promise<T>>,
  success: (result: T) => boolean = () => false,
  tries: number = 1
) => {
  await funcs.reduce<Promise<boolean>>(async (result, current: () => Promise<T>) => {
    return await result || await retryOne(current, success, tries);
  }, Promise.resolve(false));
};

const retryOne = async <T>(
  func: () => Promise<T>,
  success: (result: T) => boolean,
  tries: number): Promise<boolean> => {
    return tries > 0 ? success(await func()) || retryOne(func, success, --tries) : false;
}
