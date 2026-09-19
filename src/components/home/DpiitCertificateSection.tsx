export default function DpiitCertificateSection() {
  return (
    <section className="dpiit-certificate flex-row-even-center">
      <div className="left-side-img mid-center">
        <img src="./assets/STARTUP INDIA CERTIFICATE.jpg" alt="Startup India Certificate" />
      </div>
      <div className="right-side-text flex-col-even-center">
        <div className="dpiit-badge">
          <i className="fa-solid fa-award dpiit-badge-icon"></i>
          <span className="txt-sm" style={{ textAlign: 'center' }}>
            DPIIT Certified Startup
          </span>
        </div>
        <h1 className="txt-2xl" style={{ textAlign: 'center' }}>
          Recognized by Startup India
        </h1>
        <p className="txt-md" style={{ textAlign: 'center' }}>
          Epidise Healthcare Private Limited is now registered with the Department
          for Promotion of Industry and Internal Trade (DPIIT).
        </p>
      </div>
    </section>
  );
}
