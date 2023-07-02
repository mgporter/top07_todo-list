import { SessionObj, List, Item } from './sessionObject';
import Storage from './storage';

export default function StorageObjInterface() {
  let sessionObj;
  const storage = Storage();

  function initializeSession() {
    let name = storage.getSessionName();
    if (!name) name = 'default';
    storage.setSessionName(name);
    sessionObj = SessionObj(name);
  }

  function initializeLists() {
    // get the highest key (list id) number. We'll use this to make sure new lists that are
    // added to the SessionObj get a higher id number (to make sure the id is unique)
    let highestKey = 0;
    let numberOfLocalStorageLists = 0;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const obj = storage.getFromStorage(key);
      if (Object.hasOwn(obj, 'list')) {
        // Here we retrieve the list from localStorage, then use the
        // factory function List to change it into a List object. Then we append it.
        sessionObj.appendList(List(storage.getFromStorage(key).list), key);

        numberOfLocalStorageLists++;

        if (Number(key) > highestKey) highestKey = Number(key);
      }
    }

    sessionObj.setListCounterStart(highestKey + 1);

    return numberOfLocalStorageLists;
  }

  function saveList(id) {
    updateLastModified(id, Date.now());
    storage.saveListToStorage(id, sessionObj.getListById(id));
  }

  function getLists() {
    return sessionObj.session.lists;
  }

  function getListById(id) {
    return sessionObj.getListById(id);
  }

  // return an array of the keys of the lists by lastModified time
  // from most recent to earliest
  function getListsInDateOrder() {
    const listsObj = sessionObj.session.lists;
    const listKeys = Object.keys(listsObj);

    listKeys.sort((a, b) => {
      return listsObj[b].list.lastModified - listsObj[a].list.lastModified;
    });

    return listKeys;
  }

  function updateLastModified(listId, lastModified) {
    sessionObj.getListById(listId).list.lastModified = lastModified;
    const listRow = document.querySelector(
      `.list-row[data-listid="${listId}"]`
    );
    listRow.dispatchEvent(new Event('updated', { bubbles: true }));
  }

  function updateListColor(activeList, colorIndex) {
    const list = sessionObj.getListById(activeList);
    list.list.color = colorIndex;
    storage.saveListToStorage(activeList, list);
  }

  function createNewList() {
    let name = 'New list';

    let num = 2;
    const nameList = Object.keys(sessionObj.session.lists).map((id) => {
      return sessionObj.session.lists[id].list.name;
    });
    console.log(nameList);
    while (nameList.includes(name)) {
      name = `New list ${num}`;
      num++;
    }

    const list = List(name);
    const listId = sessionObj.appendList(list);
    storage.saveListToStorage(listId, list);
    return listId;
  }

  function deleteList(id) {
    sessionObj.removeList(id);
    localStorage.clear(id);
  }

  function createNewItem(
    listId,
    name = null,
    completeBy = null,
    description = ''
  ) {
    const newItem = Item();

    if (name) newItem.name = name;
    if (completeBy) newItem.completeBy = completeBy;
    if (description) newItem.description = description;

    const listObj = getListById(listId);
    const itemId = listObj.appendItem(newItem);

    dispatchItemChangeEvent(listObj);
    updateLastModified(listId, Date.now());
    storage.saveListToStorage(listId, listObj);

    return itemId;
  }

  function updateItem(
    listId,
    itemId,
    name = null,
    completeBy = null,
    description = null,
    completed = null
  ) {
    const listObj = getListById(listId);
    const item = listObj.getItemById(itemId);

    // Only update the item properties if items were passed as arguments
    if (name) item.name = name;
    if (completeBy) item.completeBy = completeBy;
    if (description) item.description = description;
    if (completed) item.completed = completed;

    // name ? item.name = name : name;
    // completeBy ? item.completeBy = completeBy : completeBy;
    // description ? item.description = description : description;
    // completed != null ? item.completed = completed : completed;

    dispatchItemChangeEvent(listObj);
    updateLastModified(listId, Date.now());
    storage.saveListToStorage(listId, listObj);
  }

  function deleteItem(listId, itemId) {
    const listObj = getListById(listId);
    listObj.removeItem(itemId);

    dispatchItemChangeEvent(listObj);
    updateLastModified(listId, Date.now());
    storage.saveListToStorage(listId, listObj);
  }

  function updateItemOrder(listId, itemOrder) {
    sessionObj.getListById(listId).list.itemOrder = itemOrder;
    storage.saveListToStorage(listId, getListById(listId));
  }

  function dispatchItemChangeEvent(listObj) {
    const updateEvent = new CustomEvent('updateItems', {
      detail: {
        items: listObj.getItemCount(),
        completed: listObj.getCompletedItemCount(),
      },
    });
    document.getElementById('selected-list-detail').dispatchEvent(updateEvent);
  }

  return {
    initializeSession,
    initializeLists,
    saveList,
    getLists,
    getListById,
    getListsInDateOrder,
    updateListColor,
    createNewList,
    deleteList,
    createNewItem,
    updateItem,
    updateLastModified,
    deleteItem,
    updateItemOrder,
  };
}
