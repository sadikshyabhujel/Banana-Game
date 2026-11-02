# Banana Game - College Project

A simple web-based game where users guess the number of bananas in images. Features include user registration/login, hangman-style wrong guess limits, score tracking, and a leaderboard.

## Tech Stack
- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Database:** MySQL
- **API:** https://marcconrad.com/uob/banana/api.php

## Features
- User registration and login with JWT authentication
- Play game tab - displays banana count questions as images
- Submit answers to guess the number of bananas
- Hangman feature - 6 wrong guesses limit before game over
- 15-second timer per question - running out counts as a wrong guess and loads a new question
- Right/wrong answer feedback messages
- Scoreboard/Leaderboard
- Score tracking per user

## Setup Instructions

### Prerequisites
- Node.js installed
- MySQL installed and running

### Database Setup
1. Make sure your MySQL server is running
2. Run the SQL script from `backend/db/init.sql` to create the database and tables

```bash
mysql -u root -p -f backend/db/init.sql
```

### Backend Setup
1. Navigate to backend folder
```bash
cd backend
npm install
```

2. Update `.env` file with your database credentials
3. Start the server
```bash
npm run dev
```

Server runs on http://localhost:5001

### Frontend Setup
1. Navigate to frontend folder
```bash
cd frontend
npm install
```

2. Start the development server
```bash
npm run dev
```

Frontend runs on http://localhost:5173

### Quick Start (All at once)
From root directory:
```bash
npm run install:all
npm run dev
```

## How to Play
1. Register/Login to your account
2. Go to "Play Game" tab
3. Look at the image and count the bananas
4. Enter your answer and submit
5. Correct answers increase your score and load a new question
6. Wrong answers add to the hangman (6 wrong guesses = game over)
7. After game over, your score is saved to the leaderboard

## API
The game fetches questions from: https://marcconrad.com/uob/banana/api.php
Returns JSON with `question` (PNG image URL) and `solution` (number of bananas)
# Banana-Game
