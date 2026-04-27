import { async } from 'regenerator-runtime';
import { API_URL, RESULT_PER_PAGE, KEY } from './config';
import { AJAX } from './helper';
//import { AJAX, getJSON, sendJSON } from './helper';
import { Object } from 'core-js';
//import { search } from 'core-js/fn/symbol';
//import recipeview from './views/recipeview';
//import { search } from 'core-js/fn/symbol';
//import { search } from 'core-js/fn/symbol';
export const state = {
  recipe: {},
  search: {
    query: '',
    result: [],
    page: 1,
    resultPerPage: RESULT_PER_PAGE,
  },
  bookmarks: [],
};
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return (state.recipe = {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    image: recipe.image_url,
    sourceUrl: recipe.source_url,
    cookingTime: recipe.cooking_time,
    servings: recipe.servings,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  });
};
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);
    console.log(data);

    state.recipe = createRecipeObject(data);
    console.log(state.recipe);
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
    console.log(state.recipe);
  } catch (err) {
    console.error(`${err}!!!!!!!`);
    throw err;
  }
};
export const loadSearchResult = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    console.log(data);
    state.search.result = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};
export const getsearchResultPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultPerPage;
  const end = page * state.search.resultPerPage;
  return state.search.result.slice(start, end);
};
export const updateServing = function (newserving) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newserving) / state.recipe.servings;
  });

  state.recipe.servings = newserving;
  //console.log(state.recipe.servings);
};
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};
export const addbookmark = function (recipe) {
  console.log(recipe);
  state.bookmarks.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};
export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

const clearbookMarks = function () {
  localStorage.clear('bookmarks');
};
//clearbookMarks();
export const uploadRecipe = async function (newRecipe) {
  console.log(Object.entries(newRecipe));
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const Ing = ing[1].split(',').map(el => el.trim());
        // const Ing = ing[1].replaceAll(' ', '').split(',');

        console.log(Ing);

        if (Ing.length != 3)
          throw new Error(
            'wrong format of ingredient,please use the right format',
          );
        const [quantity, unit, description] = Ing;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    console.log(newRecipe);
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    console.log(recipe);
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    console.log(data);

    state.recipe = createRecipeObject(data);
    addbookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
