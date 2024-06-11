import { useState } from "react";
import "./App.css";
import { SingleLevel } from "./SingleLevel";
import { levels } from "./bf-runtime/levels";
import { setRuntime } from "./bf-runtime/store";

function App() {
  const [level, setLevel] = useState<number>(0);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const currentLevel = levels[level];

  const nextLevel = levels[level + 1];

  return isPlaying ? (
    <SingleLevel
      description={currentLevel.description}
      operations={currentLevel.operations}
      isCompleted={currentLevel.isExpectedStateReached}
      onComplete={() => setIsPlaying(false)}
    />
  ) : nextLevel ? (
    <div>
      Good Job!
      <button
        ref={(item) => item?.focus()}
        onClick={() => {
          setLevel(level + 1);
          setIsPlaying(true);
          setRuntime(nextLevel.initialState);
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
