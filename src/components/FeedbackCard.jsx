import { Avatar, Stars } from "./UI";
import { formatDate } from "../utils";

export function FeedbackCard({ feedback, currentUserId, onDelete }) {
  const isOwn = feedback.givenBy?._id === currentUserId;

  return (
    <div className="card">
      <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
        <div className="flex items-center gap-2">
          <Avatar name={feedback.givenBy?.name} size={32} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{feedback.givenBy?.name}</div>
            <div className="text-muted text-sm">
              {feedback.givenBy?.department} · {formatDate(feedback.createdAt)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Stars value={feedback.rating} size={14} />
          {isOwn && (
            <button className="btn btn-danger" style={{ padding: "5px 12px", fontSize: 12 }} onClick={() => onDelete(feedback._id)}>
              Delete
            </button>
          )}
        </div>
      </div>
      <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6 }}>{feedback.comment}</p>
    </div>
  );
}