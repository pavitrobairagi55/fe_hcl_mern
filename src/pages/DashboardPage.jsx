import { useState, useEffect, useCallback } from "react";
import { employeesApi, feedbacksApi } from "../api";
import { toast } from "../hooks/useToast";
import { EmployeeCard } from "../components/EmployeeCard";
import { FeedbackCard } from "../components/FeedbackCard";
import { FeedbackModal } from "../components/FeedbackModal";
import { Stars, SkeletonCard, EmptyState } from "../components/UI";
import { Topbar } from "../components/Toolbar";

export function DashboardPage({ user, onLogout }) {
  const [tab, setTab] = useState("team");
  const [employees, setEmployees] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [myRating, setMyRating] = useState(null);
  const [loadingEmp, setLoadingEmp] = useState(true);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [selected, setSelected]   = useState(null);

  const fetchEmployees = useCallback(async () => {
    setLoadingEmp(true);
    try {
      const res = await employeesApi.getAll();
      setEmployees((res.data?.employees || []).filter((e) => e._id !== user._id));
    } catch (err) {
      toast(err.message);
    } finally {
      setLoadingEmp(false);
    }
  }, [user._id]);

  const fetchFeedbacks = useCallback(async () => {
    setLoadingFeed(true);
    try {
      const [feedRes, ratingRes] = await Promise.all([
        feedbacksApi.getByEmployee(user._id),
        feedbacksApi.getAverage(user._id),
      ]);
      setFeedbacks(feedRes.data?.feedbacks || []);
      setMyRating(ratingRes.data);
    } catch (err) {
      toast(err.message);
    } finally {
      setLoadingFeed(false);
    }
  }, [user._id]);

  useEffect(() => {
    fetchEmployees();
    fetchFeedbacks();
  }, [fetchEmployees, fetchFeedbacks]);

  const handleDelete = async (id) => {
    try {
      await feedbacksApi.delete(id);
      toast("Feedback deleted", "success");
      fetchFeedbacks();
    } catch (err) {
      toast(err.message);
    }
  };

  const avg = myRating?.averageRating;

  return (
    <div>
      <Topbar user={user} onLogout={onLogout} />

      <div className="container" style={{ padding: "28px 20px" }}>

        {/* My Rating */}
        <div className="card" style={{ marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <p className="text-muted text-sm">Your average rating</p>
            <div style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.1, marginTop: 4 }}>
              {loadingFeed ? "—" : avg ? avg.toFixed(1) : "No ratings yet"}
            </div>
            {avg && (
              <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 10 }}>
                <Stars value={Math.round(avg)} size={18} />
                <span className="text-muted text-sm">{myRating.totalFeedbacks} feedback{myRating.totalFeedbacks !== 1 ? "s" : ""}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button className={`tab ${tab === "team" ? "active" : ""}`} onClick={() => setTab("team")}>Team</button>
          <button className={`tab ${tab === "feedbacks" ? "active" : ""}`} onClick={() => setTab("feedbacks")}>
            My Feedback {feedbacks.length > 0 && `(${feedbacks.length})`}
          </button>
        </div>

        {/* Team Tab */}
        {tab === "team" && (
          <>
            {loadingEmp ? (
              <div className="employee-grid">
                {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : employees.length === 0 ? (
              <EmptyState icon="👥" title="No teammates yet" message="Other employees will appear here once they register." />
            ) : (
              <div className="employee-grid">
                {employees.map((emp) => (
                  <EmployeeCard key={emp._id} employee={emp} onFeedback={setSelected} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Feedbacks Tab */}
        {tab === "feedbacks" && (
          <>
            {loadingFeed ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : feedbacks.length === 0 ? (
              <EmptyState icon="💬" title="No feedback yet" message="Ask teammates to share their thoughts on your work." />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {feedbacks.map((fb) => (
                  <FeedbackCard
                    key={fb._id}
                    feedback={fb}
                    currentUserId={user._id}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {selected && (
        <FeedbackModal
          employee={selected}
          onClose={() => setSelected(null)}
          onSuccess={fetchFeedbacks}
        />
      )}
    </div>
  );
}