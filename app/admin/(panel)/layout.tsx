"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import "../../../styles/admin.css";

interface AdminUser {
  id: string;
  username: string;
  name: string;
}

const NAV_ITEMS = [
  {
    section: "Overview",
    items: [
      { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    ],
  },
  {
    section: "Management",
    items: [
      { href: "/admin/dashboard/drivers", label: "Drivers", icon: "🚗" },
      { href: "/admin/dashboard/riders", label: "Riders", icon: "👤" },
    ],
  },
  {
    section: "Insights",
    items: [
      { href: "/admin/dashboard/rides", label: "Recent Rides", icon: "🛣️" },
    ],
  },
];

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("wheelers_admin_token");
    const userStr = localStorage.getItem("wheelers_admin_user");

    if (!token || !userStr) {
      router.replace("/admin/login");
      return;
    }

    try {
      setAdmin(JSON.parse(userStr));
    } catch {
      router.replace("/admin/login");
      return;
    }

    setReady(true);
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("wheelers_admin_token");
    localStorage.removeItem("wheelers_admin_user");
    router.replace("/admin/login");
  }

  if (!ready) {
    return (
      <div className="admin-login-page">
        <p style={{ color: "#786F68" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <h1>Wheelers</h1>
          <p>Admin Panel</p>
        </div>

        <nav className="admin-sidebar-nav">
          {NAV_ITEMS.map((section) => (
            <div key={section.section}>
              <p className="admin-sidebar-section">{section.section}</p>
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`admin-nav-link ${
                    pathname === item.href ? "active" : ""
                  }`}
                >
                  <span className="admin-nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div
            style={{
              padding: "8px 12px",
              marginBottom: 8,
              fontSize: 13,
              color: "rgba(255,255,255,0.6)",
            }}
          >
            Signed in as <strong style={{ color: "#fff" }}>{admin?.name}</strong>
          </div>
          <button onClick={handleLogout} className="admin-logout-btn">
            <span className="admin-nav-icon">🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="admin-main">{children}</main>
    </div>
  );
}
