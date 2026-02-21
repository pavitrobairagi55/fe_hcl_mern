import { useState } from "react";
import { authApi } from "../api";
import { toast } from "../hooks/useToast";
import { Field, Spinner } from "../components/UI";
import { validateEmail } from "../utils";

export function LoginPage({ onLogin, onSwitch }) {
  const [form, setForm]     = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.email.trim())          e.email    = "Email is required";
    else if (!validateEmail(form.email)) e.email = "Enter a valid email";
    if (!form.password)              e.password = "Password is required";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setLoading(true);
    try {
      const data = await authApi.login(form);
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
      <div style={{ width: "100%", maxWidth: 380 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Sign in</h1>
        <p className="text-muted text-sm" style={{ marginBottom: 28 }}>Enter your credentials to continue</p>

        <form onSubmit={handleSubmit} noValidate>
          <Field label="Email" error={errors.email}>
            <input
              type="email"
              className={errors.email ? "input-error" : ""}
              value={form.email}
              onChange={set("email")}
              placeholder="you@company.com"
              autoFocus
            />
          </Field>

          <Field label="Password" error={errors.password}>
            <input
              type="password"
              className={errors.password ? "input-error" : ""}
              value={form.password}
              onChange={set("password")}
              placeholder="••••••••"
            />
          </Field>

          <button type="submit" className="btn btn-primary btn-block mt-4" disabled={loading}>
            {loading ? <><Spinner /> Signing in…</> : "Sign In"}
          </button>
        </form>

        <p className="text-muted text-sm" style={{ marginTop: 20, textAlign: "center" }}>
          No account?{" "}
          <button
            type="button"
            onClick={onSwitch}
            style={{ background: "none", border: "none", color: "var(--primary)", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
}