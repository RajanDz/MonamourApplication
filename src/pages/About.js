import AnnouncementBar from '../components/AnnouncementBar'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function About() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="page-fade">

        {/* Hero */}
        <section style={{ background: 'var(--black)', color: 'white', padding: 'clamp(64px, 10vw, 120px) 24px', textAlign: 'center' }}>
          <div className="container" style={{ maxWidth: 680 }}>
            <p style={{ fontSize: '0.72rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>
              Naša priča
            </p>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: 24, lineHeight: 1.2 }}>
              O nama
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.05rem', lineHeight: 1.8 }}>
              Mon Amour je nastao iz ljubavi prema modi i želje da svaka žena pronađe komad koji govori upravo o njoj.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="section" style={{ background: 'var(--cream)' }}>
          <div className="container" style={{ maxWidth: 760 }}>
            <div className="section-header">
              <p className="section-eyebrow">Ko smo mi</p>
              <h2 className="section-title">Naša misija</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, color: 'var(--gray-600)', lineHeight: 1.85, fontSize: '0.97rem' }}>
              <p>
                Mon Amour je mali boutique brend posvećen pažljivo odabranim modnim komadima koji spajaju eleganciju i svakodnevnu nosivost. Svaki komad prolazi ručnu selekciju — biramo samo ono u šta bismo i same ponijele.
              </p>
              <p>
                Vjerujemo da moda ne mora biti komplikovana. Pravi komad oblači te s lakoćom, daje samopouzdanje i ostaje u garderobi godinama. Zato ne pratimo svaki trend — pratimo kvalitet, liniju i osjećaj.
              </p>
              <p>
                Sve narudžbe primamo putem Instagrama kako bismo svakom kupcu pružili ličan pristup, savjet i pravovremenu komunikaciju. Nije to samo kupovina — to je iskustvo.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="section">
          <div className="container">
            <div className="section-header">
              <p className="section-eyebrow">Što nas pokreće</p>
              <h2 className="section-title">Naše vrijednosti</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32 }}>
              {[
                { icon: '◇', title: 'Kvalitet', text: 'Biramo materijale i izradu koji traju — ne modu koja se troši za sezonu.' },
                { icon: '♡', title: 'Ličan pristup', text: 'Svaka kupovina je razgovor. Tu smo da pomognemo pri odabiru.' },
                { icon: '✦', title: 'Autentičnost', text: 'Nema lažnih popusta ni vještačke hitnosti. Samo pravi komadi po poštenim cijenama.' },
                { icon: '◎', title: 'Pažljivost', text: 'Svaki paket slažemo s pažnjom — jer unboxing je dio iskustva.' },
              ].map(v => (
                <div key={v.title} style={{ padding: '32px 24px', background: 'var(--cream)', borderTop: '2px solid var(--gold)' }}>
                  <div style={{ fontSize: '1.5rem', color: 'var(--gold)', marginBottom: 12 }}>{v.icon}</div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', marginBottom: 10 }}>{v.title}</h3>
                  <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', lineHeight: 1.7 }}>{v.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Instagram CTA */}
        <section className="section-sm" style={{ background: 'var(--black)', color: 'white', textAlign: 'center' }}>
          <div className="container" style={{ maxWidth: 520 }}>
            <p style={{ fontSize: '0.72rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>
              Pronađi nas
            </p>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.4rem, 3vw, 2rem)', marginBottom: 16 }}>
              Pratite nas na Instagramu
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 28, fontSize: '0.95rem' }}>
              Sve nove kolekcije, inspiracije i narudžbe — sve na jednom mjestu.
            </p>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gold"
            >
              @monamour
            </a>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
