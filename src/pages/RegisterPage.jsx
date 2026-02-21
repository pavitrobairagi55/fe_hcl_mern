import { useState } from "react";
import { authApi } from "../api";
import { toast } from "../hooks/useToast";
import { Field, Spinner } from "../components/UI";
import { validateEmail } from "../utils";

export function RegisterPage({ onLogin, onSwitch }) {
  const [form, setForm]     = useState({ name: "", email: "", password: "", department: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())               e.name       = "Name is required";
    else if (form.name.trim().length < 2) e.name      = "At least 2 characters";
    if (!form.email.trim())              e.email      = "Email is required";
    else if (!validateEmail(form.email)) e.email      = "Enter a valid email";
    if (!form.password)                  e.password   = "Password is required";
    else if (form.password.length < 6)   e.password   = "At least 6 characters";
    if (!form.department.trim())         e.department = "Department is required";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setLoading(true);
    try {
      const data = await authApi.register(form);
      localStorage.setItem("token", data.token);
      onLogin(data.data.employee);
    } catch (err) {
      toast(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-center">
      <div style={{ width: "100%", maxWidth: 420 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Create account</h1>
        <p className="text-muted text-sm" style={{ marginBottom: 28 }}>Join your team on Pulse</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <Field label="Full Name" error={errors.name}>
              <input
                className={errors.name ? "input-error" : ""}
                value={form.name}
                onChange={set("name")}
                placeholder="Jane Smith"
                autoFocus
              />
            </Field>
            <Field label="Department" error={errors.department}>
              <input
                className={errors.department ? "input-error" : ""}
                value={form.department}
                onChange={set("department")}
                placeholder="Engineering"
              />
            </Field>
          </div>

          <Field label="Email" error={errors.email}>
            <input
              type="email"
              className={errors.email ? "input-error" : ""}
              value={form.email}
              onChange={set("email")}
              placeholder="you@company.com"
            />
          </Field>

          <Field label="Password" error={errors.password}>
            <input
              type="password"
              className={errors.password ? "input-error" : ""}
              value={form.password}
              onChange={set("password")}
              placeholder="Min. 6 characters"
            />
          </Field>

          <button type="submit" className="btn btn-primary btn-block mt-4" disabled={loading}>
            {loading ? <><Spinner /> Creating account…</> : "Create Account"}
          </button>
        </form>

        <p className="text-muted text-sm" style={{ marginTop: 20, textAlign: "center" }}>
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitch}
            style={{ background: "none", border: "none", color: "var(--primary)", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}