export default function Stats({ stats }) {
  const { total, owned, missing, duplicates, percent } = stats;

  return (
    <div className="stats-page">
      <div className="stats-hero">
        <div className="stats-circle">
          <svg viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="#1e293b" strokeWidth="10" />
            <circle
              cx="60" cy="60" r="52" fill="none"
              stroke="#f59e0b" strokeWidth="10"
              strokeDasharray={`${(percent / 100) * 326.7} 326.7`}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div className="stats-circle-text">
            <span className="stats-percent">{percent}%</span>
            <span className="stats-label">completo</span>
          </div>
        </div>
      </div>

      <div className="stats-cards">
        <div className="stat-card stat-owned">
          <span className="stat-number">{owned}</span>
          <span className="stat-name">Tengo</span>
        </div>
        <div className="stat-card stat-missing">
          <span className="stat-number">{missing}</span>
          <span className="stat-name">Me faltan</span>
        </div>
        <div className="stat-card stat-duplicate">
          <span className="stat-number">{duplicates}</span>
          <span className="stat-name">Repetidas</span>
        </div>
        <div className="stat-card stat-total">
          <span className="stat-number">{total}</span>
          <span className="stat-name">Total</span>
        </div>
      </div>

      <div className="stats-bar-wrap">
        <div className="stats-bar">
          <div className="stats-bar-fill" style={{ width: `${percent}%` }} />
        </div>
        <p className="stats-bar-label">{owned} de {total} figuritas</p>
      </div>
    </div>
  );
}
