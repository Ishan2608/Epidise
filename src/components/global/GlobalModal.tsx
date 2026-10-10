import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useModalStore } from '../../stores/modalStore';

export default function GlobalModal() {
  const { isOpen, content, close } = useModalStore();

  if (!isOpen || !content) return null;

  return (
    <>
      <div className="overlay" style={{ display: 'block' }} onClick={close}></div>
      <div className="modal" style={{ display: 'block' }}>
        <div className="modal-content">
          <button className="close-modal" onClick={close}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
          <div className="modal-inner flex-col-even-stretch">
            <h2 className="txt-xl">{content.title}</h2>
            <p className="txt-lg">{content.message}</p>
            {content.actionHref && (
              <a href={content.actionHref} target="_blank" rel="noopener noreferrer">
                <button className="partner-up">{content.actionLabel ?? 'Open'}</button>
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
