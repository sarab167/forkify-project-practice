import icons from 'url:../../img/icons.svg';
import view from './view.js';
import previewView from './previewView.js';
class resultView extends view {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'no recipe found,plz try another one';
  _message = '';
  _generateMarkup() {
    console.log(this._data);
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}
export default new resultView();
