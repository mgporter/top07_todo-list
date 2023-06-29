function SessionObj(username) {

    let _listCounter = 0;      // We will use the listCounter to give each appended list a unique ID

    const session = {
        username: username,
        lists: {},
    };

    function getListById(id) {
        return session.lists[id];
    }

    function getUsername() {
        return session.username;
    }

    // if passed an id, use that to populate the session object. 
    // Otherwise, generate a unique id number from the listCounter.
    function appendList(list, id=null) {
        
        const listId = id ? id : _listCounter

        session.lists[listId] = list;
        
        if (!id) _listCounter++;

        return listId           // return the appended list's id
    }

    function removeList(id) {
        delete session.lists[id];
    }

    function getListCount() {
        return Object.keys(session.lists).length;
    }

    function setListCounterStart(num) {
        _listCounter = num;
    }

    return {
        session,
        getListById, 
        getUsername, 
        appendList,
        removeList,
        getListCount,
        setListCounterStart,
    }
}


function List(arg=null) {
    
    let list = {};

    // Make a new list using the argument as the list name, 
    // or if passed a list object (such as from localStorage), then we can make a list object
    // using all of the parameters from that object
    if (typeof arg === 'string' | arg == null) {
        list = {
            name: arg ? arg : `New Listtest`,
            lastModified: Date.now(),
            details: 'This is my new list',
            color: 0,
            items: {},
            itemOrder: [],           // This array will contain the ids of the elements in the last order they were displayed in
            itemCounter: 0, 
        }
    } else if (typeof arg === 'object') {
        list = {
            name: arg.name,
            lastModified: arg.lastModified,
            details: arg.details,
            color: arg.color,
            items: arg.items,
            itemOrder: arg.itemOrder,
            itemCounter: arg.itemCounter
        }
    }
    
    function getItemCount() {
        return Object.keys(list.items).length;
    }

    function getCompletedItemCount() {
        const completedItemList = Object.keys(list.items).filter((listId) => list.items[listId].completed);
        return completedItemList.length;
    }

    function appendItem(item) {
        list.items[list.itemCounter] = item;
        list.itemCounter++;

        return list.itemCounter - 1
    }

    function removeItem(id) {
        delete list.items[id];
    }

    function getItemById(id) {
        return list.items[id];
    }


    return {
        list,
        getItemCount,
        getCompletedItemCount,
        appendItem,
        removeItem,
        getItemById,
    }
    
}


function Item(itemName=null) {

    const item = {
        name: itemName ? itemName : 'New Item',
        completeBy: null,
        details: '',
        completed: false,
    };

    return item;
}

export {SessionObj, List, Item};