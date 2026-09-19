export default function ContactVision() {
  return (
    <section className="contact-vision">
      <div className="left">
        <h1 className="txt-2xl"> 
          Our vision is to empower individuals with <span className="highlight"> personalized </span> solutions 
        </h1>
        <p> 
          We're making healthcare better with technology, creating solutions that fit your needs. Our first version will have the basics, and we'll keep adding more useful features over time.
        </p>
      </div>
      <div id="vision-right" className="right" title="Click Me">
        <div className="graphic"> 
          <img src="/assets/med_icon.webp" alt="Medical Icon" loading="lazy" />
        </div>
        <div className="txt-area">
          <h1 className="txt-lg"> Join our Waiting List</h1> 
          <p className="txt-md"> <b> Click here </b> to get your first consultation <b>FREE</b> </p>
        </div>
      </div>
    </section>
  );
}
