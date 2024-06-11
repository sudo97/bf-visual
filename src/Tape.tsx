import { BFRuntime } from "./bf-runtime/bf";

export function Tape({ runtime }: { runtime: BFRuntime }) {
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
