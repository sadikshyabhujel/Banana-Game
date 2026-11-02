import { useState, useEffect, useRef, useCallback } from 'react';
import Hangman from './Hangman';

const MAX_WRONG = 6;
const TIME_LIMIT = 25;

function Game({ token, user }) {
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);

  // Refs keep timer/event callbacks working with the latest values
  const wrongGuessesRef = useRef(0);
  const scoreRef = useRef(0);
  const timeUpRef = useRef(() => {});

  const fetchQuestion = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5001/api/game/question', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setQuestion(data);
      } else {
        setError('Failed to fetch question');
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]);

  const saveScore = useCallback(async (finalScore) => {
    try {
      await fetch('http://localhost:5001/api/game/score', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ score: finalScore })
      });
    } catch (error) {
      console.error('Failed to save score', error);
    }
  }, [token]);

  // Adds one wrong guess. Returns true when the game is over.
  const addWrongGuess = useCallback((message) => {
    if (wrongGuessesRef.current >= MAX_WRONG) {
      return true;
    }

    const nextWrong = wrongGuessesRef.current + 1;
    wrongGuessesRef.current = nextWrong;
    setWrongGuesses(nextWrong);
    setFeedback({ type: 'wrong', text: message });
    setAnswer('');

    if (nextWrong >= MAX_WRONG) {
      setGameOver(true);
      saveScore(scoreRef.current);
      return true;
    }

    return false;
  }, [saveScore]);

  const handleTimeUp = useCallback(() => {
    setTimeLeft(TIME_LIMIT);
    const lost = addWrongGuess(`Time's up! The answer was ${question?.solution}.`);
    if (!lost) {
      fetchQuestion();
    }
  }, [addWrongGuess, fetchQuestion, question]);

  useEffect(() => {
    timeUpRef.current = handleTimeUp;
  }, [handleTimeUp]);

  // Start a fresh 15 second countdown for every question
  useEffect(() => {
    if (!question || gameOver || loading) {
      return undefined;
    }

    setTimeLeft(TIME_LIMIT);

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [question, gameOver, loading]);

  // When the countdown reaches zero: hang the man and load a new question
  useEffect(() => {
    if (timeLeft === 0 && question && !gameOver && !loading) {
      timeUpRef.current();
    }
  }, [timeLeft, question, gameOver, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question || loading || timeLeft === 0) {
      return;
    }

    const trimmed = answer.trim();
    if (!trimmed) {
      return;
    }

    const userAnswer = Number(trimmed);
    if (!Number.isInteger(userAnswer)) {
      setFeedback({ type: 'wrong', text: 'Please enter a whole number.' });
      return;
    }

    if (userAnswer === Number(question.solution)) {
      const newScore = scoreRef.current + 1;
      scoreRef.current = newScore;
      setScore(newScore);
      setFeedback({ type: 'correct', text: `Correct! The answer was ${question.solution}.` });
      setAnswer('');
      fetchQuestion();
    } else {
      const lost = addWrongGuess(`Wrong! The answer was ${question.solution}.`);
      if (!lost) {
        fetchQuestion();
      }
    }
  };

  const restartGame = () => {
    wrongGuessesRef.current = 0;
    scoreRef.current = 0;
    setScore(0);
    setWrongGuesses(0);
    setGameOver(false);
    setAnswer('');
    setFeedback(null);
    setTimeLeft(TIME_LIMIT);
    fetchQuestion();
  };

  if (loading && !question) {
    return <div className="loading">Loading...</div>;
  }

  if (gameOver) {
    return (
      <div className="game-container">
        <div className="game-card">
          <div className="game-over">
            <h2>Game Over!</h2>
            <p>Your final score: {score}</p>
            <button onClick={restartGame} className="game-over-button">Play Again</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="game-card">
        <div className="game-header">
          <h2>Banana Game</h2>
          <p>Count the bananas!</p>
        </div>
        
        <div className="game-stats">
          <span>Score: {score}</span>
          {user && <span>Player: {user.username}</span>}
          <span className={`timer${timeLeft <= 5 ? ' timer-low' : ''}`}>
            Time: {timeLeft}s
          </span>
        </div>
        
        <Hangman wrongGuesses={wrongGuesses} />

        {feedback && (
          <div className={`feedback-message ${feedback.type}`} role="status">
            {feedback.text}
          </div>
        )}
        
        {error && <div className="error-message">{error}</div>}
        
        {question && (
          <div className="question-container">
            <img 
              src={question.question} 
              alt="Count the bananas" 
              className="question-image"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
              }}
            />
            <form onSubmit={handleSubmit} className="answer-form">
              <input
                type="number"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter number of bananas"
                className="answer-input"
                disabled={loading || timeLeft === 0}
                required
              />
              <button
                type="submit"
                className="answer-button"
                disabled={loading || timeLeft === 0}
              >
                Submit Answer
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Game;
