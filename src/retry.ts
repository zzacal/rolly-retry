export const retry = <T>(
  funcs: Array<() => T>,
  success: (result: T) => boolean = () => false,
  tries = 1
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
