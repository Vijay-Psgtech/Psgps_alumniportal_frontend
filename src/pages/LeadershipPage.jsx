import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Patrons } from "../content/data/PatronsData";
import usePageTitle from "../hooks/usePageTitle";
import SiteNavbar from "../components/SiteNavbar";

const groups = [
  { title: "Office Bearers", rank: "Office Bearer" },
  { title: "Executive Committee", rank: "Executive Committee" },
];

function LeadershipPage() {
  usePageTitle("Leadership Team");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const featuredLeaders = Patrons.filter((patron) =>
    ["Chairman", "Principal"].includes(patron.rank)
  );

  const otherMembers = Patrons.filter(
    (patron) => !["Chairman", "Principal"].includes(patron.rank)
  );

  return (
    <div className="leadership-page">
      <SiteNavbar />

      <header className="leadership-hero">
        <div className="leadership-hero-inner">
          <span className="leadership-kicker">PSGPS Alumni Association</span>
          <h1>Leadership</h1>
          <p>
            Guided by strong values and a shared commitment to excellence, our leaders
            keep the PSG alumni community connected, active, and future-ready.
          </p>
        </div>
      </header>

      <main className="leadership-content">
        <div className="leadership-intro">
          <span className="leadership-overline">Institutional leadership</span>
          <h2>Guiding the legacy</h2>
        </div>

        {featuredLeaders.length > 0 && (
          <section className="featured-leaders" aria-labelledby="leadership-featured-title">
            <div id="leadership-featured-title" className="sr-only">
              Featured leaders
            </div>
            {featuredLeaders.map((leader) => (
              <article className="featured-leader-card" key={leader.name}>
                <div className="featured-photo">
                  <img src={leader.image} alt={leader.name} />
                </div>
                <div className="featured-copy">
                  <span className="featured-role">{leader.role}</span>
                  <h3>{leader.name}</h3>
                  <strong>{leader.note}</strong>
                  <p>{leader.bio}</p>
                </div>
              </article>
            ))}
          </section>
        )}

        <section className="leadership-groups" aria-labelledby="leadership-directory-title">
          <div className="leadership-group-header">
            <h3 id="leadership-directory-title">Leadership hierarchy</h3>
            <span>{String(otherMembers.length).padStart(2, "0")}</span>
          </div>

          {groups.map((group) => {
            const members = otherMembers.filter((patron) => patron.rank === group.rank);
            return members.length > 0 ? (
              <LeadershipGroup key={group.title} title={group.title} members={members} />
            ) : null;
          })}
        </section>
      </main>

      <footer className="leadership-footer">
        <p>Strong roots. Shared journey. Limitless impact.</p>
        <Link to="/#join">
          Connect with the community <span aria-hidden="true">&#8594;</span>
        </Link>
      </footer>
    </div>
  );
}

function LeadershipGroup({ title, members }) {
  return (
    <section className="leadership-group" aria-labelledby={`group-${title}`}>
      <div className="leadership-group-header">
        <h3 id={`group-${title}`}>{title}</h3>
        <span>{String(members.length).padStart(2, "0")}</span>
      </div>
      <div className="leadership-role-list">
        {members.map((member) => (
          <article className="member-card" key={member.name}>
            <div className="member-photo">
              <img src={member.image} alt={member.name} loading="lazy" />
            </div>
            <div className="member-copy">
              <span className="member-role-badge">{member.role}</span>
              <h4>{member.name}</h4>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default LeadershipPage;
