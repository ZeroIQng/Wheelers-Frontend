"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface DriverDetail {
  driverId: string;
  userId: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  kycStatus: string;
  submission: {
    status: string;
    submittedAt: string | null;
    vehicleMake: string | null;
    vehicleModel: string | null;
    vehiclePlate: string | null;
    vehicleYear: number | null;
    ninImageUrl: string | null;
    licenceImageUrl: string | null;
    selfieUrl: string | null;
    rejectionReason: string | null;
  };
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://http://app.wheelersng.com";

export default function DriverReviewPage() {
  const params = useParams();
  const router = useRouter();
  const driverId = params.driverId as string;

  const [driver, setDriver] = useState<DriverDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  const adminKey =
    typeof window !== "undefined"
      ? localStorage.getItem("wheelers_admin_key") ?? ""
      : "";

  useEffect(() => {
    if (!adminKey) {
      router.push("/admin/drivers");
      return;
    }
    fetchDriver();
  }, [driverId]);

  async function fetchDriver() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/drivers/${driverId}`, {
        headers: { "x-admin-key": adminKey },
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setDriver(data);
    } catch {
      setDriver(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove() {
    setActionLoading(true);
    try {
      await fetch(`${API_BASE}/admin/drivers/${driverId}/approve`, {
        method: "POST",
        headers: { "x-admin-key": adminKey },
      });
      router.push("/admin/drivers");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReject() {
    if (!rejectReason.trim()) return;
    setActionLoading(true);
    try {
      await fetch(`${API_BASE}/admin/drivers/${driverId}/reject`, {
        method: "POST",
        headers: {
          "x-admin-key": adminKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason: rejectReason }),
      });
      router.push("/admin/drivers");
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) return <main style={styles.page}><p>Loading...</p></main>;
  if (!driver) return <main style={styles.page}><p>Driver not found.</p></main>;

  const sub = driver.submission;

  return (
    <main style={styles.page}>
      <button onClick={() => router.push("/admin/drivers")} style={styles.backBtn}>
        ← Back to list
      </button>

      <h1 style={styles.h1}>Driver Review</h1>

      <div style={styles.infoCard}>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Name</span>
          <span>{driver.name || "—"}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Phone</span>
          <span>{driver.phone || "—"}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Email</span>
          <span>{driver.email || "—"}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Vehicle</span>
          <span>
            {sub.vehicleMake} {sub.vehicleModel} ({sub.vehicleYear}) — {sub.vehiclePlate}
          </span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Status</span>
          <span style={{
            ...styles.badge,
            backgroundColor: sub.status === "SUBMITTED" ? "#FFF0E8" : sub.status === "APPROVED" ? "#E8FFF7" : "#FFF0F0",
            color: sub.status === "SUBMITTED" ? "#FF5C00" : sub.status === "APPROVED" ? "#00C48C" : "#FF3333",
          }}>
            {sub.status}
          </span>
        </div>
      </div>

      <h2 style={styles.h2}>Documents</h2>

      <div style={styles.docsGrid}>
        {sub.ninImageUrl && (
          <div style={styles.docCard}>
            <p style={styles.docLabel}>NIN Card</p>
            <img src={sub.ninImageUrl} alt="NIN" style={styles.docImg} />
          </div>
        )}
        {sub.licenceImageUrl && (
          <div style={styles.docCard}>
            <p style={styles.docLabel}>Driver's Licence</p>
            <img src={sub.licenceImageUrl} alt="Licence" style={styles.docImg} />
          </div>
        )}
        {sub.selfieUrl && (
          <div style={styles.docCard}>
            <p style={styles.docLabel}>Selfie</p>
            <img src={sub.selfieUrl} alt="Selfie" style={styles.docImg} />
          </div>
        )}
      </div>

      {sub.status === "SUBMITTED" && (
        <div style={styles.actions}>
          <button
            onClick={handleApprove}
            disabled={actionLoading}
            style={styles.approveBtn}
          >
            Approve Driver
          </button>

          {!showRejectForm ? (
            <button
              onClick={() => setShowRejectForm(true)}
              style={styles.rejectBtn}
            >
              Reject
            </button>
          ) : (
            <div style={styles.rejectForm}>
              <textarea
                placeholder="Reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                style={styles.textarea}
              />
              <button
                onClick={handleReject}
                disabled={actionLoading || !rejectReason.trim()}
                style={styles.rejectConfirmBtn}
              >
                Confirm Rejection
              </button>
            </div>
          )}
        </div>
      )}
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: 720,
    margin: "0 auto",
    padding: "40px 20px",
    fontFamily: "system-ui, sans-serif",
  },
  backBtn: {
    background: "none",
    border: "none",
    color: "#FF5C00",
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
    padding: 0,
    marginBottom: 20,
  },
  h1: {
    fontSize: 22,
    fontWeight: 700,
    margin: "0 0 20px",
  },
  h2: {
    fontSize: 16,
    fontWeight: 700,
    margin: "28px 0 12px",
  },
  infoCard: {
    border: "2px solid #E8DDD3",
    borderRadius: 14,
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 14,
  },
  infoLabel: {
    fontWeight: 700,
    fontSize: 12,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
    color: "#786F68",
  },
  badge: {
    fontSize: 11,
    fontWeight: 700,
    padding: "4px 10px",
    borderRadius: 999,
  },
  docsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 16,
  },
  docCard: {
    border: "2px solid #E8DDD3",
    borderRadius: 10,
    overflow: "hidden",
  },
  docLabel: {
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
    color: "#786F68",
    padding: "8px 12px",
    margin: 0,
    borderBottom: "1px solid #E8DDD3",
  },
  docImg: {
    width: "100%",
    height: 180,
    objectFit: "cover" as const,
  },
  actions: {
    marginTop: 32,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  approveBtn: {
    height: 48,
    backgroundColor: "#00C48C",
    color: "#fff",
    border: "2px solid #0D0D0D",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
  rejectBtn: {
    height: 44,
    backgroundColor: "transparent",
    color: "#FF3333",
    border: "2px solid #FF3333",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
  rejectForm: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  textarea: {
    minHeight: 80,
    border: "2px solid #E8DDD3",
    borderRadius: 10,
    padding: 12,
    fontSize: 13,
    resize: "vertical" as const,
  },
  rejectConfirmBtn: {
    height: 44,
    backgroundColor: "#FF3333",
    color: "#fff",
    border: "2px solid #0D0D0D",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
};
