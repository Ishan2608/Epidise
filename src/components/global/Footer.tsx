import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div className="footer-head">
        <h1 className="txt-2xl">Epidise</h1>
        <p className="txt-lg">Connect with skin care experts anytime, anywhere, with Epidise</p>
        <p>View our <Link to="/privacy">Privacy Policies</Link></p>
        <p>Redg. No. <i>U86909UT2025PTC018838</i></p>
        <p>DPIIT Certificate No. <i>DIPP248613</i></p>
        <p>Udyam Redg. No. <i>UDYAM-UK-05-0127935</i></p>
      </div>
      
      <div className="socials txt-md flex-row-start">
        <p>Our Socials</p>
        <a 
          href="https://www.linkedin.com/company/epidise" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <i className="fa-brands fa-linkedin-in social-icon"></i>
        </a>  
        <a 
          href="https://www.instagram.com/epidise_healthcare" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <i className="fa-brands fa-instagram social-icon"></i>
        </a>
      </div>
      
      <div className="footer-bottom">
        <p>All rights reserved | All lefts reserved.</p>
        <p>Copyright © Epidise {currentYear}</p>
      </div>
    </footer>
  );
}
