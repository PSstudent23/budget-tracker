import { useState } from "react";

export default function Simulator() {
  const [initial, setInitial] = useState(0);
  const [monthly, setMonthly] = useState(0);
  const [rate, setRate] = useState(0);
  const [years, setYears] = useState(0);

  const r = rate / 100 / 12;
  const n = years * 12;

  let balance = Number(initial);
  let contributed = Number(initial);

  for (let i = 0; i < n; i++) {
    balance += Number(monthly);
    contributed += Number(monthly);
    balance *= 1 + r;
  }

  const earned = balance - contributed;

  return (
    <div>
      <h2>Simulator</h2>

      <p style={{fontWeight: "lighter"}}>Any currency is applicable, the result will not be saved</p>
      <br />

      <p>Initial deposit</p>
      <input
        type="number"
        placeholder="Initial deposit"
        onChange={(e) => setInitial(e.target.value)}
      />
      <br />

      <p>Monthly contribution</p>
      <input
        type="number"
        placeholder="Monthly contribution"
        onChange={(e) => setMonthly(e.target.value)}
      />
      <br />

      <p>Annual rate (%)</p>
      <input
        type="number"
        placeholder="Annual rate (%)"
        onChange={(e) => setRate(e.target.value)}
      />
      <br />

      <p>Duration (years)</p>
      <input
        type="number"
        placeholder="Duration (years)"
        onChange={(e) => setYears(e.target.value)}
      />
      <br />

      <hr />

      <p style={{fontWeight: "bold"}}>After {years} years at a {rate}% annual return:</p>
      <br/>
      <p>Final value: {balance.toFixed(2)}€</p>
      <p>Total contributed: {contributed.toFixed(2)}€</p>
      <p style={{color: "green"}}>Earned: {earned.toFixed(2)}€</p>
    </div>
  );
}