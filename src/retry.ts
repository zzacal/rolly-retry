/**
 * Calls each function until success.
 * @param {Array<() => T>} funcs - tried in order from [0]
 * @param {(result: T) => boolean}  success - returns true if result is successful (default returns false)
 * @param {number} tries - for each function (default 1)
 * 
 * @throws anything thrown by calls
 */
export const retry = <T>(
  funcs: Array<() => T>,
  success: (result: T) => boolean = () => false,
  tries: number = 1
) => {
  funcs.reduce((result: boolean, current: () => T) => {
    return result || retryOne(current, success, tries);
  }, false);
};

const retryOne = <T>(
  func: () => T,
  success: (result: T) => boolean,
  tries: number): boolean => {
    return tries > 0 ? success(func()) || retryOne(func, success, --tries) : false;
}
