# rolly-retry

A retry, failover library with types.

## State
![npm version](https://img.shields.io/npm/v/rolly-retry?style=flat) 
![npm downloads](https://img.shields.io/npm/dt/rolly-retry)

![license](https://img.shields.io/github/license/zzacal/rolly-retry)

![build](https://github.com/zzacal/rolly-retry/actions/workflows/ci.yml/badge.svg)
![coverage](./badges/badge-statements.svg)
![coverage](./badges/badge-branches.svg)
![coverage](./badges/badge-lines.svg)

![Libraries.io dependency status for GitHub repo](https://img.shields.io/librariesio/github/zzacal/rolly-retry)


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
  (result) => false,
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

let value = "";
await retry(() => (value += "a"), (result) => result === "aaa", 4);
expect(value).toBe("aaa");
```

## Install

```
npm i rolly-retry
```

## Motivation

This can help add resiliency to systems where calls may sometimes fail. 

For example, if your write path is unavailable in one region, you can call a system in another region.
