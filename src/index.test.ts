import { retry } from "./";

describe("application", () => {
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
