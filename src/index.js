import './meyer_reset.css';
import './style.css';
import {SessionObj, List, Item} from './sessionObject.js';
import Storage from './storage.js';
import DOMController from './domController.js';


function StorageObjInterface() {

    let sessionObj;
    const storage = Storage();

    function createTestSession() {      // for testing only

        sessionObj = SessionObj()

        let list1 = List('test list')
        let list2 = List()
        let list3 = List('awesome list')
        let list4 = List()

        sessionObj.appendList(list1)
        sessionObj.appendList(list2)
        sessionObj.appendList(list3)
        sessionObj.appendList(list4)

        let item1 = Item('cool item')
        let item2 = Item()
        let item3 = Item()
        let item4 = Item('super awesome item')

        sessionObj.getListById(2).appendItem(item1)
        sessionObj.getListById(2).appendItem(item2)
        sessionObj.getListById(2).appendItem(item3)
        sessionObj.getListById(2).appendItem(item4)

        storage.saveToStorage('username', 'default')
        storage.saveToStorage('0', sessionObj.getListById(0))
        storage.saveToStorage('1', sessionObj.getListById(1))
        storage.saveToStorage('2', sessionObj.getListById(2))
        storage.saveToStorage('3', sessionObj.getListById(3))

    }

    function initializeSession() {
        let name = storage.getSessionName();
        if (!name) name = 'default';
        storage.setSessionName(name)
        sessionObj = SessionObj(name)
    }

    function initializeLists() {
        
        // get the highest key (list id) number. We'll use this to make sure new lists that are
        // added to the SessionObj get a higher id number (to make sure the id is unique)
        let highestKey = 0;
        let numberOfLocalStorageLists = 0;    

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            const obj = storage.getFromStorage(key)
            if (Object.hasOwn(obj, 'list')) {

                // Here we retrieve the list from localStorage, then use the
                // factory function List to change it into a List object. Then we append it.
                sessionObj.appendList(List(storage.getFromStorage(key).list), key);

                numberOfLocalStorageLists++

                if (Number(key) > highestKey) highestKey = Number(key)
            };
        };

        sessionObj.setListCounterStart(highestKey + 1)

        return numberOfLocalStorageLists
    }

    function saveList(id) {
        updateLastModified(id, Date.now())
        storage.saveListToStorage(id, sessionObj.getListById(id))
    }

    function getLists() {
        return sessionObj.session.lists
    }

    function getListById(id) {
        return sessionObj.getListById(id)
    }

    // return an array of the keys of the lists by lastModified time
    // from most recent to earliest
    function getListsInDateOrder() {     
        const listsObj = sessionObj.session.lists
        const listKeys = Object.keys(listsObj);

        const listKeysSorted = listKeys.toSorted((a, b) => {
            return listsObj[b].list.lastModified - listsObj[a].list.lastModified;
        })

        return listKeysSorted
    }

    function updateLastModified(listId, lastModified) {
        sessionObj.getListById(listId).list.lastModified = lastModified
        const listRow = document.querySelector(`.list-row[data-listid="${listId}"]`)    
        listRow.dispatchEvent(new Event("updated", {bubbles: true}))
    }

    function updateListColor(activeList, colorIndex) {
        const list = sessionObj.getListById(activeList)
        list.list.color = colorIndex;
        storage.saveListToStorage(activeList, list)
    }

    function createNewList() {
        let name = 'New list'

        let num = 2;
        const nameList = Object.keys(sessionObj.session.lists).map((id) => {
            return sessionObj.session.lists[id].list.name
        })
        console.log(nameList)
        while (nameList.includes(name)) {
            name = `New list ${num}`
            num++
        }
        
        const list = List(name);
        const listId = sessionObj.appendList(list)
        storage.saveListToStorage(listId, list)
        return listId
    }

    function deleteList(id) {
        sessionObj.removeList(id)
        localStorage.clear(id)
    }

    function createNewItem(listId, name=null, completeBy=null, description='') {
        const newItem = Item();
        
        name ? newItem.name = name : name;
        completeBy ? newItem.completeBy = completeBy : completeBy;
        description ? newItem.description = description : description;

        const listObj = getListById(listId)
        const itemId = listObj.appendItem(newItem)

        dispatchItemChangeEvent(listObj)
        updateLastModified(listId, Date.now())
        storage.saveListToStorage(listId, listObj)

        return itemId
    }

    function updateItem(listId, itemId, name=null, completeBy=null, description=null, completed=null) {
        const listObj = getListById(listId)
        const item = listObj.getItemById(itemId)
        
        // Only update the item properties if items were passed as arguments
        name ? item.name = name : name;
        completeBy ? item.completeBy = completeBy : completeBy;
        description ? item.description = description : description;
        completed != null ? item.completed = completed : completed;

        dispatchItemChangeEvent(listObj)
        updateLastModified(listId, Date.now())
        storage.saveListToStorage(listId, listObj)
    }

    function deleteItem(listId, itemId) {
        const listObj = getListById(listId)
        listObj.removeItem(itemId)

        dispatchItemChangeEvent(listObj)
        updateLastModified(listId, Date.now())
        storage.saveListToStorage(listId, listObj)
    }

    function updateItemOrder(listId, itemOrder) {
        sessionObj.getListById(listId).list.itemOrder = itemOrder
        storage.saveListToStorage(listId, getListById(listId))
    }

    function dispatchItemChangeEvent(listObj) {
        const updateEvent = new CustomEvent("updateItems", {detail: {items: listObj.getItemCount(), completed: listObj.getCompletedItemCount()}})
        document.getElementById('selected-list-detail').dispatchEvent(updateEvent)
    }

    return {
        createTestSession,
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
    }
}










function MainController() {

    // localStorage.clear()
    const obj = StorageObjInterface();
    const dom = DOMController();

    let testing = false;
    if (testing) {
        obj.createTestSession()
        return
    }

    dom.generateLeftNav();
    dom.generateContentPanel();
    dom.generateRightPanel();

    // Set username from local storage. Right now, the user is always 'default', but this could
    // be changed later to add multi-user functionality
    obj.initializeSession();    

    // load the lists from localStorage into js objects and return the number of lists found
    const numberOfListsFromLocalStorage = obj.initializeLists();    

    // populate the left-side list of rows from the localStorage object
    generateInitialListRows()

    // Set event listeners and app functionality
    activateListRowButtons()    // Display a list when that list is clicked in the left-hand nav
    activateAddListButton();
    activateColorButtons()
    activateDeleteListButton()
    setDynamicTextareas()       // automatically adjust the height of textarea elements
    activateTextareaSaves()     // automatically save the list when a user types something into the textareas
    activateAddItemButton()       // Add event listeners for the add and cancel buttons when user clicks the "add item" button
    activateItemSelect()        // Add event listeners for the add/cancel/delete buttons when the user clicks on an item
    activateItemCircles()       // Activate an animation on the SVG when the user clicks on the circle next to an item (to complete an item)
    activateDraggableItems()
    listenForItemUpdates()      // When an item is deleted, added, or completed, this updates the list details box on the left

    // If there aren't any lists from localStorage, we just create one by default,
    // otherwise, display the top list in the left-side list nav
    if (numberOfListsFromLocalStorage === 0) {
        document.querySelector('.add-list-btn').click()
    } else {
        const userLists = document.getElementById('user-lists')
        const firstChildId = userLists.firstChild.dataset.listid
        dom.displayList(obj.getListById(firstChildId), firstChildId)  
    }
     



    function listenForItemUpdates() {
        const listDetailBox = document.getElementById('selected-list-detail')
        listDetailBox.addEventListener('updateItems', (e) => {
            document.getElementById('list-details-items-span').textContent = e.detail.items
            document.getElementById('list-details-completed-span').textContent = e.detail.completed
        })
    }


    function activateDraggableItems() {
        const itemsContainer = document.querySelector('.items-container');

        itemsContainer.addEventListener('dragstart', (e) => {
            let draggedElement = e.target;
                
            e.dataTransfer.clearData();
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', draggedElement.dataset.itemid);
            
            draggedElement.classList.add('mid-drag');
            
            itemsContainer.classList.add('show-dropzones')
            
            // event.dataTransfer.setDragImage(image, xOffset, yOffset);
            
            draggedElement.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
            })

            draggedElement.addEventListener('dragend', () => {
                draggedElement.classList.remove('mid-drag');
                itemsContainer.classList.remove('show-dropzones')
            })
        })

        itemsContainer.addEventListener('dragenter', (e) => {
            if (e.target.classList.contains('dropzone')) {
                e.preventDefault()
                e.target.classList.add('dropzone-feedback')
            }
        })

        itemsContainer.addEventListener('dragover', (e) => {
            if (e.target.classList.contains('dropzone')) {
                e.preventDefault()
                e.dataTransfer.dropEffect = 'move';
            }
        })

        itemsContainer.addEventListener('dragleave', (e) => {
            if (e.target.classList.contains('dropzone')) {
                e.preventDefault()
                e.target.classList.remove('dropzone-feedback')
            }
        })

        itemsContainer.addEventListener('drop', (e) => {
            if (e.target.classList.contains('dropzone')) {
                e.preventDefault();
                e.target.classList.remove('dropzone-feedback');

                const data = e.dataTransfer.getData('text/plain');
                const draggedElement = document.querySelector(`.item-row[data-itemid="${data}"]`);
                const draggedElementRow = draggedElement.dataset.itemrow;
                const draggedElementDropzone = document.querySelector(`.dropzone[data-itemrow="${draggedElementRow}"]`);

                itemsContainer.insertBefore(draggedElement, e.target);
                itemsContainer.insertBefore(draggedElementDropzone, draggedElement);

                obj.updateItemOrder(dom.getActiveList(), dom.getOrderOfItems());
            }
        })
    }


    function activateItemCircles() {
        const itemsContainer = document.querySelector('.items-container')
        itemsContainer.addEventListener('click', (e) => {
            if (e.target.tagName !== 'svg') return

            const itemId = e.target.dataset.itemid
            const svgCircle = itemsContainer.querySelector(`svg[data-itemid="${itemId}"]`)
            svgCircle.classList.toggle('itemCompleted')
            
            const completed = svgCircle.classList.contains('itemCompleted')

            obj.updateItem(dom.getActiveList(), e.target.dataset.itemid, null, null, null, completed)
        })
    }

    function activateItemSelect() {
        const itemsContainer = document.querySelector('.items-container')
        itemsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('item-row')) {
                const itemId = e.target.dataset.itemid
                const activeList = dom.getActiveList()
                const currentItem = obj.getListById(activeList).list.items[itemId]

                // Remove the selected class from any other items, and add it to the selected row
                const itemRows = document.querySelectorAll('.item-row')
                itemRows.forEach((row) => {
                    row.classList.remove('selected')
                })
                e.target.classList.add('selected')

                // The false flag specifies that this function will label the right hand
                // side as 'edit item' rather than 'add item', and some other similar changes
                dom.createAddItemDialog(false, currentItem.name, currentItem.completeBy, currentItem.description)

                const itemRow = itemsContainer.querySelector(`.item-row[data-itemid="${itemId}"]`)
                const addButton = document.querySelector('#details-content-box .add-button')
                addButton.addEventListener('click', () => {
                    const itemTitle = document.querySelector('#add-item-title').value
                    const itemCompleteby = document.querySelector('#select-completeby').value
                    const itemDescription = document.querySelector('#add-item-description').value

                    const activeListId = dom.getActiveList()

                    obj.updateItem(activeListId, itemId, itemTitle, itemCompleteby, itemDescription);
                    
                    itemRow.querySelector('.item-name').textContent = itemTitle
                    itemRow.querySelector('.item-completeby').textContent = itemCompleteby

                    itemRow.classList.toggle('selected')
                    document.getElementById('details-content-box').textContent = ''
                }) 

                const closeButton = document.querySelector('#details-content-box .close-button')
                closeButton.addEventListener('click', () => {
                    itemRow.classList.toggle('selected')
                    document.getElementById('details-content-box').textContent = ''
                })

                const deleteButton = document.querySelector('#details-content-box .delete-button')
                deleteButton.addEventListener('click', () => {
                    obj.deleteItem(activeList, itemId)
                    itemRow.remove()
                    obj.updateItemOrder(activeList, dom.getOrderOfItems());
                    document.getElementById('details-content-box').textContent = ''
                })
            }
        })

    }

    function activateAddItemButton() {
        const addItemButton = document.querySelector('.add-item-button')
        addItemButton.addEventListener('click', () => {
            
            document.querySelectorAll('.item-row').forEach((row) => {
                row.classList.remove('selected')
            })

            dom.createAddItemDialog()
            document.getElementById('add-item-title').focus()


            const addButton = document.querySelector('#details-content-box .add-button')
            addButton.addEventListener('click', () => {
                const itemTitle = document.querySelector('#add-item-title').value
                const itemCompleteby = document.querySelector('#select-completeby').value
                const itemDescription = document.querySelector('#add-item-description').value

                const activeListId = dom.getActiveList()

                const itemId = obj.createNewItem(activeListId, itemTitle, itemCompleteby, itemDescription);
                
                const itemsContainer = document.querySelector('.items-container')
                itemsContainer.insertBefore(dom.generateItemRow(obj.getListById(activeListId).list, itemId), itemsContainer.firstChild)
                itemsContainer.insertBefore(dom.generateDropZone(itemId), itemsContainer.firstChild)

                obj.updateItemOrder(dom.getActiveList(), dom.getOrderOfItems());

                document.getElementById('details-content-box').textContent = ''
            }) 

            const closeButton = document.querySelector('#details-content-box .close-button')
            closeButton.addEventListener('click', () => {
                document.getElementById('details-content-box').textContent = ''
            })
        })


    }

    function activateTextareaSaves() {
        const title = document.querySelector('.list-title')

        let activeList;
        let listRowTitle;

        title.addEventListener('focus', () => {
            activeList = dom.getActiveList();
            listRowTitle = document.querySelector(`.list-row[data-listid="${activeList}"] .list-name`)
        })

        title.addEventListener('input', () => {
            obj.getListById(activeList).list.name = title.value;
            obj.saveList(activeList);
            listRowTitle.textContent = title.value;
        })

        const description = document.querySelector('.list-description')
        description.addEventListener('input', () => {
            const activeList = dom.getActiveList();
            obj.getListById(activeList).list.details = description.value;
            obj.saveList(activeList)
        })
    }


    function activateAddListButton() {
        const userLists = document.getElementById('user-lists')
        const addListBtn = document.querySelector('.add-list-btn')
        addListBtn.addEventListener('click', () => {
            const listId = obj.createNewList();
            const list = obj.getListById(listId).list
            const newListRow = dom.generateListRow(listId, list.name, list.color, list.lastModified);
            userLists.insertBefore(newListRow, userLists.firstChild)

            const listObj = obj.getListById(listId)
            dom.displayList(listObj, listId)
            dom.changeListColor(listObj.list.color)
            document.querySelector('textarea.list-title').focus()
        })    
    }

    function generateInitialListRows() {
        // Get an array of the lists in order of lastmodified and render them in that order in the left-nav 
        const listKeysSorted = obj.getListsInDateOrder()
        const userLists = document.getElementById('user-lists')
        for (let listKey of listKeysSorted) {
            const list = obj.getListById(listKey).list
            const newList = dom.generateListRow(listKey, list.name, list.color, list.lastModified)
            userLists.appendChild(newList)
        }
    }
           
    function activateColorButtons() {
        const colorCircleContainer = document.querySelector('.color-circles-container')
        colorCircleContainer.addEventListener('click', (e) => {
            if (e.target.dataset.color) {
                const colorIndex = e.target.dataset.color
                dom.changeListColor(colorIndex)
                obj.updateListColor(dom.getActiveList(), colorIndex)
            }
        })
    }

    function activateListRowButtons() {
        // Add event listeners for the left-side list nav
        const userLists = document.getElementById('user-lists')
        userLists.addEventListener('click', (e) => {
            if (e.target.dataset.listid) {
                const listId = e.target.dataset.listid;
                dom.displayList(obj.getListById(listId), listId)
            }
        })

        // When a list is updated, the obj interface sends an 'updated' event
        userLists.addEventListener('updated', (e) => {
            if (e.target !== userLists.firstChild) {
                userLists.insertBefore(e.target, userLists.firstChild)
            }
            const listId = e.target.dataset.listid
            const timestamp = obj.getListById(listId).list.lastModified
            dom.updateTimestampItemRow(listId, timestamp)
            dom.updateTimestampDetails(listId, timestamp)
        })
    }

    function activateDeleteListButton() {
        const deleteListBtn = document.querySelector('.delete-list-btn')
        const deleteListDialog = document.getElementById('delete-list-dialog')
        const deleteListConfirmBtn = document.getElementById('confirm-delete-btn')
        deleteListBtn.addEventListener('click', () => {
            deleteListDialog.showModal();
        })
    
        deleteListDialog.addEventListener('close', () => {
            if (deleteListDialog.returnValue === 'delete') {
                const listId = dom.getActiveList()
                obj.deleteList(listId)
                const siblingId = dom.deleteList(listId)
                if (siblingId) {
                    dom.displayList(obj.getListById(siblingId), siblingId)
                    document.querySelector(`.list-row[data-listid="${siblingId}"]`).classList.add('selected')
                } else {
                    // if the deleted element has no siblings, it is the last one, so
                    // we'll just hide the content container
                    document.getElementById('content-container').style.display = 'none';
                    document.querySelector('#list-details-modified-span').textContent = ''
                    document.querySelector('#list-details-items-span').textContent = ''
                    document.querySelector('#list-details-completed-span').textContent = ''
                }
            }
        })
    
        deleteListConfirmBtn.addEventListener('click', (e) => {
            e.preventDefault();
            deleteListDialog.close(deleteListConfirmBtn.value);
        })
    }

    function setDynamicTextareas() {
        // This script finds all textareas and makes them 
        // automatically adjust height to the content

        document.body.addEventListener('input', (e) => {
            if (e.target.tagName.toLowerCase() === 'textarea') {
                e.target.style.height = '';
                e.target.style.height = e.target.scrollHeight + 'px';
            }
        })
    }

}




const mainController = MainController();