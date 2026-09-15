// src/components/global/LaunchModal.tsx
import { useState } from 'react';

export default function LaunchModal() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <>
      {/* Inline styles override the 'display: none' from your original CSS */}
      <div 
        className="overlay" 
        style={{ display: 'block' }} 
        onClick={() => setIsOpen(false)}
      ></div>
      
      <div className="modal" style={{ display: 'block' }}>
        <div className="modal-content">
          <button className="close-modal" onClick={() => setIsOpen(false)}>
            <i className="fa-solid fa-xmark"></i>
          </button>
          
          <div className="modal-inner flex-col-even-stretch">
            <h2 className="txt-xl">Launching Soon!</h2>
            <p className="txt-lg">Stay tuned for updates and exclusive offers.</p>
          </div>
        </div>
      </div>
    </>
  );
}
