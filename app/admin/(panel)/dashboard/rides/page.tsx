"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-api";

interface RecentRide {
  id: string;
  riderId: string;
  driverId: string | null;
  status: string;
  pickupAddress: string;
  destAddress: string;
  fareEstimateNgn: string | null;
  fareFinalNgn: string | null;
  platformFeeNgn: string | null;
  distanceKm: number | null;
  createdAt: string;
  completedAt: string | null;
}

function formatNaira(value: string | null) {
  if (!value) return "—";
  const num = parseFloat(value);
  if (isNaN(num)) return "—";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(num);
}

function getStatusBadge(status: string) {
  switch (status) {
    case "COMPLETED":
      return "admin-badge green";
    case "CANCELLED":
      return "admin-badge red";
    case "REQUESTED":
    case "MATCHING":
      return "admin-badge orange";
    case "IN_PROGRESS":
    case "DRIVER_EN_ROUTE":
    case "ARRIVED":
    case "DRIVER_ASSIGNED":
      return "admin-badge blue";
    case "DISPUTED":
      return "admin-badge red";
    default:
      return "admin-badge gray";
  }
}

export default function AdminRecentRidesPage() {
  const [rides, setRides] = useState<RecentRide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRides();
  }, []);

  async function fetchRides() {
    try {
      const res = await adminFetch("/admin/analytics/recent-rides");
      if (res.ok) {
        const data = await res.json();
        setRides(data.rides ?? []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="admin-spinner-wrap"><div className="admin-spinner"></div></div>;
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1>Recent Rides</h1>
        <p>Latest ride activity on the platform</p>
      </div>

      {rides.length === 0 ? (
        <div className="admin-empty">No rides found.</div>
      ) : (
        <div className="admin-table-card">
          <div className="admin-table-header">
            <h2>Rides</h2>
            <span className="count">{rides.length} rides</span>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Pickup</th>
                  <th>Destination</th>
                  <th>Distance</th>
                  <th>Fare</th>
                  <th>Platform Fee</th>
                </tr>
              </thead>
              <tbody>
                {rides.map((r) => (
                  <tr key={r.id}>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {new Date(r.createdAt).toLocaleDateString("en-NG", {
                        dateStyle: "medium",
                      })}
                    </td>
                    <td>
                      <span className={getStatusBadge(r.status)}>
                        {r.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td
                      style={{
                        maxWidth: 180,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={r.pickupAddress}
                    >
                      {r.pickupAddress}
                    </td>
                    <td
                      style={{
                        maxWidth: 180,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={r.destAddress}
                    >
                      {r.destAddress}
                    </td>
                    <td>
                      {r.distanceKm
                        ? `${r.distanceKm.toFixed(1)} km`
                        : "—"}
                    </td>
                    <td>{formatNaira(r.fareFinalNgn ?? r.fareEstimateNgn)}</td>
                    <td>{formatNaira(r.platformFeeNgn)}</td>
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
