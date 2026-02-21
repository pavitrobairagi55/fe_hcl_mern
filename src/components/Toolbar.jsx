import { Avatar } from "./UI";

export function Topbar({ user, onLogout }) {
  return (
    <header className="topbar">
      <span className="topbar-logo">Pulse</span>
      <div className="topbar-right">
        <div className="user-meta">
          <div className="name">{user.name}</div>
          <div className="dept">{user.department}</div>
        </div>
        <Avatar name={user.name} />
        <button
          onClick={onLogout}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#6b7280", fontFamily: "inherit" }}
        >
          Sign out
        </button>
      </div>
    </header>
  );
}