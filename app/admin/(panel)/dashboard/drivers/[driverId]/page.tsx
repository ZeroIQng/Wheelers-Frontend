"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminFetch, getToken } from "@/lib/admin-api";

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

const REJECTABLE_FIELDS = [
  { key: "nin", label: "NIN Card" },
  { key: "licence", label: "Driver's Licence" },
  { key: "selfie", label: "Selfie" },
  { key: "vehicle", label: "Vehicle Info" },
];

function getStatusBadge(status: string) {
  switch (status) {
    case "APPROVED":
      return "admin-badge green";
    case "SUBMITTED":
      return "admin-badge orange";
    case "REJECTED":
      return "admin-badge red";
    default:
      return "admin-badge gray";
  }
}

export default function DriverReviewPage() {
  const params = useParams();
  const router = useRouter();
  const driverId = params.driverId as string;

  const [driver, setDriver] = useState<DriverDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectedFields, setRejectedFields] = useState<string[]>([]);
  const [showRejectForm, setShowRejectForm] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.push("/admin/login");
      return;
    }
    fetchDriver();
  }, [driverId]);

  async function fetchDriver() {
    setLoading(true);
    try {
      const res = await adminFetch(`/admin/drivers/${driverId}`);
      if (res.ok) {
        setDriver(await res.json());
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove() {
    setActionLoading(true);
    try {
      await adminFetch(`/admin/drivers/${driverId}/approve`, {
        method: "POST",
      });
      router.push("/admin/dashboard/drivers");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReject() {
    if (!rejectReason.trim()) return;
    setActionLoading(true);
    try {
      await adminFetch(`/admin/drivers/${driverId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: rejectReason,
          rejectedFields,
        }),
      });
      router.push("/admin/dashboard/drivers");
    } finally {
      setActionLoading(false);
    }
  }

  function toggleField(field: string) {
    setRejectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  }

  if (loading) return <div className="admin-loading">Loading driver...</div>;
  if (!driver) return <div className="admin-empty">Driver not found.</div>;

  const sub = driver.submission;

  return (
    <div>
      <button
        onClick={() => router.push("/admin/dashboard/drivers")}
        className="admin-back-btn"
      >
        ← Back to drivers
      </button>

      <div className="admin-page-header">
        <h1>Driver Review</h1>
        <p>{driver.name || "Unknown"} — {driver.phone || driver.email || "No contact"}</p>
      </div>

      <div className="admin-info-card">
        <div className="admin-info-row">
          <span className="admin-info-label">Name</span>
          <span>{driver.name || "—"}</span>
        </div>
        <div className="admin-info-row">
          <span className="admin-info-label">Phone</span>
          <span>{driver.phone || "—"}</span>
        </div>
        <div className="admin-info-row">
          <span className="admin-info-label">Email</span>
          <span>{driver.email || "—"}</span>
        </div>
        <div className="admin-info-row">
          <span className="admin-info-label">Vehicle</span>
          <span>
            {sub.vehicleMake} {sub.vehicleModel}{" "}
            {sub.vehicleYear ? `(${sub.vehicleYear})` : ""}{" "}
            {sub.vehiclePlate ? `— ${sub.vehiclePlate}` : ""}
          </span>
        </div>
        <div className="admin-info-row">
          <span className="admin-info-label">Status</span>
          <span className={getStatusBadge(sub.status)}>{sub.status}</span>
        </div>
        {sub.submittedAt && (
          <div className="admin-info-row">
            <span className="admin-info-label">Submitted</span>
            <span>
              {new Date(sub.submittedAt).toLocaleDateString("en-NG", {
                dateStyle: "medium",
              })}
            </span>
          </div>
        )}
        {sub.rejectionReason && (
          <div className="admin-info-row">
            <span className="admin-info-label">Rejection Reason</span>
            <span style={{ color: "#FF3333" }}>{sub.rejectionReason}</span>
          </div>
        )}
      </div>

      <div className="admin-page-header" style={{ marginTop: 8 }}>
        <h1 style={{ fontSize: 18 }}>Documents</h1>
      </div>

      <div className="admin-docs-grid">
        {sub.ninImageUrl && (
          <div className="admin-doc-card">
            <p className="admin-doc-label">NIN Card</p>
            <img src={sub.ninImageUrl} alt="NIN" className="admin-doc-img" />
          </div>
        )}
        {sub.licenceImageUrl && (
          <div className="admin-doc-card">
            <p className="admin-doc-label">Driver&apos;s Licence</p>
            <img
              src={sub.licenceImageUrl}
              alt="Licence"
              className="admin-doc-img"
            />
          </div>
        )}
        {sub.selfieUrl && (
          <div className="admin-doc-card">
            <p className="admin-doc-label">Selfie</p>
            <img src={sub.selfieUrl} alt="Selfie" className="admin-doc-img" />
          </div>
        )}
      </div>

      {sub.status === "SUBMITTED" && (
        <div className="admin-actions">
          <button
            onClick={handleApprove}
            disabled={actionLoading}
            className="admin-btn-approve"
          >
            {actionLoading ? "Processing..." : "Approve Driver"}
          </button>

          {!showRejectForm ? (
            <button
              onClick={() => setShowRejectForm(true)}
              className="admin-btn-reject"
            >
              Reject
            </button>
          ) : (
            <div className="admin-reject-form">
              <div className="field-checks">
                {REJECTABLE_FIELDS.map((f) => (
                  <label key={f.key} className="field-check">
                    <input
                      type="checkbox"
                      checked={rejectedFields.includes(f.key)}
                      onChange={() => toggleField(f.key)}
                    />
                    {f.label}
                  </label>
                ))}
              </div>
              <textarea
                placeholder="Reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
              <button
                onClick={handleReject}
                disabled={actionLoading || !rejectReason.trim()}
                className="admin-btn-confirm-reject"
              >
                {actionLoading ? "Processing..." : "Confirm Rejection"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
