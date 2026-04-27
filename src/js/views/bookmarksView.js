import icons from 'url:../../img/icons.svg';
import view from './view.js';
import previewView from './previewView.js';
class bookmarksView extends view {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'no bookmarks yet,find a nice recipe and bookmark it';
  _message = '';
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
  _generateMarkup() {
    console.log(this._data);
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}
export default new bookmarksView();
