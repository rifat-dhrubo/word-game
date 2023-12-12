import React from "react";

import { sample } from "../../utils";
import { WORDS } from "../../data";
import Footer from "../Footer/Footer";

// Pick a random word on every pageload.
const answer = sample(WORDS);
// To make debugging easier, we'll log the solution in the console.
console.info({ answer });

export const KEYBOARD_ROWS = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m"],
];

function Game() {
  const [answerState, setAnswerState] = React.useState(() => answer);
  function resetAnswer() {
    const answer = sample(WORDS);
    console.info({ answer });
    setAnswerState(answer);
  }
  return (
    <div className="game-wrapper">
      <Footer answer={answerState} resetAnswer={resetAnswer}></Footer>
    </div>
  );
}

export default Game;
