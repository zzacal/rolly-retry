export const retry = <T>(
  funcs: Array<() => T>,
  success: (result: T) => boolean = () => false,
  tries: number = 1
) => {
  funcs.reduce((result: boolean, current: Function) => {
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
