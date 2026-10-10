import { useModalStore } from '../../stores/modalStore';

export default function DownloadSection() {
  // inside the component:
  const openComingSoon = useModalStore((state) => state.openComingSoon);
  return (
    <section className="download-btns mid-center">
      <div className="wrapper flex-col-even-center">
        <h1 className="txt-2xl">Launching Soon!</h1>
        <div className="download-btn-container">
          <img className="d-btn" src="./assets/google-play-btn.svg" alt="Google Play" onClick={openComingSoon} />
          <img className="d-btn" src="./assets/apple-store-btn.svg" alt="Apple Store" onClick={openComingSoon} />
        </div>
      </div>
    </section>
  );
}
