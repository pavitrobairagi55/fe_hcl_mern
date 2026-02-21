import { useState } from "react";
import { feedbacksApi } from "../api";
import { toast } from "../hooks/useToast";
import { Modal, Field, StarInput, Spinner } from "./UI";

export function FeedbackModal({ employee, onClose, onSuccess }) {
  const [form, setForm]     = useState({ rating: 0, comment: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.rating)               e.rating  = "Please select a rating";
    if (!form.comment.trim())       e.comment = "Comment is required";
    else if (form.comment.length < 10) e.comment = "At least 10 characters";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setLoading(true);
    try {
      await feedbacksApi.submit({ rating: form.rating, comment: form.comment, givenTo: employee._id });
      toast("Feedback submitted!", "success");
      onSuccess();
      onClose();
    } catch (err) {
      toast(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Give Feedback"
      subtitle={`For ${employee.name} · ${employee.department}`}
      onClose={onClose}
      actions={
        <>
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <Spinner /> : "Submit"}
          </button>
        </>
      }
    >
      <Field label="Rating" error={errors.rating}>
        <StarInput
          value={form.rating}
          onChange={(v) => { setForm((f) => ({ ...f, rating: v })); setErrors((e) => ({ ...e, rating: "" })); }}
        />
      </Field>

      <Field label="Comment" error={errors.comment}>
        <textarea
          className={errors.comment ? "input-error" : ""}
          value={form.comment}
          placeholder="Share your honest feedback…"
          onChange={(e) => { setForm((f) => ({ ...f, comment: e.target.value })); setErrors((er) => ({ ...er, comment: "" })); }}
        />
      </Field>
    </Modal>
  );
}