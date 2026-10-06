let controller;

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
