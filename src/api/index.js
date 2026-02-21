const BASE = "http://localhost:3004/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
}

export const api = {
  get:    (path)        => request(path),
  post:   (path, body)  => request(path, { method: "POST",   body: JSON.stringify(body) }),
  delete: (path)        => request(path, { method: "DELETE" }),
};

// Auth
export const authApi = {
  register: (body) => api.post("/auth/register", body),
  login:    (body) => api.post("/auth/login",    body),
  me:       ()     => api.get("/auth/me"),
};

// Employees
export const employeesApi = {
  getAll: () => api.get("/employees"),
};

// Feedbacks
export const feedbacksApi = {
  submit:     (body) => api.post("/feedbacks", body),
  getByEmployee: (id) => api.get(`/feedbacks/employee/${id}`),
  getAverage: (id)  => api.get(`/feedbacks/employee/${id}/average`),
  delete:     (id)  => api.delete(`/feedbacks/${id}`),
};