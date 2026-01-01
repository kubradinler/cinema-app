import { Routes, Route, Link } from "react-router-dom";
import MoviesAdmin from "./components/MoviesAdmin";
import ShowingsAdmin from "./components/ShowingsAdmin";
import Home from "./components/Home";
import ErrorBoundary from "./ErrorBoundary";

const moviesList = [
  { id: 1, title: "Zootopia 2", duration: 120 },
  { id: 2, title: "Uwierz w Mikołaja 2", duration: 110 },
  { id: 3, title: "Jujutsu Kaisen: Execution", duration: 130 },
  { id: 4, title: "Avatar: Ogień i popiół", duration: 150 },
  { id: 5, title: "Dune: Part Two", duration: 140 },
  { id: 6, title: "Inside Out 2", duration: 115 },
  { id: 7, title: "Camper", duration: 105 },
  { id: 8, title: "Eleanor the Great", duration: 125 },
  { id: 9, title: "Ministranci", duration: 100 },
  { id: 10, title: "Oppenheimer", duration: 180 },
  { id: 11, title: "Barbie", duration: 118 },
];

function App() {
  return (
    <div>
      <nav style={{ padding: "12px", background: "#ffe4e1", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
        <Link to="/" style={{ marginRight: "20px", textDecoration: "none", color: "#d63384", fontWeight: "bold" }}>
          🏠 Home
        </Link>
        <Link to="/movies" style={{ marginRight: "20px", textDecoration: "none", color: "#d63384", fontWeight: "bold" }}>
          🎬 Movies
        </Link>
        <Link to="/showings" style={{ textDecoration: "none", color: "#d63384", fontWeight: "bold" }}>
          🎫 Showings
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<MoviesAdmin />} />
        <Route
          path="/showings"
          element={
            <ErrorBoundary>
              <ShowingsAdmin movies={moviesList} />
            </ErrorBoundary>
          }
        />
        <Route
          path="/showings/:movieTitle"
          element={
            <ErrorBoundary>
              <ShowingsAdmin movies={moviesList} />
            </ErrorBoundary>
          }
        />
      </Routes>
    </div>
  );
}

export default App;