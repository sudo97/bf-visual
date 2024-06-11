import { create } from "zustand";
import * as bf from "./bf";
import { BFRuntime, initRuntime } from "./bf";

export const useBFStore = create<BFRuntime>()(() => initRuntime([]));

export const increment = () => useBFStore.setState(bf.increment);

export const decrement = () => useBFStore.setState(bf.decrement);

export const write = () => useBFStore.setState(bf.write);

export const read = () => useBFStore.setState(bf.read);

export const moveLeft = () => useBFStore.setState(bf.moveLeft);

export const moveRight = () => useBFStore.setState(bf.moveRight);

export const setRuntime = (runtime: BFRuntime) =>
  useBFStore.setState(() => runtime);
