/**
 * Calls each function until success.
 * @param {Array<() => T>} funcs - tried in order from [0]
 * @param {(result: T) => boolean}  success - returns true if result is successful (default returns false)
 * @param {number} tries - for each function (default 1)
 */
export const retry = <T>(
  funcs: Array<() => T>,
  success: (result: T) => boolean = () => false,
  tries: number = 1
) => {
  funcs.reduce((result: boolean, current: () => T) => {
    if (result == true) {
      return result;
    }

    for (let i = 0; i < tries; i++) {
      if (success(current())) {
        return true;
      }
    }

    return false;
  }, false);
};
