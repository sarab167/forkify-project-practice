import icons from 'url:../../img/icons.svg';
import view from './view.js';
class addRecipeView extends view {
  _parentElement = document.querySelector('.upload');
  _message = 'recipe successfully loaded';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerClose();
  }
  toggleWindow() {
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }
  _addHandlerClose() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }
  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      console.log('welcome');
      const dataarr = [...new FormData(this)];
      const data = Object.fromEntries(dataarr);
      console.log(data);
      handler(data);
    });
  }

  _generateMarkup() {}
}
export default new addRecipeView();
