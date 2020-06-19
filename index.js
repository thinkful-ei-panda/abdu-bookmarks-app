import bookmarks from './bookmarks.js';

function main() {
  console.log('main');
  bookmarks.renderPage();
  bookmarks.bindEventListeners();
}

$(main);
