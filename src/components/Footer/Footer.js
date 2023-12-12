import React from "react";
import { GuessResults } from "./guess-results";
import { NUM_OF_GUESSES_ALLOWED } from "../../constants";
import { checkGuess } from "../../game-helpers";
import { KEYBOARD_ROWS } from "../Game/Game";

function createGuess(value = "     ", guessDict = {}) {
  const id = crypto.randomUUID();
  return {
    id,
    value,
    guessDict,
  };
}

function creatingInitialGuess() {
  const val = new Array(NUM_OF_GUESSES_ALLOWED).fill({});

  return val.map((item) => {
    return createGuess();
  });
}

function Footer({ answer, resetAnswer }) {
  const [inputValue, setInputValue] = React.useState("");
  const [guessArray, setGuessArray] = React.useState(() =>
    creatingInitialGuess()
  );
  const [guess, setGuess] = React.useState();
  const [isCorrectAnswer, setIsCorrectAnswer] = React.useState(false);

  function handleInputChange(e) {
    setInputValue(String(e.target.value).toUpperCase());
  }

  function reset() {
    setInputValue("");
  }

  const addGuess = React.useCallback(
    (value) => {
      const guessResult = checkGuess(value, answer);
      setGuess(guessResult);
      const isCorrect = guessResult.every((item) => item.status === "correct");
      setIsCorrectAnswer(isCorrect);
      let guessDict = {};
      guessResult.forEach((item) => {
        guessDict = { ...guessDict, [item.letter]: item.status };
      });
      const guess = {
        id: crypto.randomUUID(),
        value,
        guessDict,
      };

      setGuessArray((prev) => {
        const newValue = prev.filter((item) => item.value.trim() !== "");
        const length = newValue.length;
        if (length === NUM_OF_GUESSES_ALLOWED) {
          window.alert("You have reached the maximum number of guesses");
          return prev;
        }
        newValue[length] = guess;
        for (let index = length + 1; index < NUM_OF_GUESSES_ALLOWED; index++) {
          newValue[index] = createGuess();
        }

        return newValue;
      });
    },
    [answer]
  );

  const handleFormSubmit = React.useCallback(
    (e) => {
      e?.preventDefault();
      const inputLength = inputValue.length;
      if (inputLength !== 5) {
        window.alert("Input must be 5 characters long");
        return;
      }
      addGuess(inputValue);
      reset();
    },
    [addGuess, inputValue]
  );

  const givenAnswers = React.useMemo(
    () => guessArray.filter((item) => item.value.trim() !== "").length,
    [guessArray]
  );

  function handleReset() {
    resetAnswer();
    setGuessArray(creatingInitialGuess());
    setIsCorrectAnswer(false);
    setGuess(null);
  }

  // React.useEffect(
  //   function keyboardInput() {
  //     if (document.activeElement.id === 'guess-input') return;

  //     function handleKeyPress(event) {
  //       if (document.activeElement.id === 'guess-input') return;
  //       // check if the key pressed is a letter
  //       if (/^[a-zA-Z]$/.test(event.key)) {
  //         setInputValue((prev) => prev + event.key.toUpperCase());
  //       }

  //       // check if the key pressed is backspace
  //       if (event.key === "Backspace") {
  //         setInputValue((prev) => prev.slice(0, -1));
  //       }

  //       // check if the key pressed is enter
  //       if (event.key === "Enter") {
  //         handleFormSubmit();
  //       }
  //     }
  //     document.addEventListener("keydown", handleKeyPress);

  //     return () => {
  //       document.removeEventListener("keydow", handleKeyPress);
  //     };
  //   },
  //   [handleFormSubmit]
  // );

  const guessDict = React.useMemo(() => {
    let result = {};
    if(guess == null) return {};
    guess.forEach((item) => {
      result = { ...result, [item.letter]: item.status };
    });
    return result;
  }, [guess]);
  console.log("🚀 ~ file: Footer.js:138 ~ guessDict ~ guessDict:", guessDict)

  return (
    <div>
      {isCorrectAnswer ? (
        <div>
          <div className="happy banner">
            <p>
              <strong>Congratulations!</strong> Got it in
              <strong> {givenAnswers} guesses</strong>.
            </p>
          </div>
          <button type="button" className="btn" onClick={handleReset}>
            Restart
          </button>
        </div>
      ) : null}
      {givenAnswers === NUM_OF_GUESSES_ALLOWED && !isCorrectAnswer ? (
        <div className="sad banner">
          <p>
            Sorry, the correct answer is <strong>{answer}</strong>.
          </p>
        </div>
      ) : null}
      <GuessResults guessArray={guessArray} />
      <form className="guess-input-wrapper" onSubmit={handleFormSubmit}>
        <label htmlFor="guess-input">Enter Guess</label>
        <input
          type="text"
          id="guess-input"
          className="guess-input"
          value={inputValue}
          onChange={handleInputChange}
        />
      </form>
      <div className="keyboard-wrapper">
        {KEYBOARD_ROWS.map((row, index) => {
          return (
            <div key={index} className="keyboard-row">
              {row.map((letter) => {
                return (
                  <button
                    type="button"
                    key={letter}
                    className={`keyboard-key cell ${
                      guessDict && guessDict[letter.toUpperCase()]
                        ? guessDict[letter.toUpperCase()]
                        : ""
                    }`}
                    data-val={letter}
                    onClick={(e) => {
                      setInputValue(
                        (prev) => prev + e.target.dataset.val.toUpperCase()
                      );
                    }}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Footer;
