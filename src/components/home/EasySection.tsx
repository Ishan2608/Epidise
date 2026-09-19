export default function EasySection() {
  return (
    <section className="easy">
      <div className="txt-area flex-row-even-stretch">
        <div className="heading-area">
          <h1 className="txt-2xl">
            Prioritizing Your<span className="highlight"> Hassle-Free </span>Dermatology Experience!
          </h1>
        </div>
        <div className="para-area">
          <p className="txt-md">
            We ensure privacy, security, and transparency to provide you with a safe,
            seamless, and trustworthydermatology experience.
          </p>
        </div>
      </div>
      
      <div className="cards-cont flex-row-even-center">
        <div className="card">
          <h1 className="txt-lg easy-card-heading centered">Privacy and Security</h1>
          <p className="txt-md">Your data is encrypted and protected for a safe healthcare experience.</p>
          <div className="icons-cont">
            <span className="transparent-bg">
              <span className="easy-card-icon-wrapper mid-center">
                <i className="fa-solid fa-shield-halved easy-card-icon"></i>
              </span>
            </span>
            <span className="white-bg">
              <div className="curvy-wrapper mid-center">
                <span className="wrapper mid-center">
                  <i className="fa-solid fa-check"></i>
                </span>
              </div>
            </span>
          </div>
        </div>

        <div className="card">
          <h1 className="txt-lg easy-card-heading">
            <span className="easy-card-icon-wrapper mid-center">
              <i className="fa-solid fa-id-card-clip easy-card-icon"></i>
            </span>
            <br /> <br /> Personal Identity Protection
          </h1>
          <p className="txt-md"> We don't collect chat, call, or video consultation data. It's automatically deleted.</p>
          <div className="icons-cont">
            <span className="transparent-bg"></span>
            <span className="white-bg">
              <div className="curvy-wrapper mid-center">
                <span className="wrapper mid-center">
                  <i className="fa-solid fa-check"></i>
                </span>
              </div>
            </span>
          </div>
        </div>

        <div className="card">
          <h1 className="txt-lg easy-card-heading centered">Feedback</h1>
          <p className="txt-md">Your feedback drives continuous improvement. We're listening!</p>
          <div className="icons-cont">
            <span className="transparent-bg">
              <span className="easy-card-icon-wrapper mid-center">
                <i className="fa-solid fa-comments easy-card-icon"></i>
              </span>
            </span>
            <span className="white-bg">
              <div className="curvy-wrapper mid-center">
                <span className="wrapper mid-center">
                  <i className="fa-solid fa-check"></i>
                </span>
              </div>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
