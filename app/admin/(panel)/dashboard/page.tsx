"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-api";

interface PlatformStats {
  totalUsers: number;
  totalRiders: number;
  totalDrivers: number;
  approvedDrivers: number;
  onlineDrivers: number;
  totalRides: number;
  completedRides: number;
  cancelledRides: number;
  activeRides: number;
  totalRevenueNgn: string;
  platformFeesNgn: string;
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

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const res = await adminFetch("/admin/analytics/platform");
      if (res.ok) {
        setStats(await res.json());
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

  if (!stats) {
    return <div className="admin-empty">Failed to load platform stats.</div>;
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1>Dashboard</h1>
        <p>Platform overview and key metrics</p>
      </div>

      <p className="admin-section-label">Users</p>
      <div className="admin-stats-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <div className="admin-stat-card">
          <p className="label">Total Users</p>
          <p className="value">{stats.totalUsers.toLocaleString()}</p>
        </div>
        <div className="admin-stat-card">
          <p className="label">Total Riders</p>
          <p className="value">{stats.totalRiders.toLocaleString()}</p>
        </div>
        <div className="admin-stat-card">
          <p className="label">Total Drivers</p>
          <p className="value">{stats.totalDrivers.toLocaleString()}</p>
        </div>
      </div>

      <p className="admin-section-label">Drivers</p>
      <div className="admin-stats-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <div className="admin-stat-card">
          <p className="label">Approved Drivers</p>
          <p className="value green">{stats.approvedDrivers.toLocaleString()}</p>
        </div>
        <div className="admin-stat-card">
          <p className="label">Online Drivers</p>
          <p className="value green">{stats.onlineDrivers.toLocaleString()}</p>
        </div>
        <div className="admin-stat-card">
          <p className="label">Active Rides</p>
          <p className="value orange">{stats.activeRides.toLocaleString()}</p>
        </div>
      </div>

      <p className="admin-section-label">Rides</p>
      <div className="admin-stats-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <div className="admin-stat-card">
          <p className="label">Total Rides</p>
          <p className="value">{stats.totalRides.toLocaleString()}</p>
        </div>
        <div className="admin-stat-card">
          <p className="label">Completed Rides</p>
          <p className="value green">{stats.completedRides.toLocaleString()}</p>
        </div>
        <div className="admin-stat-card">
          <p className="label">Cancelled Rides</p>
          <p className="value" style={{ color: "#FF3333" }}>
            {stats.cancelledRides.toLocaleString()}
          </p>
        </div>
      </div>

      <p className="admin-section-label">Revenue</p>
      <div className="admin-stats-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
        <div className="admin-stat-card">
          <p className="label">Total Revenue</p>
          <p className="value">{formatNaira(stats.totalRevenueNgn)}</p>
        </div>
        <div className="admin-stat-card">
          <p className="label">Platform Fees Earned</p>
          <p className="value orange">{formatNaira(stats.platformFeesNgn)}</p>
        </div>
      </div>
    </div>
  );
}
