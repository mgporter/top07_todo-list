import './meyer_reset.css';
import './style.css';
import {SessionObj, List, Item} from './sessionObject.js';
import Storage from './storage.js';


function StorageObjInterface() {

    let sessionObj;
    const storage = Storage();

    function createTestSession() {

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

    }

    function initializeSession() {
        let name = storage.getSessionName();
        if (!name) name = 'default';
        storage.setSessionName(name)
        sessionObj = SessionObj(name)
    }

    function initializeLists() {
        sessionObj.session.lists = storage.getListsFromStorage()
    }

    function saveList(id) {
        storage.saveListToStorage(id, sessionObj.getListById(id))
    }

    return {
        sessionObj,
        createTestSession,
        initializeSession,
        initializeLists,
        saveList,
    }
}

function MainController() {

    // localStorage.clear()
    const obj = StorageObjInterface();

    obj.initializeSession();    // set username from local storage
    obj.initializeLists();

    // obj.createTestSession();    // for testing


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

function listModule() {


}





function Controller() {

    function loadFirstList() {

    }

}










const listDescription = document.querySelector('.list-description')
listDescription.style.height = listDescription.scrollHeight + 'px';



const itemCircleDivs = document.querySelectorAll('.item-circle');
itemCircleDivs.forEach((item) => {
    
    const itemCircle = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    itemCircle.setAttributeNS(null, 'viewBox', '-50 -50 100 100');
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttributeNS(null, 'r', 25);
    circle.setAttributeNS(null, 'cx', 0);
    circle.setAttributeNS(null, 'cy', 0);
    circle.setAttributeNS(null, 'stroke', '#aaaaaa');
    circle.setAttributeNS(null, 'stroke-width', '8');
    circle.setAttributeNS(null, 'fill', 'white');
    itemCircle.appendChild(circle)

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    g.setAttributeNS(null, 'transform', 'scale(0)')
    const circle2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle2.setAttributeNS(null, 'r', 25);
    circle2.setAttributeNS(null, 'cx', 0);
    circle2.setAttributeNS(null, 'cy', 0);
    circle2.setAttributeNS(null, 'fill', '#009f1d');
    const checkmark = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    checkmark.setAttributeNS(null, 'stroke-width', '1')
    checkmark.setAttributeNS(null, 'x', '-30')
    checkmark.setAttributeNS(null, 'y', '0')
    checkmark.setAttributeNS(null, 'stroke', '#000000')
    checkmark.setAttributeNS(null, 'fill', '#ffffff')
    checkmark.setAttributeNS(null, 'transform', 'scale(0.8) translate(-37, -50) rotate(-5)')
    checkmark.setAttributeNS(null, 'd', 'M 34.4 72 c -1.2 0 -2.3 -0.4 -3.2 -1.3 L 11.3 50.8 c -1.8 -1.8 -1.8 -4.6 0 -6.4 c 1.8 -1.8 4.6 -1.8 6.4 0 l 16.8 16.7 l 39.9 -39.8 c 1.8 -1.8 4.6 -1.8 6.4 0 c 1.8 1.8 1.8 4.6 0 6.4 l -43.1 43 C 36.7 71.6 35.6 72 34.4 72 Z')
    g.append(circle2, checkmark)

    itemCircle.appendChild(g)

    item.append(itemCircle);
})

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
