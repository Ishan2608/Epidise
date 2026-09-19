export default function ContactMain() {
  return (
    <main className="contact-container" fetchPriority="high">
      {/* Left Column */}
      <div className="contact-info flex-col-even-start">
        <div className="text-area">
          <h1 className="txt-2xl">Contact Us</h1>
          <p> Reach out anytime for support, inquiries, or assistance. We're here to help! </p>
          <p> <strong> Our Email: </strong> epidise@gmail.com </p>
        </div>
        <div className="support-sections flex-row-even-stretch">
          <div className="support-section">
            <h4>Customer Support</h4>
            <p> Our support team is available around the clock to address any concerns or queries you may have </p>
          </div>
          <div className="support-section">
            <h4> Feedback and Suggestions </h4>
            <p> We value your feedback and are continuously working to improve Epidise. Your input is crucial in shaping the future of Epidise.</p>
          </div>
          <div className="support-section">
            <h4>Brand Partnership</h4>
            <p> For brand partnerships enquiries, please contact us epidise@gmail.com </p>
          </div>
        </div>
      </div>
      
      {/* Right Column */}
      <div className="contact-form">
        <div className="wrapper flex-col-even-stretch ">
          <div id="bbc1" className="bg-blur-circle"> </div>
          <div id="bbc2" className="bg-blur-circle"> </div>
          <div className="head-grp">
            <h2>Get Help</h2> <p>You can reach us anytime</p>
          </div>
          <div className="form-grp">
            <form id="contactForm">
              <div className="input-grp name-grp">
                <input type="text" placeholder="First Name" required />
                <input type="text" placeholder="Last Name" required />
              </div>
              <div className="icon-grp">
                <span className="mid-center"><i className="fa-regular fa-envelope"></i></span>
                <input type="email" name="email" id="email" placeholder="Your Email" required />
              </div>
              <div className="icon-grp">
                <span className="mid-center"><i className="fa-solid fa-phone"></i></span>
                <input type="text" name="phone" id="phone" placeholder="Your Phone" />
              </div>
              <div className="input-grp">
                <textarea name="message" id="message" placeholder="Enter your message here"></textarea>
              </div>
              <button type="submit" id="submit" className="txt-md">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
