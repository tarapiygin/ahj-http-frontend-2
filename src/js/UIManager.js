export default class UIManager {
  constructor() {
    this.input = document.querySelector('.overlapped');
    this.overlapEl = document.querySelector('.overlap');
    this.imgContainer = document.querySelector('.previews');
    this.createFileListeners = [];
    this.deleteFileListeners = [];
    this.registerEvents();
  }

  drawPreviewImage(id, url) {
    const element = document.createElement('div');
    element.classList.add('preview-container');
    element.dataset.id = id;
    element.innerHTML = `<img class="preview" src=${url}>
    <button class="delete-button">X</button>`;
    this.imgContainer.append(element);
    this.registerImageEvents(element);
  }

  addCreateFileListener(callback) {
    this.createFileListeners.push(callback);
  }

  addDeleteFileListener(callback) {
    this.deleteFileListeners.push(callback);
  }

  onRemoveFile(e) {
    const container = e.currentTarget.closest('.preview-container');
    const { id } = container.dataset;
    container.remove();
    this.deleteFileListeners.forEach((o) => o.call(null, id));
  }

  onCreateFile(e) {
    let files;
    if (e.dataTransfer.files.lenght !== 0) {
      files = e.dataTransfer.files;
    } else {
      files = e.currentTarget.files;
    }
    this.createFileListeners.forEach((o) => o.call(null, files[0]));
  }

  registerImageEvents(element) {
    const btn = element.querySelector('.delete-button');
    btn.addEventListener('click', this.onRemoveFile.bind(this));
  }

  registerEvents() {
    this.overlapEl.addEventListener('dragover', (e) => {
      e.preventDefault();
    });
    this.overlapEl.addEventListener('drop', (e) => {
      e.preventDefault();
      this.onCreateFile(e); // const files = Array.from(e.dataTransfer.files)
    });
    this.overlapEl.addEventListener('click', () => {
      this.input.value = null;
      this.input.dispatchEvent(new MouseEvent('click'));
    });
    this.input.addEventListener('change', this.onCreateFile.bind(this));
  }
}
