import "../styles/Home.css";
export default function Home({ user }) {
  return (
    <div>
      <h2 className="title" >Welcome back, {user?.first_name} </h2>

      <div className="" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "24px" }}>
        {[
          { label: "Monthly income", value: "€3,200" },
          { label: "Total spent", value: "€1,840" },
          { label: "Remaining", value: "€1,360" },
          { label: "Active goals", value: "3" },
        ].map(card => (
          <div key={card.label} style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "16px",
          }}>
            <p style={{ fontSize: "12px", color: "#6b7280", margin: "0 0 4px" }}>{card.label}</p>
            <p style={{ fontSize: "22px", fontWeight: 500, margin: 0 }}>{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}