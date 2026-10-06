let controller;
let overlayCount = 0;
let previousOverflow;

export function pauseScroll() {
  if (overlayCount++ === 0) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    controller?.stop();
  }
  return () => {
    if (--overlayCount === 0) {
      document.body.style.overflow = previousOverflow;
      controller?.start();
    }
  };
}

export function setScrollController(value) {
  controller = value;
}

export function jumpTo(top) {
  if (controller) {
    controller.resize();
    controller.scrollTo(top, { immediate: true, force: true });
  } else {
    window.scrollTo({ top, behavior: 'instant' });
  }
}
