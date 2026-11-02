import { Link } from 'react-router-dom';

function Navbar({ user, logout }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">🍌 Banana Game</div>
      <div className="navbar-links">
        <Link to="/game">Play Game</Link>
        <Link to="/leaderboard">Leaderboard</Link>
        {user ? (
          <>
            <span className="navbar-user">Welcome, {user.username}!</span>
            <button onClick={logout} className="navbar-logout">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
