import { Routes, Route, Link } from "react-router-dom";
import MoviesAdmin from "./components/MoviesAdmin";
import ShowingsAdmin from "./components/ShowingsAdmin";
import Home from "./components/Home";
import ErrorBoundary from "./ErrorBoundary";

const moviesList = [
  { id: 1, title: "Zootopia 2" },
  { id: 2, title: "Uwierz w Mikołaja 2" },
  { id: 3, title: "Jujutsu Kaisen: Execution" },
  { id: 4, title: "Avatar: Ogień i popiół" },
  { id: 5, title: "Dune: Part Two" },
  { id: 6, title: "Inside Out 2" },
  { id: 7, title: "Camper" },
  { id: 8, title: "Eleanor the Great" },
  { id: 9, title: "Ministranci" },
  { id: 10, title: "Oppenheimer" },
  { id: 11, title: "Barbie" },
];

export default function App() {
  return (
    <div>
      <nav style={{ padding: "12px", background: "#ffe4e1" }}>
        <Link to="/" style={{ marginRight: "12px" }}>Ana Sayfa</Link>
        <Link to="/movies" style={{ marginRight: "12px" }}>Filmler</Link>
        <Link to="/showings">Gösterimler</Link>
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
          path="/showings/:id"
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
