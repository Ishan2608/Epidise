export default function ProcessSection() {
  return (
    <section id="process-sect">
      <div className="heading-area">
        <h1 className="txt-2xl">Process at Epidise is Simpler</h1>
        <p className="process-para txt-lg">
          You can book an appointment with a skin care expert and find your solution faster and easier than you imagined.
        </p>
      </div>
      <div className="cards-container">
        
        <div id="step1" className="process-step flex-col-even-stretch">
          <span className="feature-icon-cont mid-center">
            <img src="/assets/p1.webp" alt="Find Skin Experts" />
          </span>
          <div className="wrapper flex-col-even-stretch">
            <h1 className="txt-lg"> 1. Find Skin Experts</h1>
            <p className="txt-md"> No more doctor hunts! Just scroll, filter, and pick your perfect skin & hair expert in seconds. </p>
          </div>
        </div>

        <div id="step2" className="process-step flex-col-even-stretch">
          <span className="feature-icon-cont mid-center">
            <img src="/assets/p2.webp" alt="Lock Your Spot" />
          </span>
          <div className="wrapper flex-col-even-stretch">
            <h1 className="txt-lg"> 2. Lock Your Spot</h1>
            <p className="txt-md"> Pick a date & time that works for you, book consultation online. Fast and hassle-free. </p>
          </div>
        </div>

        <div id="step3" className="process-step flex-col-even-stretch">
          <span className="feature-icon-cont mid-center">
            <img src="/assets/p3.webp" alt="Sit Back and Relax" />
          </span>
          <div className="wrapper flex-col-even-stretch">
            <h1 className="txt-lg"> 3. Sit Back and Relax</h1>
            <p className="txt-md"> Secure your booking with an easy payment—no stress, no fuss. Get a reminder so you never miss it.</p>
          </div>
        </div>

        <div id="step4" className="process-step flex-col-even-stretch">
          <span className="feature-icon-cont mid-center">
            <img src="/assets/p4.webp" alt="Consult, Click, and Cure" />
          </span>
          <div className="wrapper flex-col-even-stretch">
            <h1 className="txt-lg"> 4. Consult, Click, and Cure</h1>
            <p className="txt-md"> Hop on a call, get expert advice, and receive your E-Prescription. <br /> Done and dusted! </p>
          </div>
        </div>

      </div>
    </section>
  );
}
