let bookmarks = [];
let adding = false;
let error = null;
let filter = 0;
let tempId = 0;
function addBookmark (bookmark) {
  bookmark.expanded = false;
  this.bookmarks.push(bookmark);
}

function findById(id) {
  return this.bookmarks.find(currentBookmark => currentBookmark.id === id);
}

function toggleExpanded(id) {
  const bookmark = this.bookmarks.find(currentBookmark => currentBookmark.id === id);
  bookmark.expanded = !bookmark.expanded;
}

function findAndDelete(id) {
  this.bookmarks = this.bookmarks.filter(currentItem => currentItem.id !== id);
}

function setFilter(num) {
  this.filter = num;
}

function setError(message) {
  this.error = message;
}

function getError() {
  return this.error;
}

function clearError() {
  this.error = null;
}

export default {
  bookmarks,
  toggleExpanded,
  adding,
  error,
  filter,
  addBookmark,
  tempId,
  setError,
  findAndDelete,
  setFilter,
  getError,
  clearError,
  findById
};