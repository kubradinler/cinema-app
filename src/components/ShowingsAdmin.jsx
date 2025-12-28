import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./ShowingsAdmin.css";
import SeatSelector from "./SeatSelector";
import { posters } from "../assets/posters/posters";

const hallCapacities = { "Hall 1": 50, "Hall 2": 80, "Hall 3": 100 };

export default function ShowingsAdmin({ movies }) {
  const { movieTitle } = useParams();
  const [showings, setShowings] = useState(() => {
    const saved = localStorage.getItem("showings");
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return parsed.map(s => ({ ...s, soldSeats: Array.isArray(s.soldSeats) ? s.soldSeats : [] }));
    } catch {
      return [];
    }
  });

  const [selectedMovie, setSelectedMovie] = useState(movieTitle || "");
  const [selectedShowing, setSelectedShowing] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const [movie, setMovie] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [hall, setHall] = useState("");
  const [price, setPrice] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem("showings", JSON.stringify(showings));
  }, [showings]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!movie || !date || !time || !hall || !price) { alert("Fill all fields!"); return; }

    if (editingId) {
      setShowings(showings.map(s => s.id === editingId ? { ...s, movie, date, time, hall, price } : s));
      setEditingId(null);
    } else {
      setShowings([...showings, { id: Date.now(), movie, date, time, hall, price, soldSeats: [] }]);
    }

    setMovie(""); setDate(""); setTime(""); setHall(""); setPrice("");
  };

  const buyTickets = () => {
    if (!selectedSeats.length) { alert("Select at least one seat"); return; }

    setShowings(prev => {
      const updated = prev.map(s => s.id === selectedShowing.id
        ? { ...s, soldSeats: [...s.soldSeats, ...selectedSeats] }
        : s
      );
      setSelectedShowing(updated.find(s => s.id === selectedShowing.id));
      return updated;
    });

    alert(`🎉 Seats purchased: ${selectedSeats.join(", ")}`);
    setSelectedSeats([]);
  };

  const cancelSeat = (seat) => {
    setShowings(prev => {
      const updated = prev.map(s => s.id === selectedShowing.id
        ? { ...s, soldSeats: s.soldSeats.filter(x => x !== seat) }
        : s
      );
      setSelectedShowing(updated.find(s => s.id === selectedShowing.id));
      return updated;
    });
  };

  const today = new Date();
  const filteredShowings = showings.filter(s => {
    const showingDateTime = new Date(`${s.date}T${s.time}`);
    return showingDateTime >= today && (!selectedMovie || s.movie === selectedMovie);
  });

  return (
    <div className="showings-admin">
      <h2>{editingId ? "Update Showing" : "Add Showing"}</h2>
      <form onSubmit={handleSubmit}>
        <select value={movie} onChange={e => setMovie(e.target.value)}>
          <option value="">Select Movie</option>
          {movies.map(m => <option key={m.id} value={m.title}>{m.title}</option>)}
        </select>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        <input type="time" value={time} onChange={e => setTime(e.target.value)} />
        <select value={hall} onChange={e => setHall(e.target.value)}>
          <option value="">Select Hall</option>
          {Object.keys(hallCapacities).map(h => <option key={h} value={h}>{h}</option>)}
        </select>
        <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} />
        <button type="submit">{editingId ? "Update" : "Add"}</button>
      </form>

      <h2>Upcoming Showings</h2>
      <select value={selectedMovie} onChange={e => { setSelectedMovie(e.target.value); setSelectedShowing(null); setSelectedSeats([]); }}>
        <option value="">Select a Movie</option>
        {movies.map(m => <option key={m.id} value={m.title}>{m.title}</option>)}
      </select>

      <ul>
        {filteredShowings.map(s => {
          const poster = posters[s.movie];
          return (
            <li key={s.id} style={{ display: "flex", alignItems: "center", cursor: "pointer", marginBottom: "6px" }}
                onClick={() => { setSelectedShowing(s); setSelectedSeats([]); }}>
              {poster && <img src={poster} alt={s.movie} style={{ width: "40px", marginRight: "8px" }} />}
              <span>{s.movie} | {s.date} {s.time} | {s.hall || "-"} | {s.price}₺</span>
            </li>
          );
        })}
      </ul>

      {selectedShowing && (
        <>
          <h3>🎬 {selectedShowing.movie} – {selectedShowing.hall}</h3>
          <SeatSelector
            capacity={hallCapacities[selectedShowing.hall]}
            soldSeats={selectedShowing.soldSeats}
            selectedSeats={selectedSeats}
            onSelectSeat={setSelectedSeats}
            isAdmin={true}
            onCancelSeat={cancelSeat}
          />
          <button style={{ marginTop: "12px" }} onClick={buyTickets}>Purchase Tickets</button>
          <p style={{ marginTop: "8px" }}>⬜ Empty | 🟩 Selected | 🟥 Sold (click red to cancel)</p>
        </>
      )}
    </div>
  );
}
