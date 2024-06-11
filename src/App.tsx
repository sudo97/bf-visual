import "./App.css";
import { useEffect, useState } from "react";
import {
  BFRuntime,
  decrement,
  increment,
  initRuntime,
  moveLeft,
  moveRight,
  read,
  write,
} from "./bf-runtime/bf";
import { IO } from "./IO";
import { Tape } from "./Tape";
import { ArrowLeft, ArrowRight } from "./Arrows";

//TODO: Levels must have
// 1) list of permitted operations, or a predicate to determine if it's permitted
// 2) expected state that is to achieve. it will allow to go to another level

function App() {
  const [runtime, setRuntime] = useState<BFRuntime>(() =>
    initRuntime([1, 2, 3])
  );

  useEffect(() => {
    function keyHandler(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") {
        setRuntime(moveLeft);
      } else if (e.key === "ArrowRight") {
        setRuntime(moveRight);
      } else if (e.key === "ArrowUp") {
        setRuntime(increment);
      } else if (e.key === "ArrowDown") {
        setRuntime(decrement);
      } else if (e.key === "r") {
        setRuntime(read);
      } else if (e.key === "w") {
        setRuntime(write);
      }
    }

    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, []);
  return (
    <div className="app">
      <div className="io">
        <IO array={runtime.stdin} />
        <IO array={runtime.stdout} />
      </div>
      <div className="runtime-repr">
        <ArrowLeft />
        <Tape runtime={runtime} />
        <ArrowRight />
      </div>
    </div>
  );
}

export default App;
