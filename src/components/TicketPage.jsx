import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SeatSelector from "./SeatSelector";

const halls = {
  "Hall 1": 50,
  "Hall 2": 80,
  "Hall 3": 100,
};

export default function TicketPage() {
  const { movieTitle } = useParams();
  const [showings, setShowings] = useState([]);
  const [selectedShowing, setSelectedShowing] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("showings");
    setShowings(saved ? JSON.parse(saved) : []);
  }, []);

  const movieShowings = showings.filter(
    (s) => s.movie === movieTitle
  );

  const buyTicket = () => {
    if (!selectedSeat) {
      alert("Select a seat");
      return;
    }

    const updated = showings.map((s) =>
      s.id === selectedShowing.id
        ? { ...s, soldSeats: [...s.soldSeats, selectedSeat] }
        : s
    );

    setShowings(updated);
    localStorage.setItem("showings", JSON.stringify(updated));

    setSelectedShowing((prev) => ({
      ...prev,
      soldSeats: [...prev.soldSeats, selectedSeat],
    }));

    setSelectedSeat(null);
    alert(`🎉 Seat ${selectedSeat} purchased!`);
  };

  const cancelSeat = (seat) => {
    const updated = showings.map((s) =>
      s.id === selectedShowing.id
        ? { ...s, soldSeats: s.soldSeats.filter((x) => x !== seat) }
        : s
    );

    setShowings(updated);
    localStorage.setItem("showings", JSON.stringify(updated));

    setSelectedShowing((prev) => ({
      ...prev,
      soldSeats: prev.soldSeats.filter((x) => x !== seat),
    }));
  };

  return (
    <div style={{ padding: "24px" }}>
      <h2>🎬 {movieTitle}</h2>

      {movieShowings.length === 0 && <p>No showings available</p>}

      <ul>
        {movieShowings.map((s) => (
          <li
            key={s.id}
            style={{ cursor: "pointer", marginBottom: "6px" }}
            onClick={() => {
              setSelectedShowing(s);
              setSelectedSeat(null);
            }}
          >
            {s.date} | {s.time} | {s.hall} | {s.price}₺
          </li>
        ))}
      </ul>

      {selectedShowing && (
        <>
          <h3>Choose your seat</h3>

          <SeatSelector
            capacity={halls[selectedShowing.hall]}
            soldSeats={selectedShowing.soldSeats}
            selectedSeat={selectedSeat}
            onSelectSeat={setSelectedSeat}
            isAdmin={true}
            onCancelSeat={cancelSeat}
          />

          <button onClick={buyTicket} style={{ marginTop: "12px" }}>
            Purchase Ticket
          </button>

          <p style={{ marginTop: "8px" }}>
            ⬜ Empty | 🟩 Selected | 🟥 Sold (click red to cancel)
          </p>
        </>
      )}
    </div>
  );
}
