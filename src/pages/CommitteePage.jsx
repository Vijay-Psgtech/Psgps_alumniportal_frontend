import { useState } from "react";

const MANAGING_COMMITTEE = [
  { name: "Shri. L. Gopalakrishnan", role: "Chairman" },
  { name: "Shri. Girish Eswaran", role: "Secretary" },
  { name: "Smt. Geetha Padmanaban", role: "Member" },
  { name: "Shri. V. Lakshminarayanaswamy", role: "Member" },
  { name: "Shri. Padmanabhan , Principal", role: "Member" },
  { name: "Shri. Mahesh, Principal", role: "Member" },
  { name: "Shri. E.H. Sathishkumar", role: "Member" },
  { name: "Smt. B. Velumani", role: "Member" },
  { name: "Smt. S. Veena", role: "Member" },
];

const PTA = [
  { name: "Shri. Example Name", role: "President" },
  { name: "Smt. Example Name", role: "Vice President" },
  { name: "Shri. Example Name", role: "Member" },
];

const TABS = [
  { key: "committee", label: "Managing Committee", data: MANAGING_COMMITTEE },
  { key: "pta", label: "PTA", data: PTA },
];

export default function CommitteePage() {
  const [activeTab, setActiveTab] = useState("committee");
  const active = TABS.find((t) => t.key === activeTab);

  return (
    <div
      style={{
        minHeight: "calc(100vh - 70px)",
        marginTop: "70px",
        padding: "48px 24px",
        background: "#F9FAFB",
        display: "flex",
        gap: "32px",
        alignItems: "flex-start",
        maxWidth: "1200px",
        margin: "70px auto 0",
      }}
    >
      {/* Sidebar tabs */}
      <aside
        style={{
          width: "240px",
          flexShrink: 0,
          background: "#fff",
          border: "1px solid #E5E7EB",
          borderTop: "3px solid #3B82F6",
          borderRadius: "6px",
          overflow: "hidden",
        }}
      >
        {TABS.map((tab) => {
          const isActive = tab.key === activeTab;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "16px 20px",
                background: "transparent",
                border: "none",
                borderBottom: "1px solid #F1F5F9",
                fontSize: "15px",
                fontWeight: isActive ? 600 : 500,
                color: isActive ? "#2563EB" : "#374151",
                cursor: "pointer",
                fontFamily: "'Poppins', 'Inter', sans-serif",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </aside>

      {/* Content */}
      <section style={{ flex: 1 }}>
        <h1
          style={{
            fontSize: "40px",
            fontWeight: 700,
            color: "#111827",
            marginBottom: "16px",
          }}
        >
          {active.label}
        </h1>
        <p
          style={{
            fontSize: "17px",
            lineHeight: 1.6,
            color: "#374151",
            maxWidth: "760px",
            marginBottom: "28px",
          }}
        >
          {activeTab === "committee"
            ? "SMC will work towards enhancing parents community participation in the school functioning and provide mechanisms for more effective management at school level."
            : "The PTA works to strengthen collaboration between parents and teachers in support of student learning and school activities."}
        </p>

        <div
          style={{
            height: "3px",
            background: "linear-gradient(90deg, #c9a84c, #e0c477)",
            marginBottom: "8px",
          }}
        />

        <div>
          {active.data.map((member, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 4px",
                borderBottom: "1px solid #E0F2FE",
              }}
            >
              <span style={{ fontSize: "15px", color: "#1F2937" }}>
                {member.name}
              </span>
              <span
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#374151",
                }}
              >
                {member.role}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}