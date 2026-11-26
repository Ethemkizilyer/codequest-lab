const quests = [
  { title: "API kaşifi", detail: "İlk endpoint'ini tasarla", level: "Başlangıç" },
  { title: "Veri mimarı", detail: "İlişkisel modeli kur", level: "Orta" },
  { title: "Deploy ustası", detail: "Uygulamanı yayına al", level: "İleri" },
];

export default function HomePage() {
  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">CODEQUEST LAB / 001</p>
        <h1>Kod yazmayı değil, sistem kurmayı öğren.</h1>
        <p className="intro">
          Gerçek ürünler geliştirirken backend, frontend ve mimari kararları
          küçük görevlerle keşfet.
        </p>
        <button className="primary-button" type="button">
          İlk göreve başla <span aria-hidden="true">→</span>
        </button>
      </section>

      <section className="quest-section" aria-labelledby="quest-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">ÖĞRENME ROTASI</p>
            <h2 id="quest-heading">Bugünün görevleri</h2>
          </div>
          <span className="progress">0 / 3 tamamlandı</span>
        </div>
        <div className="quest-grid">
          {quests.map((quest, index) => (
            <article className="quest-card" key={quest.title}>
              <span className="quest-number">0{index + 1}</span>
              <span className="level">{quest.level}</span>
              <h3>{quest.title}</h3>
              <p>{quest.detail}</p>
              <button className="text-button" type="button">
                Görevi incele <span aria-hidden="true">↗</span>
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
