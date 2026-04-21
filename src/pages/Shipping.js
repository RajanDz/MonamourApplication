import AnnouncementBar from '../components/AnnouncementBar'
import Header from '../components/Header'
import Footer from '../components/Footer'

function Section({ eyebrow, title, children }) {
  return (
    <div style={{ marginBottom: 48, paddingBottom: 48, borderBottom: '1px solid var(--gray-200)' }}>
      <p style={{ fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>
        {eyebrow}
      </p>
      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: 20 }}>{title}</h2>
      {children}
    </div>
  )
}

export default function Shipping() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="page-fade">

        {/* Hero */}
        <section style={{ background: 'var(--black)', color: 'white', padding: 'clamp(64px, 10vw, 120px) 24px', textAlign: 'center' }}>
          <div className="container" style={{ maxWidth: 680 }}>
            <p style={{ fontSize: '0.72rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>
              Informacije
            </p>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: 24, lineHeight: 1.2 }}>
              Dostava
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.05rem', lineHeight: 1.8 }}>
              Sve što trebaš znati o isporuci i rokovima dostave.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="section" style={{ background: 'var(--cream)' }}>
          <div className="container" style={{ maxWidth: 760 }}>

            <Section eyebrow="Kako naručiti" title="Narudžbe putem Instagrama">
              <p style={{ color: 'var(--gray-600)', lineHeight: 1.85, marginBottom: 12 }}>
                Sve narudžbe primamo direktno putem Instagrama. Kada pronađeš komad koji ti se sviđa, pošalji nam DM poruku s nazivom proizvoda ili screenshotom, i naš tim će ti odgovoriti u roku od nekoliko sati.
              </p>
              <p style={{ color: 'var(--gray-600)', lineHeight: 1.85 }}>
                Nakon potvrde narudžbe, dogovaramo detalje dostave i plaćanje. Plaćanje je moguće putem bankovne transakcije ili pouzećem, ovisno o lokaciji.
              </p>
            </Section>

            <Section eyebrow="Rokovi" title="Kada stižu paketi?">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 20 }}>
                {[
                  { region: 'Bosna i Hercegovina', time: '2 – 4 radna dana' },
                  { region: 'Hrvatska / Srbija', time: '3 – 5 radnih dana' },
                  { region: 'Ostatak regije', time: '5 – 7 radnih dana' },
                ].map(r => (
                  <div key={r.region} style={{ background: 'white', padding: '20px 24px', borderLeft: '3px solid var(--gold)' }}>
                    <div style={{ fontWeight: 600, marginBottom: 4, fontSize: '0.9rem' }}>{r.region}</div>
                    <div style={{ color: 'var(--gold)', fontFamily: 'var(--font-serif)', fontSize: '1rem' }}>{r.time}</div>
                  </div>
                ))}
              </div>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.88rem', lineHeight: 1.7 }}>
                * Rokovi su okvirni i mogu varirati u zavisnosti od kurirske službe i gužvi (praznici, sezone). O svakom paketu ćeš dobiti broj za praćenje.
              </p>
            </Section>

            <Section eyebrow="Troškovi" title="Cijena dostave">
              <p style={{ color: 'var(--gray-600)', lineHeight: 1.85, marginBottom: 12 }}>
                Cijena dostave ovisi o lokaciji i težini paketa. Tačnu cijenu ćemo ti javiti pri potvrdi narudžbe.
              </p>
              <p style={{ color: 'var(--gray-600)', lineHeight: 1.85 }}>
                Za narudžbe iznad određenog iznosa dostava može biti besplatna — pitaj nas u DM-u za aktuelne uvjete.
              </p>
            </Section>

            <Section eyebrow="Pakovanje" title="Kako pakujemo?">
              <p style={{ color: 'var(--gray-600)', lineHeight: 1.85 }}>
                Svaki komad je pažljivo upakovan u zaštitnu ambalažu kako bi stigao u savršenom stanju. Posebni naručeni paketi za poklone dostupni su na zahtjev.
              </p>
            </Section>

            <div style={{ background: 'var(--black)', color: 'white', padding: '32px', textAlign: 'center' }}>
              <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 12, fontSize: '0.9rem' }}>
                Imaš pitanje o dostavi?
              </p>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--gold)' }}>
                Piši nam na Instagramu — odgovaramo brzo.
              </p>
            </div>

          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
