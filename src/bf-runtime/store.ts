import { create } from "zustand";
import * as bf from "./bf";
import { BFRuntime, initRuntime } from "./bf";
import { AST, Token, compile } from "./compiler";

export const useBFStore = create<BFRuntime>()(() => initRuntime([]));

const increment = () => useBFStore.setState(bf.increment);

const decrement = () => useBFStore.setState(bf.decrement);

const write = () => useBFStore.setState(bf.write);

const read = () => useBFStore.setState(bf.read);

const moveLeft = () => useBFStore.setState(bf.moveLeft);

const moveRight = () => useBFStore.setState(bf.moveRight);

export const performOperation = async (ast: AST) => {
  switch (ast.tag) {
    case "+":
      increment();
      break;
    case "-":
      decrement();
      break;
    case ",":
      write();
      break;
    case ".":
      read();
      break;
    case "<":
      moveLeft();
      break;
    case ">":
      moveRight();
      break;
    case "[":
      break;
    case "]":
      break;
    default:
      ast satisfies never;
      break;
  }
};

export const setRuntime = (runtime: BFRuntime) =>
  useBFStore.setState(() => runtime);

function isTrue() {
  return useBFStore.getState().tape[useBFStore.getState().pointer] === 0;
}

// TODO create mechanism to stop execution
export function* executeWithLoops(operations: Token[]) {
  const program = compile(operations);

  let i = 0;
  while (i < program.length) {
    const item = program[i];
    if (item.tag === "[") {
      if (isTrue()) {
        i = item.pos;
      }
    } else if (item.tag === "]") {
      if (!isTrue()) {
        i = item.pos;
      }
    }
    yield () => performOperation(item);
    i++;
  }
}
