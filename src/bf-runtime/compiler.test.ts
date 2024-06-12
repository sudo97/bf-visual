import { describe, it, expect } from "vitest";
import { compile, isBalanced } from "./compiler";

describe("compiler", () => {
  it("should compile a simple program", () => {
    expect(compile([])).toEqual([]);
  });
  it("should handle simple operations", () => {
    expect(compile(["+", "-", ">", "<", ".", ","])).toEqual([
      { tag: "+" },
      { tag: "-" },
      { tag: ">" },
      { tag: "<" },
      { tag: "." },
      { tag: "," },
    ]);
  });
  it("should handle loops", () => {
    expect(compile(["[", "+", "]", "+"])).toEqual([
      { tag: "[", pos: 2 },
      { tag: "+" },
      { tag: "]", pos: 0 },
      { tag: "+" },
    ]);
  });

  it("should handle nested loops", () => {
    expect(compile(["[", "[", "+", "]", "]", "+"])).toEqual([
      { tag: "[", pos: 4 },
      { tag: "[", pos: 3 },
      { tag: "+" },
      { tag: "]", pos: 1 },
      { tag: "]", pos: 0 },
      { tag: "+" },
    ]);
  });
});

describe("isBalanced", () => {
  it("should handle simple programs", () => {
    expect(isBalanced([])).toBe(true);
  });
  it("should handle nested loops", () => {
    expect(isBalanced(["[", "[", "+", "]", "]", "+"])).toBe(true);
  });
  it("should handle unbalanced loops", () => {
    expect(isBalanced(["[", "+", "+"])).toBe(false);
  });
  it("should handle unbalanced loops", () => {
    expect(isBalanced(["+", "]", "+"])).toBe(false);
  });
});
