import { create } from "zustand";
import * as bf from "./bf";
import { BFRuntime, initRuntime } from "./bf";
import { AST } from "./compiler";

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

// const sleep = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

export const setRuntime = (runtime: BFRuntime) =>
  useBFStore.setState(() => runtime);

// TODO: Use me within the store for single items, also for accumulated loop, or its balanced part
