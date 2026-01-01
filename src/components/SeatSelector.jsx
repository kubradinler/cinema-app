import "./SeatSelector.css";

export default function SeatSelector({ 
  capacity, 
  soldSeats, 
  selectedSeats, 
  onSelectSeat, 
  isAdmin = false,
  onCancelSeat 
}) {
  const seats = Array.from({ length: capacity }, (_, i) => i + 1);

  const handleSeatClick = (seat) => {
    if (soldSeats.includes(seat)) {
      if (isAdmin && onCancelSeat) {
        onCancelSeat(seat);
      }
      return;
    }
    
    const newSelected = selectedSeats.includes(seat)
      ? selectedSeats.filter(s => s !== seat)
      : [...selectedSeats, seat];
    
    onSelectSeat(newSelected);
  };

  const getSeatClass = (seat) => {
    if (soldSeats.includes(seat)) return "seat sold";
    if (selectedSeats.includes(seat)) return "seat selected";
    return "seat available";
  };

  return (
    <div className="seat-selector">
      <div className="screen">🎬 SCREEN 🎬</div>
      <div className="seats-grid">
        {seats.map(seat => (
          <button
            key={seat}
            className={getSeatClass(seat)}
            onClick={() => handleSeatClick(seat)}
            title={`Seat ${seat}`}
            disabled={soldSeats.includes(seat) && !isAdmin}
          >
            {seat}
          </button>
        ))}
      </div>
      <div className="seat-info">
        Selected seats: {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
      </div>
    </div>
  );
}