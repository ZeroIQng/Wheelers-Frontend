import { getWaitlistSubmissions } from "@/lib/waitlist-db";
import "../../styles/waitlist-admin.css";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function formatArray(value: string[]) {
  if (!value || value.length === 0) return "—";
  return value.join(", ");
}

function formatThoughts(value: Record<string, string>) {
  const entries = Object.entries(value).filter(([, text]) => text?.trim());

  if (entries.length === 0) return "—";

  return entries
    .map(([key, text]) => {
      const label = key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (char) => char.toUpperCase());

      return `${label}: ${text}`;
    })
    .join(" | ");
}

function formatDate(value: string) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function WaitlistAdminPage() {
  const submissions = await getWaitlistSubmissions();

  return (
    <main className="waitlist-admin-page">
      <section className="waitlist-admin-header">
        <div>
          <p className="waitlist-admin-eyebrow">Wheelers Admin</p>
          <h1>Waitlist Submissions</h1>
          <p>
            View all submitted waitlist survey responses, contact details,
            answers, and user thoughts.
          </p>
        </div>

        <div className="waitlist-admin-count-card">
          <span>Total Responses</span>
          <strong>{submissions.length}</strong>
        </div>
      </section>

      <section className="waitlist-admin-table-card">
        <div className="waitlist-admin-table-top">
          <h2>Responses</h2>
          <p>Latest submissions appear first.</p>
        </div>

        <div className="waitlist-admin-table-wrap">
          <table className="waitlist-admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Transport Choice</th>
                <th>Price Impact</th>
                <th>Ride-Hailing Pain</th>
                <th>EV Trust Tradeoff</th>
                <th>Ikeja-Lekki Price</th>
                <th>Ride Sharing Behavior</th>
                <th>Group Ride Acceptance</th>
                <th>Question Thoughts</th>
                <th>Optional Feedback</th>
                <th>Contact Consent</th>
              </tr>
            </thead>

            <tbody>
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan={14} className="waitlist-admin-empty-cell">
                    No waitlist submissions yet.
                  </td>
                </tr>
              ) : (
                submissions.map((item) => (
                  <tr key={item.id}>
                    <td>{formatDate(item.submittedAt)}</td>
                    <td className="waitlist-admin-name">{item.name}</td>
                    <td>
                      <a href={`mailto:${item.email}`}>{item.email}</a>
                    </td>
                    <td>{item.phone || "—"}</td>
                    <td>{formatArray(item.transportChoice)}</td>
                    <td>{formatArray(item.priceImpact)}</td>
                    <td>{formatArray(item.rideHailingPain)}</td>
                    <td>{formatArray(item.evTrustTradeoff)}</td>
                    <td>{formatArray(item.ikejaLekkiPrice)}</td>
                    <td>{formatArray(item.rideSharingBehavior)}</td>
                    <td>{formatArray(item.groupRideAcceptance)}</td>
                    <td>{formatThoughts(item.questionThoughts)}</td>
                    <td>{item.optionalFeedback || "—"}</td>
                    <td>
                      <span
                        className={
                          item.allowContact
                            ? "waitlist-admin-badge yes"
                            : "waitlist-admin-badge no"
                        }
                      >
                        {item.allowContact ? "Yes" : "No"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}