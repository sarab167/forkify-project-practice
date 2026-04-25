class searchView {
  _parentEl = document.querySelector('.search');
  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;

    this.#clearquery();
    return query;
  }
  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
  #clearquery() {
    this._parentEl.querySelector('.search__field').value = '';
  }
}

export default new searchView();
