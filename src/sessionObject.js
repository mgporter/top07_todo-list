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

    function appendList(list) {
        session.lists[_listCounter] = list;
        _listCounter++;
    }

    function removeList(id) {
        delete session.lists[id];
    }

    function getListCount() {
        return Object.keys(session.lists).length;
    }

    return {
        session,
        getListById, 
        getUsername, 
        appendList,
        removeList,
        getListCount,
    }
}


function List(listName=null) {
    
    let _itemCounter = 0;
        
    const list = {
        name: listName ? listName : `New List`,
        lastModified: Date.now(),
        details: '',
        color: 0,
        items: {},
    }

    function getItemCount() {
        return Object.keys(list.items).length;
    }

    function getCompletedItemCount() {
        const completedItemList = Object.keys(list.items).filter((listId) => list.items[listId].completed);
        return completedItemList.length;
    }

    function appendItem(item) {
        list.items[_itemCounter] = item;
        _itemCounter++;
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