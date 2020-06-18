import bookmarks from './bookmarks.js';

function main() {
  console.log('main');
  bookmarks.initialize();
  bookmarks.bindEventListeners();
  bookmarks.render();
}

$(main);
