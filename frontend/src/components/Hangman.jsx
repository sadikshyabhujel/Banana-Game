const MAX_WRONG = 6;

// 7 stages: index 0 (no wrong guesses) up to 6 (fully hanged)
const stages = [
  `
      
      
      
      
      
=========
`,
  `
  +---+
  |   |
  O   |
      |
      |
      |
=========
`,
  `
  +---+
  |   |
  O   |
  |   |
      |
      |
=========
`,
  `
  +---+
  |   |
  O   |
 /|   |
      |
      |
=========
`,
  `
  +---+
  |   |
  O   |
 /|\\  |
      |
      |
=========
`,
  `
  +---+
  |   |
  O   |
 /|\\  |
 /    |
      |
=========
`,
  `
  +---+
  |   |
  O   |
 /|\\  |
 / \\  |
      |
=========
`
];

function Hangman({ wrongGuesses }) {
  const currentStage = Math.min(Math.max(wrongGuesses, 0), MAX_WRONG);
  const isDead = currentStage >= MAX_WRONG;

  return (
    <div className={`hangman-container${isDead ? ' hangman-dead' : ''}`}>
      <div className="hangman-drawing">{stages[currentStage]}</div>
      <div className="hangman-status">
        Wrong guesses: {currentStage} / {MAX_WRONG}
        {isDead && ' - Game over!'}
      </div>
    </div>
  );
}

export default Hangman;
