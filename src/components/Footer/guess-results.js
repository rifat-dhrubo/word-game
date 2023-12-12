import React from "react";

export const GuessResults = ({ guessArray }) => {
  return (
    <div className="guess-results">
      {guessArray.map((guess) => (
        <p key={guess.id} className="guess">
          {guess?.value?.split("").map((letter, index) => (
            <span
              className={`cell ${
                guess?.guessDict[letter] ? guess.guessDict[letter] : ""
              }`}
              key={`${guess.id}-${guess.value}-${index}`}
            >
              {letter}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
};
