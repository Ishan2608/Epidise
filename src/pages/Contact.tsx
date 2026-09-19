import ContactMain from '../components/contact/ContactMain';
import ContactVision from '../components/contact/ContactVision';
import DownloadSection from '../components/global/DownloadSection';

export default function Contact() {
  return (
    <div className="contact-page">
      <ContactMain />
      <ContactVision />
      <DownloadSection />
    </div>
  );
}
