import React from "react";
import "./SeatSelector.css";

export default function SeatSelector({
  capacity,
  soldSeats = [],
  selectedSeats = [],
  onSelectSeat,
  isAdmin = false,
  onCancelSeat,
}) {
  const seats = Array.from({ length: capacity }, (_, i) => i + 1);

  const handleClick = (seat, isSold) => {
    if (isSold && isAdmin) {
      const ok = window.confirm("Are you sure you want to cancel this seat?");
      if (ok) onCancelSeat(seat);
      return;
    }

    if (!isSold) {
      if (selectedSeats.includes(seat)) {
        onSelectSeat(selectedSeats.filter(s => s !== seat)); // seçimi kaldır
      } else {
        onSelectSeat([...selectedSeats, seat]); // seçimi ekle
      }
    }
  };

  return (
    <div className="seat-selector">
      {seats.map((seat) => {
        const isSold = soldSeats.includes(seat);
        const isSelected = selectedSeats.includes(seat);

        return (
          <button
            key={seat}
            className={`seat ${isSold ? "sold" : isSelected ? "selected" : ""}`}
            onClick={() => handleClick(seat, isSold)}
          >
            {seat}
          </button>
        );
      })}
    </div>
  );
}
