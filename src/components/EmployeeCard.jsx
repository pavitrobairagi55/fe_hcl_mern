import { Avatar } from "./UI";

export function EmployeeCard({ employee, onFeedback }) {
  return (
    <div className="card">
      <div className="flex items-center gap-3" style={{ marginBottom: 12 }}>
        <Avatar name={employee.name} />
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{employee.name}</div>
          <div className="text-muted text-sm">{employee.department}</div>
        </div>
      </div>
      <div className="text-muted text-sm" style={{ marginBottom: 16 }}>{employee.email}</div>
      <button className="btn btn-primary btn-block" onClick={() => onFeedback(employee)}>
        Give Feedback
      </button>
    </div>
  );
}