import * as model from './model.js';
import recipeview from './views/recipeview.js';
import { modal_CLOSE_WINDOW } from './config.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import searchview from './views/searchview.js';
import resultView from './views/resultView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import BookMarksView from './views/bookmarksView.js';
import bookmarksView from './views/bookmarksView.js';
import AddRecipeView from './views/addRecipeView.js';
import addRecipeView from './views/addRecipeView.js';

// if (module.hot) {
//   module.hot.accept();
// }

const recipeContainer = document.querySelector('.recipe');

// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io

///////////////////////////////////////

const controlRecipe = async function () {
  try {
    console.log(model.state.recipe);
    console.log(model.state.bookmarks);
    const id = window.location.hash.slice(1);
    console.log(id);
    if (!id) return;
    recipeview.renderSpinner();
    resultView.update(model.getsearchResultPage());
    bookmarksView.update(model.state.bookmarks);

    await model.loadRecipe(id);
    recipeview.render(model.state.recipe);
    //console.log(model.state.recipe);

    //console.log(model.state.recipe);
  } catch (err) {
    console.log(`${err}`);
    recipeview.renderError();
  }
};
const controlSearchResult = async function () {
  try {
    resultView.renderSpinner();

    const query = searchview.getQuery();
    if (!query) return;

    await model.loadSearchResult(query);
    //searchview.clearquery();
    //console.log(model.state.search.result);
    resultView.render(model.getsearchResultPage());
    paginationView.render(model.state.search);
    //console.log(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
const controlAddBookamark = function () {
  //console.log(model.state.recipe);
  if (!model.state.recipe.bookmarked) model.addbookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  //console.log(model.state.recipe);
  recipeview.update(model.state.recipe);
  BookMarksView.render(model.state.bookmarks);
  console.log(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};
const controlPagination = function (pageGoTo) {
  resultView.render(model.getsearchResultPage(pageGoTo));
  paginationView.render(model.state.search);
  //console.log('pagination control');
};
const controlServing = function (newservings) {
  model.updateServing(newservings);
  //console.log(model.state.recipe);
  recipeview.update(model.state.recipe);
};
const controlAddrecipe = async function (newRecipe) {
  console.log(newRecipe);
  try {
    console.log(newRecipe);
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    recipeview.render(model.state.recipe);
    addRecipeView.rendermessage();
    bookmarksView.render(model.state.bookmarks);
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, modal_CLOSE_WINDOW * 1000);
  } catch (err) {
    console.error(err);
    AddRecipeView.renderError(err.message);
  }
};
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);

  searchview.addHandlerSearch(controlSearchResult);
  recipeview.addhandlerRender(controlRecipe);

  recipeview.addhandlerUpdateServings(controlServing);

  recipeview.addhandlerAddBookmark(controlAddBookamark);
  paginationView.addHandlerClick(controlPagination);
  AddRecipeView.addHandlerUpload(controlAddrecipe);
  console.log('welcome');
};

init();

//controlSearchResult();
//window.addEventListener('hashchange', showRecipe);
