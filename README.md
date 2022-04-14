# rolly-retry

A Retry Library with Types

## Usage

### Retry until a criteria is matched

#### synchronous
```typescript
import { retry } from "rolly-retry";

let result = "";
retry([() => (result += "a")], (test) => test === "aaa", 4);
expect(result).toBe("aaa");
```

> In this example, the function `() => result += "a"` is called up to 4 times until it returns a value that matches the success criteria `(test) => test === "aaa"`.

#### asynchronous
```typescript
    let result = "";
    const appendResultAsync = async (val: string): Promise<string> 
      => Promise.resolve(result += val);

    await retryAsync([async () => await appendResultAsync("a")], (test) => test === "aaa", 4);
    expect(result).toBe("aaa");
```

> Same as the example above, but the function happens to return a promise. 


## Install

```
npm i rolly-retry
```

## Package
