import { produce } from "immer";

export type BFRuntime = {
  stdin: Array<number>;
  stdout: Array<number>;
  tape: Array<number>;
  pointer: number;
};

export const initRuntime = (
  stdin: Array<number>,
  tapeSize: number = 30000
): BFRuntime => ({
  stdin,
  stdout: [],
  tape: Array(tapeSize).fill(0),
  pointer: 0,
});

export const moveLeft = produce((draft: BFRuntime) => {
  if (draft.pointer === 0) {
    draft.pointer = draft.tape.length - 1;
  } else {
    draft.pointer -= 1;
  }
});

export const moveRight = produce((draft: BFRuntime) => {
  if (draft.pointer === draft.tape.length - 1) {
    draft.pointer = 0;
  } else {
    draft.pointer += 1;
  }
});

export const increment = produce((draft: BFRuntime) => {
  draft.tape[draft.pointer] += 1;
});

export const decrement = produce((draft: BFRuntime) => {
  draft.tape[draft.pointer] -= 1;
});

export const read = produce((draft: BFRuntime) => {
  const data = draft.stdin.shift();
  if (data !== undefined) {
    draft.tape[draft.pointer] = data;
  } else {
    throw new Error("No data to read");
  }
});

export const write = produce((draft: BFRuntime) => {
  draft.stdout.push(draft.tape[draft.pointer]);
});
