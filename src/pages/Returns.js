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

function ListItem({ children }) {
  return (
    <li style={{ display: 'flex', gap: 12, marginBottom: 10, color: 'var(--gray-600)', lineHeight: 1.7 }}>
      <span style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 2 }}>◇</span>
      <span>{children}</span>
    </li>
  )
}

export default function Returns() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="page-fade">

        {/* Hero */}
        <section style={{ background: 'var(--black)', color: 'white', padding: 'clamp(64px, 10vw, 120px) 24px', textAlign: 'center' }}>
          <div className="container" style={{ maxWidth: 680 }}>
            <p style={{ fontSize: '0.72rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>
              Politika
            </p>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: 24, lineHeight: 1.2 }}>
              Povrat i zamjena
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.05rem', lineHeight: 1.8 }}>
              Tvoje zadovoljstvo nam je na prvom mjestu. Ako nešto nije u redu, tu smo.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="section" style={{ background: 'var(--cream)' }}>
          <div className="container" style={{ maxWidth: 760 }}>

            <Section eyebrow="Opšte" title="Rok za povrat">
              <p style={{ color: 'var(--gray-600)', lineHeight: 1.85, marginBottom: 12 }}>
                Prihvatamo povrat ili zamjenu u roku od <strong>14 dana</strong> od dana primitka paketa. Zahtjev za povrat treba nam poslati putem Instagrama ili emaila što prije.
              </p>
              <p style={{ color: 'var(--gray-600)', lineHeight: 1.85 }}>
                Nakon što potvrdi tvoj zahtjev, dogovaramo način povrata i slanja novog komada (ako je zamjena) ili povrat sredstava.
              </p>
            </Section>

            <Section eyebrow="Uvjeti" title="Kad je povrat moguć?">
              <p style={{ color: 'var(--gray-600)', lineHeight: 1.85, marginBottom: 16 }}>
                Povrat ili zamjena mogući su ako:
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <ListItem>Komad je stigao oštećen ili neispravan</ListItem>
                <ListItem>Isporučena je pogrešna veličina ili artikl</ListItem>
                <ListItem>Komad nije nošen, pranom i ima originalnu etiketu</ListItem>
                <ListItem>Javljaš se u roku od 14 dana od primitka</ListItem>
              </ul>
            </Section>

            <Section eyebrow="Izuzeci" title="Šta nije prihvatljivo za povrat?">
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <ListItem>Komadi koji su nošeni, oprani ili izmijenjeni</ListItem>
                <ListItem>Artikli bez originalne etikete</ListItem>
                <ListItem>Akcijski i sale artikli (osim u slučaju greške s naše strane)</ListItem>
                <ListItem>Narudžbe starije od 14 dana od primitka</ListItem>
              </ul>
            </Section>

            <Section eyebrow="Proces" title="Kako podnijeti zahtjev?">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { n: '01', title: 'Kontaktiraj nas', text: 'Pošalji nam DM na Instagramu ili email s brojem narudžbe i kratkim opisom razloga povrata.' },
                  { n: '02', title: 'Čekaj potvrdu', text: 'Odgovaramo u roku od 24h i potvrđujemo da li ispunjavaš uvjete za povrat.' },
                  { n: '03', title: 'Vrati paket', text: 'Pošalji nam komad na dogovorenu adresu. Troškove povratne dostave snosi kupac, osim u slučaju naše greške.' },
                  { n: '04', title: 'Povrat ili zamjena', text: 'Nakon što primimo i pregledamo paket, šaljemo novi komad ili vraćamo novac u roku od 5 radnih dana.' },
                ].map(s => (
                  <div key={s.n} style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--gold)', flexShrink: 0, lineHeight: 1.2 }}>{s.n}</span>
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>{s.title}</div>
                      <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>{s.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <div style={{ background: 'var(--black)', color: 'white', padding: '32px', textAlign: 'center' }}>
              <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 12, fontSize: '0.9rem' }}>
                Pitanje ili problem?
              </p>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--gold)' }}>
                Piši nam — riješit ćemo sve zajedno.
              </p>
            </div>

          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
