import { retry, retryAsync } from "./";

describe("retry", () => {
  it("should retry failed funcs", () => {
    let result = "";
    retry([() => (result += "a")], (test) => test === "aaa", 4);
    expect(result).toBe("aaa");
  });
  it("should call all funcs", () => {
    let result = "";
    retry([
      () => (result += "a"),
      () => (result += "b"),
      () => (result += "c"),
    ]);
    expect(result).toBe("abc");
  });

  it("should call all funcs until success", () => {
    let result = "";
    retry(
      [() => (result += "a"), () => (result += "b"), () => (result += "c")],
      (test) => test === "ab"
    );
    expect(result).toBe("ab");
  });

});

describe("retry-async", () => {
  it("should retry failed funcs", async () => {
    let result = "";
    const someFunc = async (val: string): Promise<string> => Promise.resolve(result += val);

    await retryAsync([async () => await someFunc("a")], (test) => test === "aaa", 4);
    expect(result).toBe("aaa");
  });

  it("should retry multiple failed funcs until success", async () => {
    let result = "";
    const someFunc = async (val: string): Promise<string> => Promise.resolve(result += val);
    const otherFunc = async (): Promise<string> => Promise.resolve(result += "b");

    await retryAsync(
      [
        async () => await someFunc("a"),
        async () => await otherFunc(),
      ],
      (test) => test === "aaaabb",
      4);
    expect(result).toBe("aaaabb");
  });

  it("should call all funcs", async () => {
    let result = "";
    await retryAsync([
      async () => Promise.resolve(result += "a"),
      async () => Promise.resolve(result += "b"),
      async () => Promise.resolve(result += "c"),
    ]);
    expect(result).toBe("abc");
  });

  it("should call all funcs until success", async () => {
    let result = "";
    await retryAsync(
      [
        async () => Promise.resolve(result += "a"), 
        async () => Promise.resolve(result += "b"), 
        async () => Promise.resolve(result += "c")
      ],
      (test) => test === "ab"
    );
    expect(result).toBe("ab");
  });

})
