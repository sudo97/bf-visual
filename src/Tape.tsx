import { useBFStore } from "./bf-runtime/store";
import clsx from "clsx";

export function Tape({ isSuccess }: { isSuccess: boolean }) {
  const { tape, pointer } = useBFStore();
  return (
    <div className={clsx("tape", isSuccess && "success")} key={pointer}>
      <span>{tape[(pointer - 1 + tape.length) % tape.length]}</span>
      <span className="currentCell">{tape[pointer]}</span>
      <span>{tape[(pointer + 1) % tape.length]}</span>
    </div>
  );
}
