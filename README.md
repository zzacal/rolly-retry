# rolly-retry

A retry, failover library with types.

## Usage

### retry one async function
```typescript
import { retry } from "rolly-retry";

/**
* call retriable_func("value")
* until the result === "success"
* up to 4 times
*/
await retry(
  async () => await retriable_func("value"), 
  (result) => result === "success",
  4
);
```

### retry and failover
```typescript
import { retry } from "rolly-retry";

/**
* call primary_retriable()
* until the result === "success"
* up to 4 times
* otherwise, call backup_retriable()
* until the result === "success"
* up to 4 times
*/
await retry(
  [
    async () => await primary_retriable(),
    async () => await backup_retriable(),
  ],
  (result) => result === "success",
  4
);
```

### retrying with backoff
You can pass a back off to the retry. The back off will cause a delay after the first retry.
Backoffs reset for each function.

```typescript
import { retry } from "rolly-retry";

await retry(
  [
    async () => await func_i_want_to_try(1)
  ], 
  (test) => false,
  3,
  { 
    constant: 10, // constant 10ms delay after first try
    linear: 20    // linear X20ms delay after first try
  }
);
expect(calls).toBe(3);
/**      
 * Call  Constant  Linear  Delay TotalMs
 * 0:    0         0       0     0
 * 1:    10        20      30    30
 * 2:    10        40      50    80
*/
```

### synchronous
```typescript
import { retry } from "rolly-retry";

let result = "";
await retry(() => (result += "a"), (test) => test === "aaa", 4);
expect(result).toBe("aaa");
```

## Install

```
npm i rolly-retry
```

## Motivation

This can help add resiliency to systems where calls may sometimes fail. 

For example, if your write path is unavailable in one region, you can call a system in another region.
