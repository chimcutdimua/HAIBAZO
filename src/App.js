import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

function App() {
  const [numbers, setNumbers] = useState([]);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [timer, setTimer] = useState(0);
  const [inputNumber, setInputNumber] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameStatus, setGameStatus] = useState("PLAYING");

  const startNewGame = useCallback(() => {
    const newNumbers = Array.from({ length: inputNumber }, (_, i) => ({
      value: i + 1,
      visible: true,
      clicked: false,
      top: `${Math.random() * 80}%`,
      left: `${Math.random() * 80}%`,
    }));
    setNumbers(shuffleArray(newNumbers));
    setCurrentNumber(1);
    setGameOver(false);
    setTimer(0);
    setGameStarted(true);
    setGameStatus("PLAYING");
  }, [inputNumber]);

  useEffect(() => {
    let interval;
    if (gameStarted && !gameOver) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 0.1);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameOver]);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    console.log("Numbers updated:", numbers);
  }, [numbers]);

  const handleNumberClick = (number) => {
    if (gameOver) return;
    console.log(`Clicked number: ${number.value}`);
    if (number.value === currentNumber) {
      setNumbers((prevNumbers) =>
        prevNumbers.map((n) => {
          if (n.value === number.value) {
            console.log(
              `Updating number ${n.value} from ${n.clicked} to clicked`
            );
            return { ...n, clicked: true };
          }
          return n;
        })
      );

      setTimeout(() => {
        setNumbers((prevNumbers) =>
          prevNumbers.map((n) =>
            n.value === number.value ? { ...n, visible: false } : n
          )
        );
      }, 500); // Delay to allow transition effect

      setCurrentNumber((prev) => prev + 1);

      if (currentNumber === inputNumber) {
        setGameOver(true);
        setGameStarted(false);
        setGameStatus("ALL CLEARED");
      }
    } else {
      setGameOver(true);
      setGameStarted(false);
      setGameStatus("GAME OVER");
    }
  };

  const handleInputChange = (e) => {
    setInputNumber(Number(e.target.value));
  };

  return (
    <div className="App">
      <div className="game-title d-flex gap-3 flex-column">
        <h1
          style={{
            color:
              gameStatus === "ALL CLEARED"
                ? "green"
                : gameStatus === "GAME OVER"
                ? "red"
                : "black",
          }}
        >
          {gameStatus === "PLAYING" ? "LET'S PLAY" : gameStatus}
        </h1>
        <div className="point align-items-baseline">
          <p style={{ marginRight: "15px" }}>Points:</p>
          <input
            className="input-number"
            type="number"
            value={inputNumber}
            onChange={handleInputChange}
            min="1"
          />
        </div>

        <div
          className="align-items-baseline"
          style={{ display: "flex", alignItems: "center" }}
        >
          <p style={{ marginRight: "20px" }}>Time: </p>
          <span>{timer.toFixed(1)}s</span>
        </div>
        <div>
          <button onClick={startNewGame} className="restart-btn">
            {gameStarted ? "Restart" : "Play"}
          </button>
        </div>
      </div>
      <div className="game-board">
        {numbers.map((number) => (
          <button
            key={number.value}
            onClick={() => handleNumberClick(number)}
            className={`number-button ${number.visible ? "" : "hidden"} ${
              number.clicked ? "clicked" : ""
            }`}
            style={{ top: number.top, left: number.left }}
            disabled={!number.visible || gameOver}
          >
            {number.value}
          </button>
        ))}
      </div>
      {gameOver && <p>Game Over!</p>}
    </div>
  );
}

export default App;
