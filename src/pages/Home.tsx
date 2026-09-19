import HomeHeader from '../components/home/HomeHeader';
import ProcessSection from '../components/home/ProcessSection';
import HomeMain from '../components/home/HomeMain';
import DiseasesSection from '../components/home/DiseasesSection';
import ContactVision from '../components/home/ContactVision';
import AppFeatures from '../components/home/AppFeatures';
import EasySection from '../components/home/EasySection';
import DpiitCertificateSection from '../components/home/DpiitCertificateSection';
import DownloadSection from '../components/global/DownloadSection';

export default function Home() {
  return (
    <div className="home-page">
      <HomeHeader />
      <HomeMain />
      <ProcessSection />
      <DiseasesSection />
      <ContactVision />
      <AppFeatures />
      <EasySection />
      <DownloadSection />
      <DpiitCertificateSection />
    </div>
  );
}
