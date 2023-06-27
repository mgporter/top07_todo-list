import createEl from "./createElement.js";
import {formatDistance} from "date-fns";
import svgCompletedCircle from "./completedItemCircle.js";
import {colors, getBgColor} from "./constants.js";

export default function DOMController() {
    
    const masterGrid = createEl('div', null, null, 'master-grid')
    document.body.appendChild(masterGrid)

    let activeList = null;

    function getActiveList() {
        return activeList;
    }

    function generateLeftNav() {
        const listsNav = createEl('div', null, null, 'lists-nav')

        const logoDivContainer = createEl('div', null, null, 'logo-div-container')
        const logoCirle = createEl('div', null, 'logo-circle')
        const logoHeader = createEl('h5', 'MyLists App')
        logoDivContainer.append(logoCirle, logoHeader)
        listsNav.append(logoDivContainer)

        const addListContainer = createEl('div', null, null, 'add-list-container')
        const addListSeparator = createEl('div', null, 'add-list-separator')
        const addListBtn = createEl('button', '+', 'add-list-btn')
        addListContainer.append(addListSeparator, addListBtn, addListSeparator.cloneNode(true))
        listsNav.append(addListContainer)

        const userLists = createEl('div', null, null, 'user-lists')
        listsNav.append(userLists)

        const selectedListDetail = createEl('div', null, null, 'selected-list-detail')
        const detailHeader = createEl('h6', 'List details:')
        const detailModified = createEl('p', null, 'list-details-modified')
        const detailItems = createEl('p', null, 'list-details-items')
        const detailCompleted = createEl('p', null, 'list-details-completed')
        selectedListDetail.append(detailHeader, detailModified, detailItems, detailCompleted)
        listsNav.append(selectedListDetail)

        masterGrid.appendChild(listsNav)
    }

    function generateColorPalette() {
        const colorCirclesContainer = document.querySelector('.color-circles-container')
        
        for (let i = 0; i < colors.length; i++) {
            const colorDiv = createEl('div', null, 'color-circle')
            colorDiv.setAttribute('data-color', i)
            colorDiv.style.backgroundColor = colors[i]
            colorCirclesContainer.appendChild(colorDiv)
        }
    }

    function changeListColor(colorIndex) {
        const contentContainer = document.getElementById('content-container')
        contentContainer.style.backgroundColor = getBgColor(colorIndex)

        const listRowCircle = document.querySelector(`.list-row[data-listid="${activeList}"] > .list-circle`)
        listRowCircle.style.backgroundColor = colors[colorIndex]
    }

    function generateContentPanel() {
        const contentContainer = createEl('div', null, null, 'content-container')

        const listTitle = createEl('textarea', null, 'list-title')
        listTitle.setAttribute('spellcheck', 'false')
        listTitle.setAttribute('rows', '1')

        const listDescription = createEl('textarea', null, 'list-description')
        listDescription.setAttribute('rows', '5')

        const addItemContainer = createEl('div', null, 'add-item-container')
        const addItemButton = createEl('button', '+', 'add-item-button')
        addItemButton.setAttribute('type', 'button')
        const addItemLabel = createEl('h4', 'add-item')
        addItemContainer.append(addItemButton, addItemLabel)

        const itemsContainer = createEl('div', null, 'items-container')

        const bottomContainer = createEl('div', null, 'bottom-container')

        const pickColorContainer = createEl('div', null, 'pick-color-container')
        const pickColorLabel = createEl('p', 'List color:')
        const colorCirclesContainer = createEl('div', null, 'color-circles-container')
        pickColorContainer.append(pickColorLabel, colorCirclesContainer)
        const deleteListBtn = createEl('button', 'Delete list', 'delete-list-btn')
        deleteListBtn.setAttribute('type', 'button')

        bottomContainer.append(pickColorContainer, deleteListBtn)

        // Create the dialog box for deleting lists
        const deleteListDialog = createEl('dialog', null, null, 'delete-list-dialog')
        const deleteListForm = createEl('form')
        const deleteListText = createEl('p', 'Really delete list?')
        const deleteListButtonContainer = createEl('div', null, 'delete-list-button-container')
        const deleteListConfirmBtn = createEl('button', 'Yes! Get it out of here!', null, 'confirm-delete-btn')
        deleteListConfirmBtn.setAttribute('value', 'delete')
        const deleteListCancelBtn = createEl('button', 'Nope, still need this one')
        deleteListCancelBtn.setAttribute('value', 'cancel')
        deleteListCancelBtn.setAttribute('formmethod', 'dialog')
        deleteListButtonContainer.append(deleteListConfirmBtn, deleteListCancelBtn)
        deleteListForm.append(deleteListText, deleteListButtonContainer)
        deleteListDialog.append(deleteListForm)

        contentContainer.append(listTitle, listDescription, addItemContainer, itemsContainer, bottomContainer, deleteListDialog)

        masterGrid.appendChild(contentContainer)

        generateColorPalette()
    }

    function generateListRow(id, name, color, lastModified) {

        const lastModifiedText = formatDistance(new Date(lastModified), new Date(), {addSuffix: true})
        
        const listRow = createEl('div', null, 'list-row')
        listRow.setAttribute('data-listid', id)

        const listCircle = createEl('div', null, "list-circle")
        // listCircle.setAttribute('data-color', color)
        listCircle.style.backgroundColor = colors[color]
        const listName = createEl('div', name, 'list-name')
        const listDate = createEl('div', lastModifiedText, 'list-date')

        listRow.append(listCircle, listName, listDate)

        return listRow
    }

    function displayList(listObj, listId) {
        let itemsContainer = document.querySelector('.items-container')

        // If the itemsContainer is missing, we need to regenerate the content container elements
        // this can happen if a user deletes all of the lists
        if (!itemsContainer) {
            generateContentPanel();
            itemsContainer = document.querySelector('.items-container')
        }

        const list = listObj.list
        itemsContainer.textContent = '';
        document.querySelector('.list-title').textContent = list.name;
        document.querySelector('.list-description').textContent = list.details;

        let rowCounter = 0;

        for (let itemKey in Object.keys(list.items)) {
        
            const dropZone = createEl('div', null, 'dropzone')
            dropZone.setAttribute('data-itemrow', rowCounter)
            const dropZoneBar = createEl('div', null, 'dropzone-bar')
            dropZone.append(dropZoneBar)
    
            const itemRow = createEl('div', null, 'item-row', itemKey)
            itemRow.setAttribute('data-itemrow', rowCounter)
            itemRow.setAttribute('draggable', 'true')

            const itemCircle = createEl('div', null, 'item-circle')
            const itemCircleSVG = svgCompletedCircle()
            itemCircle.append(itemCircleSVG)

            const itemName = createEl('div', list.items[itemKey].name, 'item-name')
            const itemCompleteby = createEl('div', list.items[itemKey].completeby, 'item-completeby')
            const itemDialogBox = createEl('div', null, 'item-dialog-box')
            itemRow.append(itemCircle, itemName, itemCompleteby, itemDialogBox)

            itemsContainer.append(dropZone, itemRow)

            rowCounter++;
        }
        
        // Create and append one last dropzone at the end
        const dropZone = createEl('div', null, 'dropzone')
        dropZone.setAttribute('data-itemrow', rowCounter)
        const dropZoneBar = createEl('div', null, 'dropzone-bar')
        dropZone.append(dropZoneBar)
        itemsContainer.append(dropZone)

        // Update background color
        document.getElementById('content-container').style.backgroundColor = getBgColor(list.color)

        // Update the "list details" box in the left nav
        document.querySelector('.list-details-modified').textContent = `Modified: ${new Date(list.lastModified)}`
        document.querySelector('.list-details-items').textContent = `Items: ${listObj.getItemCount()}`
        document.querySelector('.list-details-completed').textContent = `Completed: ${listObj.getCompletedItemCount()}`

        activeList = listId;
    }

    function deleteList(id) {
        const listRow = document.querySelector(`.list-row[data-listid="${id}"]`)
        
        // get the nextSibling's id so we have something to display after the user deletes the current list
        let sibling;
        if (listRow.nextElementSibling) {
            sibling = listRow.nextElementSibling.dataset.listid;
        } else if (listRow.previousElementSibling) {
            sibling = listRow.previousElementSibling.dataset.listid;
        } else {
            sibling = null
        }

        listRow.remove()

        return sibling
    }

    return {
        getActiveList,
        generateLeftNav,
        generateContentPanel,
        generateColorPalette,
        changeListColor,
        generateListRow,
        displayList,
        deleteList,
    }
}