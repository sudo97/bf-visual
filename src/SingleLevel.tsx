import { useEffect, useState } from "react";
import { BFRuntime } from "./bf-runtime/bf";
import { Operations } from "./bf-runtime/levels";
import { performOperation, useBFStore } from "./bf-runtime/store";
import { IO } from "./IO";
import { ArrowLeft, ArrowRight } from "./Arrows";
import { Tape } from "./Tape";

const keyToOperationMap: { [key: string]: Operations | undefined } = {
  ArrowUp: "increment",
  ArrowDown: "decrement",
  ArrowLeft: "moveLeft",
  ArrowRight: "moveRight",
  w: "write",
  r: "read",
};

export function SingleLevel({
  description,
  operations,
  isCompleted,
  onComplete,
}: {
  description: string;
  operations: Operations[];
  isCompleted: (runtime: BFRuntime) => boolean;
  onComplete: () => void;
}) {
  const runtime = useBFStore();

  const [gameOn, setGameOn] = useState<boolean>(true);

  useEffect(() => {
    function keyHandler(e: KeyboardEvent) {
      if (!gameOn) return;
      const operation = keyToOperationMap[e.key];
      if (operation && operations.includes(operation)) {
        performOperation(operation);
      }
    }

    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, [operations, gameOn]);

  useEffect(() => {
    if (isCompleted(runtime)) {
      setGameOn(false);
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  }, [runtime, isCompleted, onComplete]);

  return (
    <div className="app">
      <div className="io">
        <IO array={runtime.stdin} label="STDIN" />
        <IO array={runtime.stdout} label="STDOUT" />
      </div>
      <div className="description">{description}</div>
      <div className="runtime-repr">
        <ArrowLeft />
        <Tape isSuccess={!gameOn} />
        <ArrowRight />
      </div>
    </div>
  );
}
