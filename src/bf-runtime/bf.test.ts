import { describe, it, expect } from "vitest";
import {
  BFRuntime,
  decrement,
  increment,
  initRuntime,
  moveLeft,
  moveRight,
  read,
  write,
} from "./bf";

describe("init", () => {
  it("initializes the runtime", () => {
    const runtime = initRuntime([]);

    expect(runtime.tape.length).toBe(30000);
  });

  it("initializes the tape", () => {
    const runtime = initRuntime([], 10);

    expect(runtime.tape.length).toBe(10);
  });

  it("initializes the pointer", () => {
    const runtime = initRuntime([]);

    expect(runtime.pointer).toBe(0);
  });

  it("initializes stdin", () => {
    const runtime = initRuntime([1, 2, 3]);

    expect(runtime.stdin).toEqual([1, 2, 3]);
  });
});

describe("move left", () => {
  it("moves the pointer left", () => {
    const runtime: BFRuntime = {
      stdin: [],
      stdout: [],
      tape: [0, 0, 0],
      pointer: 1,
    };

    const result = moveLeft(runtime);

    expect(result.pointer).toBe(0);
  });

  it("it does not underflow", () => {
    const runtime: BFRuntime = {
      stdin: [],
      stdout: [],
      tape: [0, 0, 0],
      pointer: 0,
    };

    const result = moveLeft(runtime);

    expect(result.pointer).toBe(2);
  });
});

describe("move right", () => {
  it("moves the pointer right", () => {
    const runtime: BFRuntime = {
      stdin: [],
      stdout: [],
      tape: [0, 0, 0],
      pointer: 1,
    };

    const result = moveRight(runtime);

    expect(result.pointer).toBe(2);
  });

  it("it does not overflow", () => {
    const runtime: BFRuntime = {
      stdin: [],
      stdout: [],
      tape: [0, 0, 0],
      pointer: 2,
    };

    const result = moveRight(runtime);

    expect(result.pointer).toBe(0);
  });
});

describe("increment", () => {
  it("increments the value at the pointer", () => {
    const runtime: BFRuntime = {
      stdin: [],
      stdout: [],
      tape: [0, 0, 0],
      pointer: 0,
    };

    const result = increment(runtime);

    expect(result.tape[0]).toBe(1);
  });
});

describe("decrement", () => {
  it("decrements the value at the pointer", () => {
    const runtime: BFRuntime = {
      stdin: [],
      stdout: [],
      tape: [0, 0, 0],
      pointer: 0,
    };

    const result = decrement(runtime);

    expect(result.tape[0]).toBe(-1);
  });
});

describe("read", () => {
  it("reads from stdin", () => {
    const runtime: BFRuntime = {
      stdin: [1],
      stdout: [],
      tape: [0],
      pointer: 0,
    };

    const result = read(runtime);

    expect(result.tape[0]).toBe(1);
    expect(result.stdin).toEqual([]);
  });

  it("throws an error if stdin is empty", () => {
    const runtime: BFRuntime = {
      stdin: [],
      stdout: [],
      tape: [0],
      pointer: 0,
    };

    expect(() => read(runtime)).toThrow("No data to read");
  });
});

describe("write", () => {
  it("writes to stdout", () => {
    const runtime: BFRuntime = {
      stdin: [],
      stdout: [],
      tape: [1],
      pointer: 0,
    };

    const result = write(runtime);

    expect(result.stdout).toEqual([1]);
  });
});
