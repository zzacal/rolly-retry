# rolly-retry

A Retry Library with Types

## Usage

### Retry until a criteria is matched

```typescript
let result = "";
retry([() => (result += "a")], (test) => test === "aaa", 4);
expect(result).toBe("aaa");
```

In this example, the function `() => result += "a"` is called up to 4 times until it returns a value that matches the success criteria `(test) => test === "aaa"`.
