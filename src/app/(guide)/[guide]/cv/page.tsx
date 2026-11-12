import type { Metadata } from "next";
import Link from "next/link";
import PrintButton from "@/components/PrintButton";
import { ui } from "@/content/ui";
import { initials } from "@/lib/site";
import { getSiteContent } from "@/sanity/content";
import styles from "./cv.module.css";

type Params = Promise<{ guide: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { guide } = await params;
  return { title: ui.cv.title, alternates: { canonical: `/${guide}/cv` } };
}

export default async function CvPage({ params }: { params: Params }) {
  const { guide: slug } = await params; // validated by the layout
  const { guide, credentials, expertise } = await getSiteContent(slug);

  return (
    <main className={styles.page}>
      <div className={`${styles.toolbar} no-print`}>
        <Link href={`/${slug}`} className="btn btn--outline btn--sm">
          ← {ui.cv.back}
        </Link>
        <PrintButton label={ui.cv.print} />
      </div>

      <article className={styles.sheet}>
        <header className={styles.header}>
          <span className={styles.monogram} aria-hidden>
            {initials(guide.name)}
          </span>
          <div>
            <p className={styles.docType}>{ui.cv.title}</p>
            <h1>{guide.name}</h1>
            <p className={styles.role}>{guide.title}</p>
          </div>
        </header>

        <div className={styles.columns}>
          <aside className={styles.side}>
            <section>
              <h2>{ui.cv.contact}</h2>
              <p>{guide.contact.phone}</p>
              <p>{guide.contact.email}</p>
              <p>{guide.location}</p>
            </section>
            <section>
              <h2>{ui.cv.languages}</h2>
              <ul>
                {guide.languages.map((l) => (
                  <li key={l.code}>
                    <strong>{l.name}</strong> ({ui.expertise.proficiency[l.proficiency]})
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h2>{ui.cv.specialties}</h2>
              <ul>
                {expertise.map((e) => (
                  <li key={e.id}>{e.title}</li>
                ))}
              </ul>
            </section>
          </aside>

          <div className={styles.main}>
            <section>
              <h2>{ui.cv.profile}</h2>
              {guide.bio.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </section>
            <section>
              <h2>{ui.cv.experience}</h2>
              <ul className={styles.timeline}>
                {guide.experience.map((j, i) => (
                  <li key={i}>
                    <span className={styles.years}>{j.years}</span>
                    <strong>{j.role}</strong>
                    <span>{j.place}</span>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h2>{ui.cv.credentials}</h2>
              <ul className={styles.creds}>
                {credentials.map((c) => (
                  <li key={c.id}>
                    <strong>{c.title}</strong>
                    <span>
                      {c.issuer}
                      {c.year ? ` · ${c.year}` : ""}
                      {c.reference ? ` · ${c.reference}` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </article>
    </main>
  );
}
