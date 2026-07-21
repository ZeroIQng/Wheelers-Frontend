"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface DriverSubmission {
  driverId: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  vehicleMake: string | null;
  vehicleModel: string | null;
  vehiclePlate: string | null;
  vehicleYear: number | null;
  status: string;
  submittedAt: string | null;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://http://app.wheelersng.com";

export default function AdminDriversPage() {
  const [drivers, setDrivers] = useState<DriverSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminKey, setAdminKey] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("wheelers_admin_key");
    if (stored) {
      setAdminKey(stored);
      fetchDrivers(stored);
    } else {
      setLoading(false);
    }
  }, []);

  async function fetchDrivers(key: string) {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/drivers`, {
        headers: { "x-admin-key": key },
      });
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      setDrivers(data.drivers ?? []);
    } catch {
      setDrivers([]);
    } finally {
      setLoading(false);
    }
  }

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const key = form.get("key") as string;
    localStorage.setItem("wheelers_admin_key", key);
    setAdminKey(key);
    fetchDrivers(key);
  }

  if (!adminKey) {
    return (
      <main style={styles.page}>
        <div style={styles.loginCard}>
          <h1 style={styles.h1}>Admin Login</h1>
          <form onSubmit={handleLogin} style={styles.form}>
            <input
              name="key"
              type="password"
              placeholder="Admin API Key"
              style={styles.input}
              required
            />
            <button type="submit" style={styles.button}>
              Sign In
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.header}>
        <div>
          <p style={styles.eyebrow}>Wheelers Admin</p>
          <h1 style={styles.h1}>Pending Driver Applications</h1>
        </div>
        <span style={styles.count}>{drivers.length} pending</span>
      </div>

      {loading ? (
        <p style={styles.loading}>Loading...</p>
      ) : drivers.length === 0 ? (
        <p style={styles.empty}>No pending applications.</p>
      ) : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Vehicle</th>
                <th style={styles.th}>Submitted</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((d) => (
                <tr key={d.driverId}>
                  <td style={styles.td}>{d.name || "—"}</td>
                  <td style={styles.td}>{d.phone || d.email || "—"}</td>
                  <td style={styles.td}>
                    {d.vehicleMake} {d.vehicleModel} ({d.vehicleYear}) — {d.vehiclePlate}
                  </td>
                  <td style={styles.td}>
                    {d.submittedAt
                      ? new Date(d.submittedAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td style={styles.td}>
                    <Link
                      href={`/admin/drivers/${d.driverId}`}
                      style={styles.reviewLink}
                    >
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: 960,
    margin: "0 auto",
    padding: "40px 20px",
    fontFamily: "system-ui, sans-serif",
  },
  loginCard: {
    maxWidth: 360,
    margin: "120px auto",
    padding: 32,
    border: "2px solid #E8DDD3",
    borderRadius: 14,
  },
  h1: {
    fontSize: 22,
    fontWeight: 700,
    margin: "0 0 16px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  input: {
    height: 44,
    border: "2px solid #0D0D0D",
    borderRadius: 10,
    padding: "0 14px",
    fontSize: 14,
  },
  button: {
    height: 48,
    backgroundColor: "#FF5C00",
    color: "#fff",
    border: "2px solid #0D0D0D",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: "uppercase" as const,
    color: "#786F68",
    marginBottom: 4,
  },
  count: {
    fontSize: 13,
    fontWeight: 600,
    color: "#FF5C00",
    backgroundColor: "#FFF0E8",
    padding: "6px 12px",
    borderRadius: 999,
  },
  loading: { color: "#786F68" },
  empty: { color: "#786F68", textAlign: "center" as const, marginTop: 60 },
  tableWrap: {
    overflowX: "auto",
    border: "2px solid #E8DDD3",
    borderRadius: 14,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 13,
  },
  th: {
    textAlign: "left" as const,
    padding: "12px 14px",
    borderBottom: "1px solid #E8DDD3",
    fontWeight: 700,
    fontSize: 11,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
    color: "#786F68",
  },
  td: {
    padding: "12px 14px",
    borderBottom: "1px solid #E8DDD3",
  },
  reviewLink: {
    color: "#FF5C00",
    fontWeight: 700,
    textDecoration: "none",
  },
};
