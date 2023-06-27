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

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            const obj = storage.getFromStorage(key)
            if (Object.hasOwn(obj, 'list')) {
                // Here we retrieve the list from localStorage, then use the
                // factory function List to change it into a List object. Then we append it.

                sessionObj.appendList(List(storage.getFromStorage(key).list), key);

                if (key > highestKey) highestKey = key
            };
        };

        sessionObj.setListCounterStart(Number(highestKey) + 1)

        return localStorage.length > 1
    }

    function saveList(id) {
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
            return listsObj[a].lastModified - listsObj[b].lastModified
        })

        return listKeysSorted
    }

    function updateListColor(activeList, colorIndex) {
        const list = sessionObj.getListById(activeList)
        list.list.color = colorIndex;
        storage.saveListToStorage(activeList, list)
    }

    function createNewList() {
        const list = List();
        const listId = sessionObj.appendList(list)
        storage.saveListToStorage(listId, list)
        return listId
    }

    function deleteList(id) {
        sessionObj.removeList(id)
        localStorage.clear(id)
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

    obj.initializeSession();    // set username from local storage
    const haveLists = obj.initializeLists();

    const addListBtn = document.querySelector('.add-list-btn')
    const userLists = document.getElementById('user-lists')
    addListBtn.addEventListener('click', () => {
        const listId = obj.createNewList();
        const list = obj.getListById(listId).list
        const newListRow = dom.generateListRow(listId, list.name, list.color, list.lastModified);
        userLists.insertBefore(newListRow, userLists.firstChild)
        dom.displayList(obj.getListById(listId), listId)
    })

    if (!haveLists) addListBtn.click();



    const listKeysSorted = obj.getListsInDateOrder()

    for (let listKey of listKeysSorted) {
        const list = obj.getListById(listKey).list
        const newList = dom.generateListRow(listKey, list.name, list.color, list.lastModified)
        userLists.appendChild(newList)
    }

    dom.displayList(obj.getListById(listKeysSorted[0]), listKeysSorted[0])     // display the first list on pageload

    // Add event listeners
    const colorCircleContainer = document.querySelector('.color-circles-container')
    colorCircleContainer.addEventListener('click', (e) => {
        if (e.target.dataset.color) {
            const colorIndex = e.target.dataset.color
            dom.changeListColor(colorIndex)
            obj.updateListColor(dom.getActiveList(), colorIndex)
        }
    })

    // Add event listeners for the left-side list nav
    const listRowContainer = document.getElementById('user-lists')
    listRowContainer.addEventListener('click', (e) => {
        if (e.target.dataset.listid) {
            const listId = e.target.dataset.listid;
            dom.displayList(obj.getListById(listId), listId)
        }
    })

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
            } else {
                // if the deleted element has no siblings, it is the last one, we'll just
                // delete the content container
                document.getElementById('content-container').remove()
            }
        }
    })

    deleteListConfirmBtn.addEventListener('click', (e) => {
        e.preventDefault();
        deleteListDialog.close(deleteListConfirmBtn.value);
    })




}




const mainController = MainController();











// Information holder – an object designed to know certain information and provide that information to other objects.
// Structurer – an object that maintains relationships between objects and information about those relationships.
// Service provider – an object that performs specific work and offers services to others on demand.
// Controller – an object designed to make decisions and control a complex task.
// Coordinator – an object that doesn’t make many decisions but, in a rote or mechanical way, delegates work to other objects.
// Interfacer – an object that transforms information or requests between distinct parts of a system.


// Module to retreive lists from localStorage on load, or request a new list be created if none exist: service provider
// Module to create a new list object: information holder
// Module to load the most recent list to content container on first load

// Module that detects when a change is made to the list and calls a function to update the list object and sends a signal that a change occured
// on list change, a module to update the timestamp on the left navbar and update list details
// on list change, a module to reorder the lists by time/date
// Module to update the list object when a change is detected

// Module to create a new list when button is pressed
// DOM module to update the left navbar with this new list, and display it in the content container
// Module to display "add item" right bar when button is pressed.
// Module to add a new item to the list object when information is entered and button pressed
// Module to add this new item to the DOM content container when information is entered and button pressed

// Dom module to load the appropriate list when a left navbar list is clicked 








/* 




const listDescription = document.querySelector('.list-description')
listDescription.style.height = listDescription.scrollHeight + 'px';





function addItemCircleAnimationIn(e) {
    this.classList.toggle('itemCompleted')
}

const itemCircles = document.querySelectorAll('.item-circle > svg');
itemCircles.forEach((circle) => {
    circle.addEventListener('click', addItemCircleAnimationIn)
})


const colorPickers = document.querySelectorAll('.color-circle');

function changeListColor(e) {
    colorPickers.forEach((picker) => {
        picker.textContent = ''
    })
    
    let color;

    if (!e) {
        color = "0";
        colorPickers[0].textContent = '✓';
    } else {
        color = e.target.dataset.color;
        e.target.textContent = '✓';
    }
    const contentContainer = document.getElementById('content-container');
    contentContainer.style.backgroundColor = `var(--bg-color-${color})`;
}

colorPickers.forEach((picker) => {
    picker.addEventListener('click', changeListColor);
})

changeListColor() // call this without an argument to give it default white color


// The following is for the ITEMS drag and drop
const itemRows = document.querySelectorAll('.item-row');
const dropzones = document.querySelectorAll('.dropzone');
const itemsContainer = document.querySelector('.items-container');

itemRows.forEach((row) => {
    row.addEventListener('dragstart', (e) => {
        let draggedElement = e.target;
        
        e.dataTransfer.clearData();
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', draggedElement.id);
        
        draggedElement.classList.add('mid-drag');
        // draggedElement.style.zIndex = '100';
        // draggedElement.style.opacity = '0.5';
        
        dropzones.forEach((zone) => {
            zone.classList.add('show-dropzones')
        })
        
        // event.dataTransfer.setDragImage(image, xOffset, yOffset);
        
        draggedElement.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        })

        draggedElement.addEventListener('dragend', () => {
            draggedElement.classList.remove('mid-drag');
            // draggedElement.style.opacity = '1';
            // draggedElement.style.zIndex = '1';
            dropzones.forEach((zone) => {
                zone.classList.remove('show-dropzones');
            })
        })
    })
})

let dragCounter = 0;

dropzones.forEach((row) => {
    row.addEventListener('dragenter', (e) => {
        e.preventDefault()
        // dragCounter++;
        e.currentTarget.classList.add('dropzone-feedback')
    })
})

dropzones.forEach((row) => {
    row.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    })
})

dropzones.forEach((row) => {
    row.addEventListener('dragleave', (e) => {
        // dragCounter--;
        // if (dragCounter === 0) {
            e.currentTarget.classList.remove('dropzone-feedback')
        // }
    })
})

dropzones.forEach((row) => {
    row.addEventListener('drop', (e) => {
        e.preventDefault();
        e.currentTarget.classList.remove('dropzone-feedback');
        dragCounter = 0;

        const data = e.dataTransfer.getData('text/plain');
        const draggedElement = document.getElementById(data);
        const draggedElementIndex = draggedElement.dataset.itemrow;
        const draggedElementDropzone = document.querySelector(`.dropzone[data-itemrow="${draggedElementIndex}"]`);
        const parent = itemsContainer;
        parent.insertBefore(draggedElement, e.target);
        parent.insertBefore(draggedElementDropzone, draggedElement);
    })
})




// This script finds all textareas and makes them automatically adjust
// height to the content
const textAreas = document.querySelectorAll('textarea')
textAreas.forEach((area) => {
    area.style.height = area.scrollHeight + 'px';
})

textAreas.forEach((area) => {
    area.addEventListener('input', (e) => {
        const element = e.target;
        element.style.height = '';
        element.style.height = element.scrollHeight + 'px';
    })
})




*/