# rolly-retry

A retry, failover library with types.

## Usage

### retry one asynchronous function
```typescript
  let result = "";
  const someFunc = async (val: string): Promise<string> 
    => Promise.resolve(result += val);

  // retry appendResult until it returns "aaa" 
  await retryAsync(
    [async () => await someFunc("a")], 
    (test) => test === "aaa",
    4);

  expect(result).toBe("aaa");
```

### retry n async functions
```typescript
  let result = "";
  const someFunc = async (val: string): Promise<string> => Promise.resolve(result += val);
  const otherFunc = async (): Promise<string> => Promise.resolve(result += "b");

  // run the given functions in order
  // try each 4 times until the result is "aaaabb" (happens on second call of otherFunc)
  await retryAsync(
    [
      async () => await someFunc("a"),
      async () => await otherFunc(),
    ],
    (test) => test === "aaaabb",
    4);
  expect(result).toBe("aaaabb");
```

### retrying with backoff
You can pass a back off to the retry. The back off will cause a delay after the first retry.
Backoffs reset for each function.

```typescript
  const start = Date.now();
  let calls = 0;
  let durations: number[] = []
  const someFunc = async (val: number): Promise<number> => {
    durations.push(Date.now() - start);
    return Promise.resolve(++calls)
  };

  await retryAsync(
    [
      async () => await someFunc(1)
    ], 
    (test) => false, // all tries will call 
    3, // try this many calls
    { 
      constant: 10, // constant delay after first try
      linear: 20    // linear delay after first try
    }); 
  expect(calls).toBe(3);

  /**      
    Call  Constant  Linear  Delay TotalMs
    0:    0         0       0     0
    1:    10        20      30    30
    2:    10        40      50    80
  */
  expect(durations[1]).toBeGreaterThanOrEqual(30);
  expect(durations[2]).toBeGreaterThanOrEqual(80);
```

### synchronous
```typescript
import { retry } from "rolly-retry";

let result = "";
retry([() => (result += "a")], (test) => test === "aaa", 4);
expect(result).toBe("aaa");
```
Retry is not yet supported on sync calls

## Install

```
npm i rolly-retry
```

## Package

[npmjs](https://www.npmjs.com/package/rolly-retry)

## Motivation

This can help add resiliency to systems where calls may sometimes fail. 

For example, if your write path is unavailable in one region, you can call a system in another region.
