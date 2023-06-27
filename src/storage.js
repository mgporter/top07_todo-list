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
        saveToStorage(id, list)
    }

    function getListsFromStorage() {
        // Each list is saved as a separate item in the localStorage object, and not
        // as a sublevel of the 'session' object (as they are in the actual Session Object).
        // This allows us to save a list to localStorage when that list is changed, without having
        // to also save every other list as the same time.
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
        saveToStorage,
        getFromStorage,
        retreiveSession,
        getSessionName,
        getListsFromStorage,
        saveListToStorage,
        setSessionName,
    }
}

