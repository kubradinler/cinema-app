import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { posters } from "../assets/posters/posters";
import "./MoviesAdmin.css";

const initialMovies = [
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

export default function MoviesAdmin() {
  const [movies, setMovies] = useState(initialMovies);
  const [newTitle, setNewTitle] = useState("");
  const [newDuration, setNewDuration] = useState("");
  
  // EDIT STATES ADDED
  const [editingMovie, setEditingMovie] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDuration, setEditDuration] = useState("");
  
  const navigate = useNavigate();

  const handleDelete = (id) => {
    setMovies(movies.filter((movie) => movie.id !== id));
  };

  const handleAdd = () => {
    if (!newTitle || !newDuration) {
      alert("Please enter movie title and duration!");
      return;
    }
    const newMovie = {
      id: Date.now(),
      title: newTitle,
      duration: Number(newDuration),
    };
    setMovies([...movies, newMovie]);
    setNewTitle("");
    setNewDuration("");
  };

  // EDIT FUNCTIONS ADDED
  const handleEdit = (movie) => {
    setEditingMovie(movie);
    setEditTitle(movie.title);
    setEditDuration(movie.duration);
  };

  const handleSaveEdit = () => {
    if (!editTitle || !editDuration) {
      alert("Please enter movie title and duration!");
      return;
    }
    
    setMovies(movies.map(m => 
      m.id === editingMovie.id 
        ? { ...m, title: editTitle, duration: Number(editDuration) }
        : m
    ));
    
    setEditingMovie(null);
    setEditTitle("");
    setEditDuration("");
  };

  const handleCancelEdit = () => {
    setEditingMovie(null);
    setEditTitle("");
    setEditDuration("");
  };

  const handlePosterClick = (movieTitle) => {
    navigate(`/showings/${encodeURIComponent(movieTitle)}`);
  };

  return (
    <div className="movies-page">
      <h1>🎞️ Movie Management</h1>
      
      <div className="page-description">
        <p>✨ Click on a movie poster to view its showings and buy tickets!</p>
      </div>

      <div className="add-movie-form">
        <h3>➕ Add New Movie</h3>
        <div className="form-inputs">
          <input
            type="text"
            placeholder="Movie Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Duration (minutes)"
            value={newDuration}
            onChange={(e) => setNewDuration(e.target.value)}
            min="1"
            required
          />
          <button onClick={handleAdd} className="add-btn">Add Movie</button>
        </div>
      </div>

      <h2>🎥 Movie List ({movies.length} movies)</h2>
      <div className="movies-grid">
        {movies.map((movie) => (
          <div className="movie-card" key={movie.id}>
            <div 
              className="poster-container"
              onClick={() => handlePosterClick(movie.title)}
              title={`${movie.title} - View showings`}
            >
              <img 
                src={posters[movie.title]} 
                alt={movie.title} 
                className="movie-poster"
              />
              <div className="poster-overlay">
                <span>🎟️ View Showings</span>
                <small>⏱️ {movie.duration} min</small>
              </div>
            </div>

            <div className="movie-info">
              <h3>{movie.title}</h3>
              <p className="duration">⏱️ {movie.duration} minutes</p>
              
              {/* UPDATED BUTTONS - EDIT/DELETE SIDE BY SIDE */}
              <div className="movie-actions" onClick={(e) => e.stopPropagation()}>
                <button 
                  className="edit-btn"
                  onClick={() => handleEdit(movie)}
                >
                  ✏️ Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete "${movie.title}"?`)) {
                      handleDelete(movie.id);
                    }
                  }}
                >
                  🗑️ Delete
                </button>
                <button 
                  className="showings-btn"
                  onClick={() => handlePosterClick(movie.title)}
                >
                  🎬 Showings
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT MODAL - ONLY VISIBLE WHEN EDIT BUTTON IS CLICKED */}
      {editingMovie && (
        <div className="edit-modal">
          <div className="edit-content">
            <h2>✏️ Edit Movie: {editingMovie.title}</h2>
            
            <div className="form-group">
              <label>Movie Title:</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="edit-input"
                placeholder="New movie title"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Duration (minutes):</label>
              <input
                type="number"
                value={editDuration}
                onChange={(e) => setEditDuration(e.target.value)}
                min="1"
                className="edit-input"
                placeholder="New duration"
                required
              />
            </div>
            
            <div className="modal-buttons">
              <button className="save-btn" onClick={handleSaveEdit}>
                💾 Save
              </button>
              <button className="cancel-btn" onClick={handleCancelEdit}>
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}