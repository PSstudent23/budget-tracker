import "../styles/Home.css";

export default function Home({ user }) {
  return (
    <div>
      <h2>User: {user?.first_name}</h2>

      <div className="cards">
        <div className="card">
          <p>Monthly income</p>
          <h3>{user?.monthly_income}</h3>
        </div>

        <div className="card">
          <p>Total spent</p>
          <h3>€1,840</h3>
        </div>

         <div className="card">
          <p>Remaining</p>
          <h3>€{user ? user.monthly_income - 1840 : 0}</h3>
        </div>

        <div className="card">
          <p>Active goals</p>
          <h3>3</h3>
        </div>
      </div>
    </div>
  );
}