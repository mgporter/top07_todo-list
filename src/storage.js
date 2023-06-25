export default function StorageController() {
    
    const storageSessionName = "sessionName";

    function saveToStorage(key, value) {
        // console.log(JSON.stringify(value))
        localStorage.setItem(key, JSON.stringify(value));
    }
    
    function getFromStorage(key) {
        return JSON.parse(localStorage.getItem(key));
    }

    function getSessionName() {
        let name = getFromStorage(storageSessionName)
        return name;
    }

    function setSessionName(name) {
        saveToStorage(storageSessionName, name)
    }

    function saveListToStorage(id, list) {
        saveToStorage(`list${id}`, list)
    }

    function getListsFromStorage() {
        let lists = {}
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            if (key.search(/^list\d+$/) !== -1) {     // if the key matches the formatting for a saved list
                lists[key] = getFromStorage(key);
            };
        };
        return lists;
    }

    function getLists() {

    }


    // saveToStorage("sessionName", a.getUsername());

    // for (const [id, list] of Object.entries(a.session.lists)) {
    //     saveToStorage(id, list)
    // }
    



    function retreiveSession() {
        let session;
    
        try {
            session = JSON.parse(localStorage.getItem("sessionObj"));
        } catch (error) {
            console.log("Problem accessing local Storage");
        };
    
        if (!session) {
            session = SessionObj();
        };
        
        return session;
    }


    return {
        retreiveSession,
        getSessionName,
        getListsFromStorage,
        saveListToStorage,
        setSessionName,
    }
}

