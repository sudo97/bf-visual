import "./App.css";
import { useEffect, useState } from "react";
import { IO } from "./IO";
import { Tape } from "./Tape";
import { ArrowLeft, ArrowRight } from "./Arrows";
import {
  moveLeft,
  useBFStore,
  decrement,
  increment,
  read,
  write,
  moveRight,
  setRuntime,
} from "./bf-runtime/store";
import { levels, Operations } from "./bf-runtime/levels";
import { BFRuntime } from "./bf-runtime/bf";

function SingleLevel({
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
      if (e.key === "ArrowLeft" && operations.includes("moveLeft")) {
        moveLeft();
      } else if (e.key === "ArrowRight" && operations.includes("moveRight")) {
        moveRight();
      } else if (e.key === "ArrowUp" && operations.includes("increment")) {
        increment();
      } else if (e.key === "ArrowDown" && operations.includes("decrement")) {
        decrement();
      } else if (e.key === "r" && operations.includes("read")) {
        read();
      } else if (e.key === "w" && operations.includes("write")) {
        write();
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

function App() {
  const [level, setLevel] = useState<number>(0);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const currentLevel = levels[level];

  return isPlaying ? (
    <SingleLevel
      description={currentLevel.description}
      operations={currentLevel.operations}
      isCompleted={currentLevel.isExpectedStateReached}
      onComplete={() => setIsPlaying(false)}
    />
  ) : levels[level + 1] ? (
    <div>
      Good Job!
      <button
        onClick={() => {
          setLevel(level + 1);
          setIsPlaying(true);
          setRuntime(levels[level + 1].initialState);
        }}
      >
        Let's do it again
      </button>
    </div>
  ) : (
    <div>You're all done!</div>
  );
}

export default App;
