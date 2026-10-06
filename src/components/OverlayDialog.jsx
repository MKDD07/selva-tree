import { useEffect, useRef } from 'react';
import { pauseScroll } from '../scroll';

export default function OverlayDialog({ open, onClose, children, className, labelledBy }) {
  const dialog = useRef(null);
  useEffect(() => {
    const element = dialog.current;
    if (!open) return;
    const opener = document.activeElement;
    element.showModal();
    const resume = pauseScroll();
    return () => {
      element.close();
      resume();
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [open]);
  return <dialog ref={dialog} className={className} aria-labelledby={labelledBy}
    data-lenis-prevent onCancel={event => { event.preventDefault(); onClose(); }}
    onClick={event => { if (event.target === event.currentTarget) {
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
    } }}>
    {children}
  </dialog>;
}
