"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/admin-api";

interface DriverAnalytics {
  totalDrivers: number;
  pendingKyc: number;
  byKycStatus: Array<{ status: string; count: number }>;
  byStatus: Array<{ status: string; count: number }>;
  topDrivers: Array<{
    driverId: string;
    name: string | null;
    phone: string | null;
    email: string | null;
    totalRides: number;
    totalEarningsNgn: string;
    rating: number;
    kycStatus: string;
    status: string;
  }>;
}

interface PendingDriver {
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

function formatNaira(value: string) {
  const num = parseFloat(value);
  if (isNaN(num)) return "₦0.00";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(num);
}

function getStatusBadge(status: string) {
  switch (status) {
    case "APPROVED":
      return "admin-badge green";
    case "SUBMITTED":
    case "PENDING":
      return "admin-badge orange";
    case "REJECTED":
      return "admin-badge red";
    case "ONLINE":
      return "admin-badge green";
    case "ON_RIDE":
      return "admin-badge blue";
    case "OFFLINE":
      return "admin-badge gray";
    default:
      return "admin-badge gray";
  }
}

export default function AdminDriversPage() {
  const [analytics, setAnalytics] = useState<DriverAnalytics | null>(null);
  const [pending, setPending] = useState<PendingDriver[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [analyticsRes, pendingRes] = await Promise.all([
        adminFetch("/admin/analytics/drivers"),
        adminFetch("/admin/drivers"),
      ]);

      if (analyticsRes.ok) {
        setAnalytics(await analyticsRes.json());
      }
      if (pendingRes.ok) {
        const data = await pendingRes.json();
        setPending(data.drivers ?? []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="admin-loading">Loading driver data...</div>;
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1>Drivers</h1>
        <p>Driver analytics, KYC reviews, and top performers</p>
      </div>

      {/* Stats row */}
      {analytics && (
        <>
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <p className="label">Total Drivers</p>
              <p className="value">{analytics.totalDrivers}</p>
            </div>
            <div className="admin-stat-card">
              <p className="label">Pending KYC</p>
              <p className="value orange">{analytics.pendingKyc}</p>
            </div>
            {analytics.byKycStatus.map((s) => (
              <div className="admin-stat-card" key={s.status}>
                <p className="label">KYC {s.status}</p>
                <p className="value">{s.count}</p>
              </div>
            ))}
          </div>

          <div className="admin-stats-grid">
            {analytics.byStatus.map((s) => (
              <div className="admin-stat-card" key={s.status}>
                <p className="label">{s.status}</p>
                <p className="value">{s.count}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Pending KYC table */}
      {pending.length > 0 && (
        <div className="admin-table-card">
          <div className="admin-table-header">
            <h2>Pending KYC Applications</h2>
            <span className="count">{pending.length} pending</span>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Vehicle</th>
                  <th>Submitted</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((d) => (
                  <tr
                    key={d.driverId}
                    onClick={() => window.location.href = `/admin/dashboard/drivers/${d.driverId}`}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{d.name || "—"}</td>
                    <td>{d.phone || d.email || "—"}</td>
                    <td>
                      {d.vehicleMake} {d.vehicleModel}{" "}
                      {d.vehicleYear ? `(${d.vehicleYear})` : ""}{" "}
                      {d.vehiclePlate ? `— ${d.vehiclePlate}` : ""}
                    </td>
                    <td>
                      {d.submittedAt
                        ? new Date(d.submittedAt).toLocaleDateString("en-NG", {
                            dateStyle: "medium",
                          })
                        : "—"}
                    </td>
                    <td>
                      <Link
                        href={`/admin/dashboard/drivers/${d.driverId}`}
                        className="admin-review-link"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Top drivers */}
      {analytics && analytics.topDrivers.length > 0 && (
        <div className="admin-table-card">
          <div className="admin-table-header">
            <h2>Top Drivers</h2>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Rides</th>
                  <th>Earnings</th>
                  <th>Rating</th>
                  <th>KYC</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {analytics.topDrivers.map((d) => (
                  <tr key={d.driverId}>
                    <td>{d.name || "—"}</td>
                    <td>{d.phone || d.email || "—"}</td>
                    <td>{d.totalRides}</td>
                    <td>{formatNaira(d.totalEarningsNgn)}</td>
                    <td>⭐ {d.rating.toFixed(1)}</td>
                    <td>
                      <span className={getStatusBadge(d.kycStatus)}>
                        {d.kycStatus}
                      </span>
                    </td>
                    <td>
                      <span className={getStatusBadge(d.status)}>
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
