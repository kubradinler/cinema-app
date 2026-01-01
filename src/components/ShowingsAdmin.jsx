import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ShowingsAdmin.css";
import { posters } from "../assets/posters/posters";

const hallCapacities = { 
  "Hall 1": 50, 
  "Hall 2": 80, 
  "Hall 3": 100 
};

export default function ShowingsAdmin({ movies }) {
  const { movieTitle } = useParams();
  const navigate = useNavigate();
  
  // GET SHOWINGS FROM LOCALSTORAGE - SAFE VERSION
  const [showings, setShowings] = useState(() => {
    try {
      const saved = localStorage.getItem("showings");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Check soldSeats array for each showing
        return parsed.map(show => ({
          ...show,
          id: show.id || Date.now(),
          price: Number(show.price) || 50,
          soldSeats: Array.isArray(show.soldSeats) ? show.soldSeats : []
        }));
      }
      return [];
    } catch (error) {
      console.error("LocalStorage read error:", error);
      return [];
    }
  });

  // Filter by movie name from URL
  const [selectedMovie, setSelectedMovie] = useState("");
  const [selectedShowing, setSelectedShowing] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  
  // Form states - Add default values
  const [movie, setMovie] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [hall, setHall] = useState("");
  const [price, setPrice] = useState("50"); // Default value

  // Update selectedMovie when URL changes
  useEffect(() => {
    if (movieTitle) {
      try {
        const decodedTitle = decodeURIComponent(movieTitle);
        setSelectedMovie(decodedTitle);
      } catch {
        setSelectedMovie(movieTitle);
      }
    }
  }, [movieTitle]);

  // SAVE TO LOCALSTORAGE - SAFE VERSION
  useEffect(() => {
    try {
      const validShowings = showings.map(show => ({
        ...show,
        price: Number(show.price) || 50, // Price should always be a number
        soldSeats: Array.isArray(show.soldSeats) ? show.soldSeats : []
      }));
      localStorage.setItem("showings", JSON.stringify(validShowings));
    } catch (error) {
      console.error("LocalStorage save error:", error);
    }
  }, [showings]);

  // Add new showing
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation - ENHANCED
    if (!movie || !date || !time || !hall || !price) { 
      alert("Please fill in all fields!"); 
      return; 
    }
    
    const priceNumber = Number(price);
    if (isNaN(priceNumber) || priceNumber <= 0) {
      alert("Please enter a valid price! (Must be greater than 0)");
      return;
    }

    const newShowing = { 
      id: Date.now(), 
      movie, 
      date, 
      time, 
      hall, 
      price: priceNumber, // Converted price to number
      soldSeats: [] 
    };
    
    setShowings([...showings, newShowing]);
    
    // Clear form
    setMovie(""); 
    setDate(""); 
    setTime(""); 
    setHall(""); 
    setPrice("50"); // Reset to default value
    
    alert("Showing successfully added!");
  };

  // Buy tickets - SAFE VERSION
  const buyTickets = () => {
    if (!selectedSeats.length) { 
      alert("Please select at least one seat!"); 
      return; 
    }

    if (!selectedShowing) {
      alert("Please select a showing first!");
      return;
    }

    // Price check
    const showPrice = Number(selectedShowing.price) || 50;
    if (isNaN(showPrice)) {
      alert("Error in showing price! Please contact admin.");
      return;
    }

    // SoldSeats check
    const currentSoldSeats = Array.isArray(selectedShowing.soldSeats) 
      ? selectedShowing.soldSeats 
      : [];
    
    setShowings(prev => {
      const updated = prev.map(s => s.id === selectedShowing.id
        ? { 
            ...s, 
            soldSeats: [...currentSoldSeats, ...selectedSeats],
            price: Number(s.price) || 50 // Ensure price is safe
          }
        : { 
            ...s, 
            price: Number(s.price) || 50 // Fix price for other showings too
          }
      );
      setSelectedShowing(updated.find(s => s.id === selectedShowing.id));
      return updated;
    });

    const totalPrice = selectedSeats.length * showPrice;
    
    alert(`🎉 Tickets successfully purchased!\nSeats: ${selectedSeats.join(", ")}\nTotal: ${totalPrice}₺`);
    
    // Clear selected seats
    setSelectedSeats([]);
  };

  // CANCEL SOLD SEAT (ADMIN FUNCTION)
  const cancelSeat = (seatNumber) => {
    if (!selectedShowing) {
      alert("Please select a showing first!");
      return;
    }

    if (!window.confirm(`Are you sure you want to cancel seat ${seatNumber}? This will make it available for purchase again.`)) {
      return;
    }

    const currentSoldSeats = Array.isArray(selectedShowing.soldSeats) 
      ? selectedShowing.soldSeats 
      : [];
    
    if (!currentSoldSeats.includes(seatNumber)) {
      alert(`Seat ${seatNumber} is not sold!`);
      return;
    }

    setShowings(prev => {
      const updated = prev.map(s => s.id === selectedShowing.id
        ? { 
            ...s, 
            soldSeats: currentSoldSeats.filter(seat => seat !== seatNumber),
            price: Number(s.price) || 50
          }
        : { 
            ...s, 
            price: Number(s.price) || 50
          }
      );
      setSelectedShowing(updated.find(s => s.id === selectedShowing.id));
      return updated;
    });

    alert(`Seat ${seatNumber} has been cancelled and is now available.`);
  };

  // Today's date
  const today = new Date().toISOString().split('T')[0];
  
  // Filter future showings - SAFE
  const filteredShowings = showings.filter(s => {
    try {
      // Date and time check
      if (!s.date || !s.time) return false;
      
      const showingDateTime = new Date(`${s.date}T${s.time}`);
      if (isNaN(showingDateTime.getTime())) return false;
      
      const isFuture = showingDateTime >= new Date();
      const matchesMovie = !selectedMovie || s.movie === selectedMovie;
      
      return isFuture && matchesMovie;
    } catch {
      return false;
    }
  });

  // Get available seats safely
  const getAvailableSeats = (showing) => {
    if (!showing || !showing.hall) return 0;
    
    const capacity = hallCapacities[showing.hall] || 50;
    const soldSeats = Array.isArray(showing.soldSeats) ? showing.soldSeats : [];
    
    return capacity - soldSeats.length;
  };

  // Get price safely
  const getPrice = (showing) => {
    const price = Number(showing?.price);
    return isNaN(price) ? 50 : price;
  };

  // Handle seat click - UPDATED WITH CANCELLATION
  const handleSeatClick = (seatNumber) => {
    if (!selectedShowing) return;
    
    const soldSeats = Array.isArray(selectedShowing.soldSeats) 
      ? selectedShowing.soldSeats 
      : [];
    
    // If seat is sold, allow admin to cancel it
    if (soldSeats.includes(seatNumber)) {
      cancelSeat(seatNumber);
      return;
    }
    
    // If seat is not sold, toggle selection
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(prev => prev.filter(s => s !== seatNumber));
    } else {
      setSelectedSeats(prev => [...prev, seatNumber]);
    }
  };

  return (
    <div className="showings-admin">
      {/* BACK BUTTON */}
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back to Movie List
      </button>

      <h1>🎫 Showings Management</h1>
      
      {/* SELECTED MOVIE BANNER */}
      {selectedMovie && (
        <div className="selected-movie-banner">
          <h2>🎬 Active Movie: <span className="highlight">{selectedMovie}</span></h2>
          <button 
            className="clear-filter-btn"
            onClick={() => {
              setSelectedMovie("");
              navigate('/showings');
            }}
          >
            ✖️ Show All Showings
          </button>
        </div>
      )}

      {/* ADD SHOWING FORM */}
      <div className="showing-form-section">
        <h2>➕ Add New Showing</h2>
        <form onSubmit={handleSubmit} className="showing-form">
          <div className="form-group">
            <label>Movie:</label>
            <select 
              value={movie} 
              onChange={e => setMovie(e.target.value)} 
              required
            >
              <option value="">Select</option>
              {movies.map(m => (
                <option key={m.id} value={m.title}>{m.title}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Date:</label>
            <input 
              type="date" 
              value={date} 
              onChange={e => setDate(e.target.value)} 
              min={today}
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Time:</label>
            <input 
              type="time" 
              value={time} 
              onChange={e => setTime(e.target.value)} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Hall:</label>
            <select 
              value={hall} 
              onChange={e => setHall(e.target.value)} 
              required
            >
              <option value="">Select</option>
              {Object.keys(hallCapacities).map(h => (
                <option key={h} value={h}>{h} ({hallCapacities[h]} seats)</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Ticket Price (₺):</label>
            <input 
              type="number" 
              value={price} 
              onChange={e => setPrice(e.target.value)}
              min="1"
              step="5"
              placeholder="50"
              required 
            />
          </div>
          
          <button type="submit" className="submit-btn">Add Showing</button>
        </form>
      </div>

      {/* FILTER SECTION */}
      <div className="filter-section">
        <h2>🔍 Filter Showings</h2>
        <div className="filter-controls">
          <select 
            value={selectedMovie} 
            onChange={e => {
              setSelectedMovie(e.target.value);
              setSelectedShowing(null);
              setSelectedSeats([]);
            }}
            className="movie-filter"
          >
            <option value="">🎬 All Movies</option>
            {movies.map(m => (
              <option key={m.id} value={m.title}>{m.title}</option>
            ))}
          </select>
        </div>
        <p className="filter-info">
          {filteredShowings.length} showings found
        </p>
      </div>

      {/* SHOWINGS LIST */}
      <div className="showings-list">
        <h2>📅 Select a Showing</h2>
        {filteredShowings.length === 0 ? (
          <div className="no-showings">
            <p>⚠️ No showings yet</p>
            <p>Add a showing using the form above.</p>
          </div>
        ) : (
          <div className="showings-grid">
            {filteredShowings.map(s => {
              const poster = posters[s.movie];
              const isSelected = selectedShowing?.id === s.id;
              const availableSeats = getAvailableSeats(s);
              const capacity = hallCapacities[s.hall] || 50;
              const priceValue = getPrice(s);
              
              return (
                <div 
                  key={s.id} 
                  className={`showing-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => { 
                    console.log("Selected showing:", s);
                    setSelectedShowing(s); 
                    setSelectedSeats([]); 
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="showing-header">
                    {poster && (
                      <img 
                        src={poster} 
                        alt={s.movie} 
                        className="showing-poster" 
                      />
                    )}
                    <div className="showing-title">
                      <h3>{s.movie || "Untitled Movie"}</h3>
                      <span className={`status-badge ${
                        availableSeats <= 0 ? 'sold-out' : 'available'
                      }`}>
                        {availableSeats <= 0 ? 'SOLD OUT' : 'AVAILABLE'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="showing-details">
                    <div className="detail-item">
                      <span className="detail-label">📅 Date:</span>
                      <span className="detail-value">{s.date || "-"}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">⏰ Time:</span>
                      <span className="detail-value">{s.time || "-"}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">🏛️ Hall:</span>
                      <span className="detail-value">{s.hall || "-"}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">💰 Price:</span>
                      <span className="detail-value price">{priceValue}₺</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">💺 Available Seats:</span>
                      <span className="detail-value seats">
                        {availableSeats}/{capacity}
                      </span>
                    </div>
                  </div>
                  
                  <div className="showing-footer">
                    <button 
                      className="select-showing-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedShowing(s); 
                        setSelectedSeats([]);
                      }}
                    >
                      {isSelected ? '✓ SELECTED' : '🎬 SELECT'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SEAT SELECTION SECTION */}
      {selectedShowing ? (
        <div className="seat-selection-section">
          <div className="selected-showing-header">
            <h2>
              🎬 {selectedShowing.movie || "Movie"} - SEAT SELECTION
              <span className="subtitle">
                {selectedShowing.hall || "Hall"} | {selectedShowing.date || "-"} {selectedShowing.time || "-"} | {getPrice(selectedShowing)}₺
              </span>
            </h2>
            <p className="admin-note">
              ⓘ ADMIN: Click on sold (red) seats to cancel them
            </p>
          </div>
          
          {/* INFO CARDS */}
          <div className="showing-info-cards">
            <div className="info-card">
              <div className="info-icon">💺</div>
              <div className="info-content">
                <div className="info-label">Hall Capacity</div>
                <div className="info-value">{hallCapacities[selectedShowing.hall] || 50} seats</div>
              </div>
            </div>
            
            <div className="info-card">
              <div className="info-icon">🆓</div>
              <div className="info-content">
                <div className="info-label">Available Seats</div>
                <div className="info-value highlight">
                  {getAvailableSeats(selectedShowing)}
                </div>
              </div>
            </div>
            
            <div className="info-card">
              <div className="info-icon">💰</div>
              <div className="info-content">
                <div className="info-label">Ticket Price</div>
                <div className="info-value">{getPrice(selectedShowing)}₺</div>
              </div>
            </div>
          </div>

          {/* SEAT SELECTOR */}
          <div className="seat-selector-container">
            <h3>💺 Please select seat(s):</h3>
            
            <div className="seats-grid">
              {Array.from({ 
                length: hallCapacities[selectedShowing.hall] || 50 
              }, (_, i) => {
                const seatNumber = i + 1;
                const soldSeats = Array.isArray(selectedShowing.soldSeats) 
                  ? selectedShowing.soldSeats 
                  : [];
                const isSold = soldSeats.includes(seatNumber);
                const isSelected = selectedSeats.includes(seatNumber);
                
                return (
                  <button
                    key={seatNumber}
                    className={`seat ${isSold ? 'sold' : isSelected ? 'selected' : 'available'}`}
                    onClick={() => handleSeatClick(seatNumber)}
                    title={isSold ? `Click to cancel seat ${seatNumber} (Admin)` : `Seat ${seatNumber}`}
                  >
                    {seatNumber}
                  </button>
                );
              })}
            </div>
            
            {/* SCREEN */}
            <div className="screen-display">
              🎬🎬🎬 S C R E E N 🎬🎬🎬
            </div>
            
            <div className="selected-seats-info">
              <strong>Selected Seats:</strong> 
              {selectedSeats.length > 0 
                ? ` ${selectedSeats.sort((a,b) => a-b).join(", ")} (${selectedSeats.length} seats)`
                : ' No seats selected yet'}
              {selectedSeats.length > 0 && (
                <span style={{ marginLeft: '20px', color: 'green', fontWeight: 'bold' }}>
                  Total: {selectedSeats.length * getPrice(selectedShowing)}₺
                </span>
              )}
            </div>
          </div>
          
          {/* ACTION BUTTONS */}
          <div className="action-buttons">
            <button 
              className="purchase-btn"
              onClick={buyTickets}
              disabled={selectedSeats.length === 0}
            >
              🎫 BUY {selectedSeats.length} TICKET(S) ({selectedSeats.length * getPrice(selectedShowing)}₺)
            </button>
            
            <button 
              className="clear-seats-btn"
              onClick={() => {
                if (selectedSeats.length > 0 && window.confirm('Are you sure you want to clear all selected seats?')) {
                  setSelectedSeats([]);
                }
              }}
              disabled={selectedSeats.length === 0}
            >
              🗑️ Clear Selection
            </button>
          </div>
          
          {/* SEAT LEGEND */}
          <div className="seat-legend">
            <h4>🎨 Seat Colors:</h4>
            <div className="legend-items">
              <div className="legend-item">
                <div className="seat-example available"></div>
                <span>Available (Click to select)</span>
              </div>
              <div className="legend-item">
                <div className="seat-example selected-legend"></div>
                <span>Selected (Click to deselect)</span>
              </div>
              <div className="legend-item">
                <div className="seat-example sold"></div>
                <span>Sold (Click to cancel - Admin only)</span>
              </div>
            </div>
            <div className="legend-note">
              💡 <strong>ADMIN FEATURE:</strong> Click on sold (red) seats to cancel them and make them available again.
            </div>
          </div>
        </div>
      ) : (
        <div className="no-showing-selected">
          <h3>👆 Select a showing from above</h3>
          <p>To select seats, you must first choose a showing from the list above.</p>
          <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
            💡 You can select a showing by clicking on it after adding one.
          </p>
        </div>
      )}
    </div>
  );
}