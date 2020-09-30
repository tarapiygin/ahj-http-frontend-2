import UIManager from './UIManager';

export default class FileManager {
  constructor() {
    this.imageObjList = [];
    this.UIManager = new UIManager();
    this.url = 'https://file-manager-node-js.herokuapp.com/'; // 'http://localhost:7070/';
    this.registerEvents();
  }

  redrawUI() {
    this.getImages(this.onLoadImages.bind(this));
  }

  onCreateImage(data) {
    const params = new Map().set('method', 'createImage');
    const formData = new FormData();
    formData.append('image', data);
    this.sendRequest('POST', params, (response) => {
      const obj = JSON.parse(response);
      this.UIManager.drawPreviewImage(obj.id, this.url + obj.URL);
    }, formData);
  }

  onRemoveImage(id) {
    const params = new Map().set('method', 'removeImage');
    const data = JSON.stringify({ id });
    this.sendRequest('POST', params, () => true, data);
  }

  onLoadImages(data) {
    const images = JSON.parse(data);
    images.forEach((obj) => this.UIManager.drawPreviewImage(obj.id, this.url + obj.URL));
  }

  getImages(callback) {
    const params = new Map().set('method', 'allImages');
    this.sendRequest('GET', params, callback);
  }

  sendRequest(method, params, callback, body = '') {
    const xhr = new XMLHttpRequest();
    const query = new URLSearchParams();
    params.forEach((value, key) => query.append(key, value));

    xhr.open(method, `${this.url}?${query}`);
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300 && xhr.readyState === 4) {
        callback(xhr.response);
      }
    });
    xhr.addEventListener('error', () => {
    });
    if (method === 'GET') xhr.send();
    else xhr.send(body);
  }

  registerEvents() {
    this.UIManager.addCreateFileListener(this.onCreateImage.bind(this));
    this.UIManager.addDeleteFileListener(this.onRemoveImage.bind(this));
  }
}
