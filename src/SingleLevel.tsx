import { useEffect, useState } from "react";
import { BFRuntime } from "./bf-runtime/bf";
import { performOperation, useBFStore } from "./bf-runtime/store";
import { IO } from "./IO";
import { ArrowLeft, ArrowRight } from "./Arrows";
import { Tape } from "./Tape";
import { AST, Token, compile, isBalanced } from "./bf-runtime/compiler";

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

function* executeWithLoops(operations: Token[]) {
  const program = compile(operations);

  let i = 0;
  while (i < program.length) {
    const item = program[i];
    if (item.tag === "[") {
      if (useBFStore.getState().tape[useBFStore.getState().pointer] === 0) {
        i = item.pos;
      }
    } else if (item.tag === "]") {
      if (useBFStore.getState().tape[useBFStore.getState().pointer] !== 0) {
        i = item.pos;
      }
    }
    yield () => performOperation(item);
    i++;
  }
}

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
        if (operation === "[") {
          setInLoop(true);
          setLoopBuffer(["["]);
        } else if (operation === "]" && isBalanced([...loopBuffer, "]"])) {
          setInLoop(false);
          setLoopBuffer([...loopBuffer, "]"]);
          for (const op of executeWithLoops([...loopBuffer, "]"])) {
            op();
            new Audio("/click2.wav").play();
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
          setLoopBuffer([]);
        } else {
          if (inLoop) {
            setLoopBuffer([...loopBuffer, operation]);
          } else {
            performOperation({ tag: operation } as AST);
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
        <Tape isSuccess={!gameOn} />
        <ArrowRight />
      </div>
      {loopBuffer.length > 0 && (
        <div className="loop-buffer">{loopBuffer.join(" ")}</div>
      )}
    </div>
  );
}
