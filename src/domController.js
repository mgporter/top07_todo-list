import createEl from "./createElement.js";
import {formatDistance, format as dateFormat} from "date-fns";
import svgCompletedCircle from "./completedItemCircle.js";
import {colors, getBgColor} from "./constants.js";

export default function DOMController() {
    
    // Create and append the grid div on module load
    const masterGrid = createEl('div', null, null, 'master-grid')
    document.body.appendChild(masterGrid)

    // Active list gets updated within the function displayList
    let activeList = null;

    function getActiveList() {
        return activeList;
    }

    function setActiveList(listId) {
        activeList = listId;
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
        const detailModified = createEl('p', 'Modified: ', 'list-details-modified')
        const detailModifiedSpan = createEl('span', null, null, 'list-details-modified-span')
        detailModified.appendChild(detailModifiedSpan)
        const detailItems = createEl('p', 'Items: ', 'list-details-items')
        const detailItemsSpan = createEl('span', null, null, 'list-details-items-span')
        detailItems.appendChild(detailItemsSpan)
        const detailCompleted = createEl('p', "Completed: ", 'list-details-completed')
        const detailCompletedSpan = createEl('span', null, null, 'list-details-completed-span')
        detailCompleted.appendChild(detailCompletedSpan)
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
        contentContainer.style.background = getBgColor(colorIndex)

        updateColorCheckmark(colorIndex)

        const listRowCircle = document.querySelector(`.list-row[data-listid="${activeList}"] > .list-circle`)
        listRowCircle.style.backgroundColor = colors[colorIndex]
    }

    // This is a helper function that is called by changeListColor and displayList
    function updateColorCheckmark(colorIndex) {
        const colorCircles = document.querySelectorAll('.color-circle')
        colorCircles.forEach((circle) => {
            circle.textContent = "";
            if (circle.dataset.color == colorIndex) {
                circle.textContent = "✓";
            }
        })
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

    function generateRightPanel() {
        const detailsContainer = createEl('div', null, null, 'details-container');

        const detailsContentBox = createEl('div', null, null, 'details-content-box');

        detailsContainer.append(detailsContentBox)

        masterGrid.appendChild(detailsContainer)
    }

    function createAddItemDialog(newItem=true, name=null, completeby=null, description=null) {

        // This function makes the add item and edit item dialog boxes
        // The behavior is set by the newItem variable. newItem === false means this will be an edit box 

        const detailsContentBox = document.getElementById('details-content-box');
        detailsContentBox.textContent = '';

        const titleText = newItem ? 'Add item' : 'Edit item';
        const title = createEl('h4', titleText, 'title')

        const addItemTopRow = createEl('div', null, 'add-item-top-row')
        const addItemTitle = createEl('textarea', null, null, 'add-item-title')
        
        addItemTitle.setAttribute('spellcheck', 'false')
        addItemTitle.setAttribute('rows', '1')
        addItemTitle.setAttribute('name', 'add-item-title')
        const addItemTitleLabel = createEl('label', 'To do item')
        addItemTitleLabel.setAttribute('for', 'add-item-title')
        addItemTopRow.append(addItemTitle, addItemTitleLabel)

        const selectCompletebyContainer = createEl('div', null, 'select-completeby-container')
        const completebyLabel = createEl('label', 'Complete by')
        completebyLabel.setAttribute('for', 'select-completeby')
        const completebyInput = createEl('input', null, null, 'select-completeby')
        completebyInput.value = completeby
        completebyInput.setAttribute('type', 'date')
        selectCompletebyContainer.append(completebyLabel, completebyInput)

        const addItemDescriptionContainer = createEl('div', null, 'add-item-description-container')
        const addItemDescriptionLabel = createEl('label', 'Details:')
        addItemDescriptionLabel.setAttribute('for', 'add-item-description')
        const addItemDescriptionInput = createEl('textarea', null, null, 'add-item-description')
        addItemDescriptionInput.setAttribute('name', 'add-item-description')
        addItemDescriptionInput.setAttribute('rows', '5')
        setDynamicHeightWithContent(addItemDescriptionInput, description)
        addItemDescriptionContainer.append(addItemDescriptionLabel, addItemDescriptionInput)

        const addItemButtonRow = createEl('div', null, 'add-item-button-row')
        const submitText = newItem ? 'Add item' : 'Update item';
        const addItemButtonSubmit = createEl('button', submitText, 'add-button')
        addItemButtonSubmit.setAttribute('type', 'button')

        const addItemButtonRowBottom = createEl('div', null, 'add-item-button-row-bottom')
        const addItemButtonClose = createEl('button', 'Cancel', 'close-button')
        addItemButtonClose.setAttribute('type', 'button')
        const deleteItemButton = createEl('button', 'Delete', 'delete-button')
        deleteItemButton.setAttribute('type', 'button')
        if (newItem) deleteItemButton.style.display = 'none'
        addItemButtonRowBottom.append(addItemButtonClose, deleteItemButton)

        addItemButtonRow.append(addItemButtonSubmit, addItemButtonRowBottom)

        detailsContentBox.append(title, 
            addItemTopRow, 
            selectCompletebyContainer, 
            addItemDescriptionContainer, 
            addItemButtonRow);

        // Finally, set the content and height of the title and description boxes

        setDynamicHeightWithContent(document.getElementById('add-item-title'), name)
        setDynamicHeightWithContent(document.getElementById('add-item-description'), description)
    }

    function generateListRow(id, name, color, lastModified) {

        const lastModifiedText = _lastModifiedText(lastModified)
        
        const listRow = createEl('div', null, 'list-row')
        listRow.setAttribute('data-listid', id)

        const listCircle = createEl('div', null, "list-circle")
        listCircle.style.backgroundColor = colors[color]
        const listName = createEl('div', name, 'list-name')
        const listDate = createEl('div', lastModifiedText, 'list-date')

        listRow.append(listCircle, listName, listDate)

        return listRow
    }

    function _lastModifiedText(lastModified) {
        return formatDistance(new Date(lastModified), new Date(), {addSuffix: true})
    }

    function _lastModifiedDetailed(lastModified) {
        return dateFormat(new Date(lastModified), "MMM d, yyyy 'at' h':'mm':'ss aaa")
    }

    function clearDetailsPanel() {
        document.getElementById('details-content-box').textContent = '';
    }

    function displayList(listObj, listId) {
        const list = listObj.list

        const contentContainer = document.getElementById('content-container')
        contentContainer.style.display = 'flex';

        // Set the list title and description in the main content container, and set their height
        const listTitle = document.querySelector('.list-title');
        setDynamicHeightWithContent(listTitle, list.name)
        const listDescription = document.querySelector('.list-description')
        setDynamicHeightWithContent(listDescription, list.details)

        // Clear out the itemsContainer
        const itemsContainer = document.querySelector('.items-container')
        itemsContainer.textContent = '';

        // Loop over the items and render them within the itemsContainer
        for (let itemId of list.itemOrder) {
            const dropZone = generateDropZone(itemId)
            const itemRow = generateItemRow(list, itemId)
            itemsContainer.append(dropZone, itemRow)
        }
        
        // Create and append one last dropzone at the end
        const lastDropZone = generateDropZone(999)
        itemsContainer.append(lastDropZone)

        // Update background color and the color circles checkmark
        document.getElementById('content-container').style.background = getBgColor(list.color)
        updateColorCheckmark(list.color)

        // Update the "list details" box in the left nav
        const lastModifiedFormatted = _lastModifiedDetailed(list.lastModified)
        document.querySelector('#list-details-modified-span').textContent = lastModifiedFormatted
        document.querySelector('#list-details-items-span').textContent = listObj.getItemCount()
        document.querySelector('#list-details-completed-span').textContent = listObj.getCompletedItemCount()

        // Make this list the selected one in the left-nav
        const listRows = document.querySelectorAll('.list-row')
        listRows.forEach((row) => {
            row.classList.remove('selected')
            if (row.dataset.listid == listId) {
                row.classList.add('selected')
            }
        })

        // Clear anything from the right-side details panel
        clearDetailsPanel()

        // Update the activeList variable so other modules can know what list is being displayed
        activeList = listId;
    }

    function generateItemRow(list, itemId) {
        // const itemRow = createEl('div', null, 'item-row', itemId)
        const itemRow = createEl('div', null, 'item-row')
        itemRow.setAttribute('data-itemid', itemId)
        itemRow.setAttribute('data-itemrow', itemId)
        itemRow.setAttribute('draggable', 'true')

        const itemCircle = createEl('div', null, 'item-circle')
        const itemCircleSVG = svgCompletedCircle()
        itemCircleSVG.setAttribute('data-itemid', itemId)
        if (list.items[itemId].completed) itemCircleSVG.classList.add('itemCompleted')

        itemCircle.append(itemCircleSVG)

        const itemName = createEl('div', list.items[itemId].name, 'item-name')
        const itemCompleteby = createEl('div', list.items[itemId].completeBy, 'item-completeby')
        const itemDialogBox = createEl('div', null, 'item-dialog-box')
        itemRow.append(itemCircle, itemName, itemCompleteby, itemDialogBox)

        return itemRow;
    }

    function generateDropZone(itemId) {
        const dropZone = createEl('div', null, 'dropzone')
        dropZone.setAttribute('data-itemrow', itemId)
        const dropZoneBar = createEl('div', null, 'dropzone-bar')
        dropZone.append(dropZoneBar)

        return dropZone;
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

    function updateTimestampItemRow(listId, lastModified) {
        
        const userListTimestamp = document.querySelector(`.list-row[data-listid="${listId}"] .list-date `)
        userListTimestamp.textContent = _lastModifiedText(lastModified)
    }

    function updateTimestampDetails(listId, lastModified) {
        const listDetailsTimestamp = document.querySelector('#list-details-modified-span')
        listDetailsTimestamp.textContent = _lastModifiedDetailed(lastModified)
    }

    function getOrderOfItems() {
        const itemRows = document.querySelectorAll('.item-row')
        let itemOrder = [];
        
        itemRows.forEach((row) => {
            itemOrder.push(row.dataset.itemid)
        })

        return itemOrder;
    }

    // Set dynamic height on textarea elements. When the user adds content, they will expand as necessary
    function setDynamicHeightWithContent(element, content) {
        element.style.height = '';
        element.value = content;
        element.style.height = element.scrollHeight + 'px';
    }


    return {
        getActiveList,
        setActiveList,
        generateLeftNav,
        generateContentPanel,
        generateRightPanel,
        generateColorPalette,
        changeListColor,
        generateListRow,
        generateItemRow,
        generateDropZone,
        displayList,
        deleteList,
        createAddItemDialog,
        clearDetailsPanel,
        updateTimestampItemRow,
        updateTimestampDetails,
        getOrderOfItems,
    }
}