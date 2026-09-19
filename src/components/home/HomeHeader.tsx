export default function HomeHeader() {
  return (
    <header id="home-header">
      <div id="wrapper" className="flex-row-even-stretch">
        
        <div className="txt-area flex-col-even-stretch">
          <h1 id="home-heading" className="txt-4xl"> Connect with skin care experts anytime, anywhere, with Epidise. </h1>
          <p className="txt-lg" id="home-header-para"> Doctor Tak Race? Ab No Stress, Epidise Is The Place. </p>
          <div className="download-btns flex-row-start">
            <img className="d-btn" src="./assets/google-play-btn.svg" alt="Google Play" />
            <img className="d-btn" src="./assets/apple-store-btn.svg" alt="Apple Store" />
          </div>
        </div>

        <div id="hero-mockup" className="mid-center">
          <img id="home-mock" fetchPriority="high" src="./assets/hero-mock.svg" alt="Hero Mockup" />
        </div>

        <div id="home-seel">
          <div className="wrapper">
            {/* top-left curve */}
            <div id="ic1" className="inner-curve">
              <div className="wrapper">
                <div id="iic1" className="curve"> </div>
              </div>
            </div>
            {/* top-right curve */}
            <div id="ic2" className="inner-curve">
              <div className="wrapper">
                <div id="iic2" className="curve"> </div>
              </div>
            </div>
            {/* bottom-right curve */}
            <div id="ic3" className="inner-curve">
              <img src="/assets/Curve.webp" alt="Curve Bottom Right" />
            </div>
            {/* bottom-left curve */}
            <div id="ic4" className="inner-curve">
              <div className="wrapper">
                <div id="iic4" className="curve"> </div>
              </div>
            </div>
            
            <img id="hsi-bg" src="./assets/1.webp" alt="Background" />
            <img id="hsi-fg" src="./assets/2.webp" alt="Foreground" />
          </div>
        </div>

        <div id="hmro">
          <div className="wrapper">
            <img id="hmro-trc" src="/assets/Curve.webp" alt="Top Right Curve" />
            <img id="hmro-blc" src="/assets/Curve.webp" alt="Bottom Left Curve" />
            <p className="txt-md"> Skincare isn't that difficult. </p>
          </div>
        </div>

      </div>
    </header>
  );
}
