export default function HomeMain() {
  return (
    <main id="home-main">
      {/* Quote Section */}
      <section className="quote">
        <h1 className="txt-4xl">
          Our revolutionary <span className="word light">telederma</span>{' '}
          <span className="word light">platform</span>{' '}
          <span id="health-plat" className="ico-cont mid-center">
            <img src="/assets/health.webp" alt="Health Platform" />
          </span>{' '}
          delivers <span className="word light">expert</span>{' '}
          <span className="word light">care</span>{' '}
          <span id="stethoscope" className="ico-cont">
            <img src="/assets/stethoscope.webp" alt="Stethoscope" />
          </span>{' '}
          to your doorstep, transforming <span className="word light">healthcare</span>{' '}
          <span id="meds" className="ico-cont">
            <img src="/assets/meds.webp" alt="Meds" />
          </span>{' '}
          access
        </h1>
      </section>

      {/* Features Section */}
      <section className="feature-cards flex-row-even-stretch">
        <div className="feature ico-head-div" id="f1">
          <div className="ico-text-h">
            <div className="ico-cont mid-center">
              <img src="/assets/wall-clock.webp" alt="Wall Clock" />
            </div>
            <br />
            <h2 className="txt-lg">Ultimate Flexibility</h2>
          </div>
          <p className="txt-lg">
            Flexible appointment booking and rescheduling as per your convenience.
          </p>
        </div>

        <div className="feature only-head" id="f2">
          <h2 className="feature-heading-bottom">Aligned to your needs</h2>
        </div>

        <div className="feature ico-head-div" id="f3">
          <div className="ico-text-h">
            <div className="ico-cont">
              <img src="/assets/development.webp" alt="Development" />
            </div>
            <br />
            <h2 className="txt-lg">Upcoming Chaos</h2>
          </div>
          <p className="txt-lg"> Future healthcare ecosystem - all in one place. </p>
        </div>

        <div className="feature only-head" id="f4">
          <h2 className="feature-heading-bottom">Aligned to your needs</h2>
        </div>
      </section>
    </main>
  );
}
