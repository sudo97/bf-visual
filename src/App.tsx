import { useState } from "react";
import "./App.css";
import { SingleLevel } from "./SingleLevel";
import { levels } from "./bf-runtime/levels";
import { setRuntime } from "./bf-runtime/store";

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
