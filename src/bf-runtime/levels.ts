import { produce } from "immer";
import { BFRuntime, initRuntime } from "./bf";
import { Token } from "./compiler";

export type Level = {
  operations: Token[];
  isExpectedStateReached: (runtime: BFRuntime) => boolean;
  description: string;
  initialState: BFRuntime;
};

export const levels: Level[] = [
  {
    operations: ["+"],
    isExpectedStateReached: (runtime) =>
      runtime.tape[runtime.pointer] === 1 && runtime.pointer === 0,
    description: "Press Arrow Up to increment the value at the current cell",
    initialState: initRuntime([]),
  },
  {
    operations: ["-"],
    isExpectedStateReached: (runtime) =>
      runtime.tape[runtime.pointer] === -1 && runtime.pointer === 0,
    description: "Press Arrow Down to decrement the value at the current cell",
    initialState: initRuntime([]),
  },
  {
    operations: [">"],
    isExpectedStateReached: (runtime) => runtime.pointer === 1,
    description: "Press Arrow Right to move to the next cell",
    initialState: produce(initRuntime([]), (r) => {
      r.tape[1] = 1;
    }),
  },
  {
    operations: ["<"],
    isExpectedStateReached: (runtime) =>
      runtime.pointer === runtime.tape.length - 1,
    description: "Press Arrow Left to move to the previous cell",
    initialState: produce(initRuntime([]), (r) => {
      r.tape[r.tape.length - 1] = 1;
    }),
  },
  {
    operations: ["<", ">", "+", "-"],
    description:
      "Try adding these two numbers together, decrement one, then increment another, until the first one is 0",
    isExpectedStateReached: (runtime) =>
      runtime.tape[0] === 0 && runtime.tape[1] === 5,
    initialState: produce(initRuntime([]), (r) => {
      r.tape[0] = 3;
      r.tape[1] = 2;
    }),
  },
  {
    operations: [".", "-"],
    description:
      "Press R to read a value from the STDIN on your left, then decrement it",
    isExpectedStateReached: (runtime) => runtime.tape[0] === 98765,
    initialState: initRuntime([98766]),
  },
  {
    operations: [",", "+"],
    description:
      "Press W to write the value to the STDOUT on your right, try to write the number 13",
    isExpectedStateReached: (runtime) => runtime.stdout[0] === 13,
    initialState: initRuntime([]),
  },
  {
    operations: [".", ",", "+", "-", "<", ">"],
    description:
      "Read two numbers from the input, add them together, and write the result",
    isExpectedStateReached: (runtime) => runtime.stdout[0] === 8,
    initialState: initRuntime([3, 5]),
  },
  {
    operations: ["+", ">", "<", "-", ".", ",", "[", "]"],
    description: `Now let's do a loop. Hit [ to start entering the loop, put your operations and then ].
      Operations within [ and ] will be executing until current box is not 0.
      If you make a mistake, you can hit escape and the loop will be dropped.
      Try to make a loop that will turn this number into 0.
      `,
    isExpectedStateReached: (runtime) => runtime.tape[0] === 0,
    initialState: produce(initRuntime([]), (r) => {
      r.tape[0] = 50;
    }),
  },
  {
    operations: ["+", ">", "<", "-", ".", ",", "[", "]"],
    isExpectedStateReached: () => false,
    description: "This is a freestyle level, do whatever you want here!",
    initialState: initRuntime([]),
  },
];
