# rolly-retry

A retry, failover library with types.

## Usage

### Retry until a criteria is matched

#### retry one asynchronous function
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

#### retry n async functions
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

#### synchronous
```typescript
import { retry } from "rolly-retry";

let result = "";
retry([() => (result += "a")], (test) => test === "aaa", 4);
expect(result).toBe("aaa");
```

## Install

```
npm i rolly-retry
```

## Package

[npmjs](https://www.npmjs.com/package/rolly-retry)

## Motivation

This can help add resiliency to systems where calls may sometimes fail. 

For example, if your write path is unavailable in one region, you can call a system in another region.
