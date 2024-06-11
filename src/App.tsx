import { useEffect, useState } from "react";

import "./App.css";
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

//TODO: Levels must have
// 1) list of permitted operations, or a predicate to determine if it's permitted
// 2) expected state that is to achieve. it will allow to go to another level

function Tape({ runtime }: { runtime: BFRuntime }) {
  return (
    <div className="tape" key={runtime.pointer}>
      <span>
        {
          runtime.tape[
            (runtime.pointer - 1 + runtime.tape.length) % runtime.tape.length
          ]
        }
      </span>
      <span className="currentCell">{runtime.tape[runtime.pointer]}</span>
      <span>{runtime.tape[(runtime.pointer + 1) % runtime.tape.length]}</span>
    </div>
  );
}

function ArrowLeft() {
  return <div style={{ fontSize: "2rem" }}>&larr;</div>;
}

function ArrowRight() {
  return <div style={{ fontSize: "2rem" }}>&rarr;</div>;
}

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

function IO({ array }: { array: number[] }) {
  return (
    <div className="io-item">
      [
      {array.map((val, i) => (
        <div key={i}>{val}</div>
      ))}
      ]
    </div>
  );
}

export default App;
