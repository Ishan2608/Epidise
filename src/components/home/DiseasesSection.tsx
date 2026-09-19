export default function DiseasesSection() {
  // Array of diseases to cleanly map over instead of hardcoding 12 identical blocks
  const diseases = [
    'Acne',
    'Chicken Pox',
    'Psoriasis',
    'Fungal Infection',
    'Hives',
    'Eczema',
    'Dermatitis',
    'Keratosis Pilaris',
    'Measles',
    'Pimple',
    'Vitiligo',
    'Skin Allergy',
  ];

  return (
    <section className="diseases">
      <div className="text-area">
        <h1 className="txt-2xl">
          Get Help from <span className="highlight"> Expert </span> Dermatologists
        </h1>
        <div className="para">
          <span className="round-icon-container ques-ico-cont mid-center">
            <i className="fa-solid fa-question"></i>
          </span>
          <p>
            Connect instantly with a verified dermatologist online for convenient and
            affordable prescription treatment.
          </p>
        </div>
      </div>

      <div className="cards-area flex-row-even-center">
        {diseases.map((disease, index) => (
          <div key={index} className="disease flex-row-start">
            <span className="round-icon-container check-cont">
              <i className="fa-solid fa-check"></i>
            </span>
            <h4 className="disease-name">{disease}</h4>
          </div>
        ))}
      </div>
    </section>
  );
}
