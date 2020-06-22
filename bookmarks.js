import store from './store.js';
import api from './api.js';

function renderPage() {
  api.getBookmarks()
    .then((bookmarks) => {
      bookmarks.forEach((bookmark) => store.addBookmark(bookmark));
      render('main'); // this should not be here. it is not doing what you think it is. 
    //given the render function you currently have, at what point does 'main' ever become 'add'?
    });    
}

function render(myScreen) { // render should not be receiving anything here. 
  // console log store here and investigate it's contents. How can render "see" store here?
  let htmlString;
  switch (myScreen) {
  case 'main':
    htmlString = generateMainString();
    break;

  case 'add':
    htmlString = generateAddString();
    break;
  }
  $('main').html(htmlString);
}

function generateStar (numStars) {
  let starString = '';
  for (let i = 0; i < 5; i++) {
    if (i < numStars) starString += '&#9733;';
    else starString += '&#9734;';
  }
  return starString;
}

function formBookmarkListItems() {
  let itemString = '';
  store.bookmarks.forEach(function(bookmark) {
    if(bookmark.rating >= store.filter) {  
      if(bookmark.expanded) {
        itemString += `<li class="jsBookmarkElement" data-bookmark-id="${bookmark.id}">${bookmark.title}
                         <p>Visit Site: <a href=${bookmark.url}>${bookmark.url}</a></p>
                         <p>Rating: ${generateStar(bookmark.rating)}</p>
                         <p>${bookmark.desc}</p>
                         <div class="expandorcollapseBookmark">
                         <label for="buttonCollapse">Collapse Bookmark: </label>
                           <button class="buttonCol" name="buttonCollapse" type="button">Collapse</button>
                         </div>
                         <div class="deleteBookmark">
                           <label for="buttonDelete">Delete Bookmark: </label>
                           <button class="buttonDel" name="buttonDelete" type="button">Delete</button>
                         </div>                    
                       </li>`;
      }
      else {
        itemString += `<li class="jsBookmarkElement" data-bookmark-id="${bookmark.id}">
                         <span class="stars">${generateStar(bookmark.rating)}</span>
                         <p>${bookmark.title}</p>
                         <div class="expandorcollapseBookmark">
                         <label for="buttonExpand">Expand Bookmark: </label>
                           <button class="buttonExp" name="buttonExpand" type="button">Expand</button>
                         </div>
                       </li>`;
      }
    }
  });
  return itemString;
}

function generateMainString() {
  return `<section class="upperContainer">
            <div class="newBookmark">
              <button class="buttonNew" name="buttonNB" type="button">New Bookmark</button>
            </div>
            <div class="filterBy">
              <select id="js-filter" name="filter">
                <option value="" selected="selected">Rating Filter</option>            
                <option aria-label="1 star" value="1">${generateStar(1)}</option>
                <option aria-label="2 star" value="2">${generateStar(2)}</option>
                <option aria-label="3 star" value="3">${generateStar(3)}</option>
                <option aria-label="4 star" value="4">${generateStar(4)}</option>
                <option aria-label="5 star" value="5">${generateStar(5)}</option>                                                
              </select>
            </div>
          </section>
          <section class="bookmarks">
            ${renderError()}
            <ul class="ulBookmarks">
              ${formBookmarkListItems()}
            </ul>
          </section>`;
}

function generateAddString() {
  return `<form class="addBookmarkForm">
              <fieldset name="formField">
                <label for="newBookLink">New Bookmark URL Link</label>
                <input id="newBookLink" type="text" name="newBookLink" placeholder="http://www.newsite.com"><br>
                <label for="newBookNick">New Bookmark Title</label>
                <input id="newBookNick" type="text" name="newBookNick" placeholder="Title"><br>
                <label for="newBookDesc">New Bookmark Description</label>
                <input id='newBookDesc' type="text" name="newBookDesc" placeholder="Description"><br>
                <select id="newFilter" name="addFilter">
                  <option value="" selected="selected">Rating</option>            
                  <option aria-label="1 star" value="1">${generateStar(1)}</option>
                  <option aria-label="2 star" value="2">${generateStar(2)}</option>
                  <option aria-label="3 star" value="3">${generateStar(3)}</option>
                  <option aria-label="4 star" value="4">${generateStar(4)}</option>
                  <option aria-label="5 star" value="5">${generateStar(5)}</option>                                                
                </select>
                <div class="subCancelDiv">
                  <button class="buttonAddSubmit" type="submit">Submit</button>
                  <button class="buttonAddCancel" type="reset">Cancel</button>
                </div>
                ${renderError()}              
              </fieldset>
            </form>`;
}

function renderError() {
  if(store.error) {
    return `<section class="errorContent">
              <p>Error: ${store.getError()}</p>
              <button id="cancelError">OK</button>
            </section>`;

  }
  return '';
}

function bindEventListeners() {
  handleCancelAddBookmark();
  handleAddBookmark();
  handleSubmitBookmark();
  handleExpandClick();
  handleDeleteBookmark();
  handleFilterSelect();
  handleErrorButtonClear();
}

function handleErrorButtonClear() {
  $('main').on('click', '#cancelError', function () {
    store.clearError();      
    render('main');
  });
   
}

function handleFilterSelect() {
  $('main').on('change','#js-filter', function() {
    let filter = $(this).val();
    store.setFilter(filter);
    render('main');    
  });
}

function handleDeleteBookmark() {
  $('main').on('click', '.buttonDel', function(event) {
    const id = getTitleIdFromElement(event.currentTarget);
  
    api.deleteBookmark(id)
      .then(() => {
        store.findAndDelete(id);
        render('main');        
      })
      .catch((err) => {
        store.setError(err.message);
        render('main');        
      });
  });
}

function getTitleIdFromElement(bookmark) {
  return $(bookmark)
    .closest('.jsBookmarkElement')
    .data('bookmark-id');
}

function handleExpandClick() {
  $('main').on('click', '.expandorcollapseBookmark', function(event) {
    const id = getTitleIdFromElement(event.currentTarget);
    store.toggleExpanded(id);
    render('main');
  });
}

function handleAddBookmark() {
  $('main').on('click', '.buttonNew', function () {
    render('add');
  });
}

function handleSubmitBookmark() {
  $('main').on('submit', '.addBookmarkForm', function (event) {
    event.preventDefault();
    console.log('submit');
    let newBookmark = {
      id: store.tempID,
      title: `${$(this).find('#newBookNick').val()}`,
      rating: `${$(this).find('#newFilter').val()}`,
      url: `${$(this).find('#newBookLink').val()}`,
      desc: `${$(this).find('#newBookDesc').val()}`
    };
    api.createBookmark(newBookmark)
      .then((newBM) => {
        store.addBookmark(newBM);
        render('main');        
      })
      .catch((err) => {
        store.setError(err.message);
        render('add');        
      });
  });
}

function handleCancelAddBookmark() {
  $('main').on('click', '.buttonAddCancel', function () {
    console.log('cancel');
    render('main');
  });
}

export default {
  renderPage,
  bindEventListeners
};
