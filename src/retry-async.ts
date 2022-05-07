/**
 * These types are for internal use.
 * Adding it to the public signature of the function may cause confusion.
 */
type Retriable<T> = (() => Promise<T>) | (() => T);
type Backoff = {
  constant: number;
  linear: number;
};

/**
 * Retries a function and checks for success.
 * @param {(() => Promise<T>) | (() => T)} funcs - function to be retried
 * @param {() => boolean} success - evaluates the result of the functions for success
 * @param {number} tries - the number of times each function is tried
 * @param {{ constant?: number; linear?: number; }} backoff - the backoff behavior applied to each function
 *
 * By default no calls are categorized successful without a success function.
 */
export function retry<T>(
  func: (() => Promise<T>) | (() => T),
  success?: (result: T) => boolean,
  tries?: number,
  backoff?: {
    constant?: number;
    linear?: number;
  }): Promise<boolean>

/**
 * Retries one or more functions and consecutively checks for success.
 * @param {Array<(() => Promise<T>) | (() => T)>} funcs - functions to be retried
 * @param {() => boolean} success - evaluates the result of the functions for success
 * @param {number} tries - the number of times each function is tried
 * @param {{ constant?: number; linear?: number; }} backoff - the backoff behavior applied to each function
 *
 * By default no calls are categorized successful without a success function.
 */
 export function retry<T>(
  funcs: Array<(() => Promise<T>) | (() => T)>,
  success?: (result: T) => boolean,
  tries?: number,
  backoff?: {
    constant?: number;
    linear?: number;
  }): Promise<boolean>;

export async function retry<T>(
  funcs: Array<(() => Promise<T>) | (() => T)> | (() => Promise<T>) | (() => T),
  success: (result: T) => boolean = () => false,
  tries = 1,
  backoff: {
    constant?: number;
    linear?: number;
  } = {}
) {
  if (Array.isArray(funcs)) {
    for (let i = 0; i < funcs.length; i++) {
      if (await retryOne(funcs[i], success, tries, backoff)) {
        return true;
      }
    }
  } else {
    await retryOne(funcs, success, tries, backoff);
  }
  return false;
};

const retryOne = async <T>(
  func: Retriable<T>,
  success: (result: T) => boolean,
  tries: number,
  backoff: Partial<Backoff>,
  index = 0
): Promise<boolean> => {
  if (tries > 0) {
    // TODO: delay should take a () => Promise
    await delay(index, backoff.constant, backoff.linear);
    return (
      success(await func()) ||
      retryOne(func, success, tries - 1, backoff, index + 1)
    );
  }
  return false;
};

const delay = async (x: number, constant = 0, linear = 0) => {
  // Let's not worry about the first attempt.
  if (x > 0) {
    const ms = constant + x * linear;
    return new Promise((res) => setTimeout(res, ms));
  }
};
