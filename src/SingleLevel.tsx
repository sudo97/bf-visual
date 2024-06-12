import { useEffect, useState } from "react";
import { BFRuntime } from "./bf-runtime/bf";
import {
  executeWithLoops,
  performOperation,
  useBFStore,
} from "./bf-runtime/store";
import { IO } from "./IO";
import { ArrowLeft, ArrowRight } from "./Arrows";
import { Tape } from "./Tape";
import { Token, isBalanced } from "./bf-runtime/compiler";

const keyToOperationMap: { [key: string]: Token | undefined } = {
  ArrowUp: "+",
  ArrowDown: "-",
  ArrowLeft: "<",
  ArrowRight: ">",
  w: ",",
  r: ".",
  "[": "[",
  "]": "]",
};

export function SingleLevel({
  description,
  operations,
  isCompleted,
  onComplete,
}: {
  description: string;
  operations: Token[];
  isCompleted: (runtime: BFRuntime) => boolean;
  onComplete: () => void;
}) {
  const runtime = useBFStore();

  const [gameOn, setGameOn] = useState<boolean>(true);

  const [lastKey, setLastKey] = useState<string | undefined>();

  const [loopBuffer, setLoopBuffer] = useState<Token[]>([]);

  const [inLoop, setInLoop] = useState<boolean>(false);

  useEffect(() => {
    async function keyHandler(e: KeyboardEvent) {
      new Audio("/click2.wav").play();
      if (!gameOn) return;
      if (e.key === "Escape") {
        setLoopBuffer([]);
        setInLoop(false);
        return;
      }

      const operation = keyToOperationMap[e.key];
      if (operation && operations.includes(operation)) {
        if (inLoop) {
          if (operation === "]" && isBalanced([...loopBuffer, "]"])) {
            setInLoop(false);
            setLoopBuffer([...loopBuffer, "]"]);
            setGameOn(false);
            for (const op of executeWithLoops([...loopBuffer, "]"])) {
              op();
              new Audio("/click2.wav").play();
              await new Promise((resolve) => setTimeout(resolve, 100));
            }
            setGameOn(true);
            setLoopBuffer([]);
            setLastKey(undefined);
          } else {
            setLoopBuffer([...loopBuffer, operation]);
          }
        } else {
          if (operation === "[") {
            setInLoop(true);
            setLoopBuffer(["["]);
          } else if (operation !== "]") {
            setLastKey(operation);
            performOperation({ tag: operation });
          }
        }
      }
    }

    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, [operations, gameOn, inLoop, loopBuffer]);

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
        <Tape isSuccess={isCompleted(runtime)} />
        <ArrowRight />
      </div>
      <div className="loop-buffer">
        {loopBuffer.length ? loopBuffer.join(" ") : lastKey}
      </div>
    </div>
  );
}
