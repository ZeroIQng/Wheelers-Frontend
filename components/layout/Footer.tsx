import Link from "next/link";

const footerColumns = [
  {
    title: "Product",
    links: ["For Riders", "For Drivers", "DeFi Features", "Schedule Rides"],
  },
  {
    title: "Company",
    links: ["About", "Blog", "Careers", "Press", "Community"],
  },
  {
    title: "Support",
    links: ["Help Center", "Safety", "Privacy Policy", "Terms of Service", "Contact"],
  },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-wordmark clash-display">WHELEERS</div>
          <div className="footer-tagline">ride. earn. own.</div>
          <p className="footer-body">
            The first community-owned ride-hailing platform. Built on the blockchain.
            Powered by its users.
          </p>
        </div>

        {footerColumns.map((column) => (
          <div className="footer-col" key={column.title}>
            <h4>{column.title}</h4>
            {column.links.map((link) => (
              <Link href="#" key={link}>
                {link}
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div className="footer-bottom">
        <p>(c) 2025 Wheleers | All rights reserved</p>
        <div className="footer-social">
          {["X", "in", "ig", "tg"].map((label) => (
            <Link href="#" className="social-btn" key={label}>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
