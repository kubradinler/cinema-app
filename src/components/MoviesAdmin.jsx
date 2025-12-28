import { useState } from "react";
import { initialMovies } from "../data/movies";
import { posters } from "../assets/posters/posters"; // posterler buradan
import "./MoviesAdmin.css";

export default function MoviesAdmin() {
  const [movies, setMovies] = useState(initialMovies);
  const [editingMovie, setEditingMovie] = useState(null); // düzenlenen film
  const [editTitle, setEditTitle] = useState("");
  const [editDuration, setEditDuration] = useState("");

  // Yeni film ekleme state
  const [newTitle, setNewTitle] = useState("");
  const [newDuration, setNewDuration] = useState("");

  // Delete fonksiyonu
  const handleDelete = (id) => {
    setMovies(movies.filter((movie) => movie.id !== id));
  };

  // Edit başlat
  const handleEdit = (movie) => {
    setEditingMovie(movie);
    setEditTitle(movie.title);
    setEditDuration(movie.duration);
  };

  // Edit kaydet
  const handleSave = () => {
    setMovies(
      movies.map((m) =>
        m.id === editingMovie.id
          ? { ...m, title: editTitle, duration: Number(editDuration) }
          : m
      )
    );
    setEditingMovie(null);
  };

  // Edit iptal
  const handleCancel = () => {
    setEditingMovie(null);
  };

  // Yeni film ekle
  const handleAdd = () => {
    if (!newTitle || !newDuration) return;
    const newMovie = {
      id: Date.now(),
      title: newTitle,
      duration: Number(newDuration),
    };
    setMovies([...movies, newMovie]);
    setNewTitle("");
    setNewDuration("");
  };

  return (
    <div className="movies-page">
      <h1>🎞️ Movie Management (Admin)</h1>

      {/* Yeni Film Ekleme Formu */}
      <div className="add-movie-form">
        <input
          type="text"
          placeholder="Movie Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <input
          type="number"
          placeholder="Duration (min)"
          value={newDuration}
          onChange={(e) => setNewDuration(e.target.value)}
        />
        <button onClick={handleAdd}>Add Movie</button>
      </div>

      <div className="movies-grid">
        {movies.map((movie) => (
          <div className="movie-card" key={movie.id}>
            <img src={posters[movie.title]} alt={movie.title} />

            <div className="movie-info">
              <h3>{movie.title}</h3>
              <p>{movie.duration} min</p>

              <div className="movie-actions">
                <button className="edit-btn" onClick={() => handleEdit(movie)}>
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(movie.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingMovie && (
        <div className="edit-modal">
          <div className="edit-content">
            <h2>Edit Movie</h2>
            <label>
              Title:
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </label>
            <label>
              Duration:
              <input
                type="number"
                value={editDuration}
                onChange={(e) => setEditDuration(e.target.value)}
              />
            </label>
            <div className="modal-buttons">
              <button className="edit-btn" onClick={handleSave}>
                Save
              </button>
              <button className="delete-btn" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
