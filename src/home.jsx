export default function Home() {
  return (
    <div style={{ padding: "40px 20px", textAlign: "center" }}>
      <h1 style={{ color: "#d63384" }}>🎬 Cinema Management System</h1>
      <p style={{ fontSize: "18px", marginTop: "20px" }}>
        Manage movies, create showings, and buy tickets.
      </p>
      
      <div style={{ marginTop: "40px", display: "flex", justifyContent: "center", gap: "30px", flexWrap: "wrap" }}>
        <div style={{ background: "#ffe4e1", padding: "20px", borderRadius: "10px", width: "250px" }}>
          <h3>🎬 Movies</h3>
          <p>Add, edit, and delete movies</p>
        </div>
        
        <div style={{ background: "#e1f5fe", padding: "20px", borderRadius: "10px", width: "250px" }}>
          <h3>🎫 Showings</h3>
          <p>Create and manage movie showings</p>
        </div>
        
        <div style={{ background: "#f1f8e9", padding: "20px", borderRadius: "10px", width: "250px" }}>
          <h3>💺 Buy Tickets</h3>
          <p>Click on posters to buy tickets</p>
        </div>
      </div>
    </div>
  );
}