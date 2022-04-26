import { retry } from "./";

describe("retry sync", () => {
  it("should retry failed funcs", async () => {
    let result = "";
    await retry([() => (result += "a")], (test) => test === "aaa", 4);
    expect(result).toBe("aaa");
  });
  it("should call all funcs", async () => {
    let result = "";
    await retry([
      () => (result += "a"),
      () => (result += "b"),
      () => (result += "c"),
    ]);
    expect(result).toBe("abc");
  });

  it("should call all funcs until success", async () => {
    let result = "";
    await retry(
      [() => (result += "a"), () => (result += "b"), () => (result += "c")],
      (test) => test === "ab"
    );
    expect(result).toBe("ab");
  });
});

describe("retry", () => {
  it("should retry failed funcs", async () => {
    let result = "";
    const someFunc = async (val: string): Promise<string> =>
      Promise.resolve((result += val));

    await retry([async () => await someFunc("a")], (test) => test === "aaa", 4);
    expect(result).toBe("aaa");
  });

  it("should retry multiple failed funcs until success", async () => {
    let result = "";
    const someFunc = async (val: string): Promise<string> =>
      Promise.resolve((result += val));
    const otherFunc = async (): Promise<string> =>
      Promise.resolve((result += "b"));

    await retry(
      [async () => await someFunc("a"), async () => await otherFunc()],
      (test) => test === "aaaabb",
      4
    );
    expect(result).toBe("aaaabb");
  });

  it("should call all funcs", async () => {
    let result = "";
    await retry([
      async () => Promise.resolve((result += "a")),
      async () => Promise.resolve((result += "b")),
      async () => Promise.resolve((result += "c")),
    ]);
    expect(result).toBe("abc");
  });

  it("should call all funcs until success", async () => {
    let result = "";
    await retry(
      [
        async () => Promise.resolve((result += "a")),
        async () => Promise.resolve((result += "b")),
        async () => Promise.resolve((result += "c")),
      ],
      (test) => test === "ab"
    );
    expect(result).toBe("ab");
  });
});

describe("backoff", () => {
  it("should delay when constant is set", async () => {
    let calls = 0;
    const someFunc = async (): Promise<number> => Promise.resolve(++calls);

    const start = Date.now();
    await retry(
      [async () => await someFunc()],
      () => false, // all tries will call
      3, // try this many calls
      { constant: 20 }
    ); // constant delay after first try
    const length = Date.now() - start;
    expect(calls).toBe(3);

    /**      
      Call  Delay TotalMs
      0:    0     0
      1:    20    20
      2:    20    40
    */
    expect(length).toBeGreaterThanOrEqual(40);
  });

  it("should delay when linear is set", async () => {
    const start = Date.now();
    let calls = 0;
    const durations: number[] = [];
    const someFunc = async (): Promise<number> => {
      durations.push(Date.now() - start);
      return Promise.resolve(++calls);
    };

    await retry(
      [async () => await someFunc()],
      () => false, // all tries will call
      3, // try this many calls
      { linear: 20 }
    ); // linear delay after first try
    expect(calls).toBe(3);

    /**      
      Call  Delay TotalMs
      0:    0     0
      1:    20    20
      2:    40    60
    */
    expect(durations[1]).toBeGreaterThanOrEqual(20);
    expect(durations[2]).toBeGreaterThanOrEqual(60);
  });

  it("should delay when combined backoff is set", async () => {
    const start = Date.now();
    let calls = 0;
    const durations: number[] = [];
    const someFunc = async (): Promise<number> => {
      durations.push(Date.now() - start);
      return Promise.resolve(++calls);
    };

    await retry(
      [async () => await someFunc()],
      () => false, // all tries will call
      3, // try this many calls
      {
        constant: 10, // constant delay after first try
        linear: 20, // linear delay after first try
      }
    );
    expect(calls).toBe(3);

    /**      
      Call  Constant  Linear  Delay TotalMs
      0:    0         0       0     0
      1:    10        20      30    30
      2:    10        40      50    80
    */
    expect(durations[1]).toBeGreaterThanOrEqual(30);
    expect(durations[2]).toBeGreaterThanOrEqual(80);
  });
});
