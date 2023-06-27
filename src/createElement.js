export default function createEl(tag, text=null, classList=null, id=null) {
    const element = document.createElement(tag);
    
    if (Array.isArray(classList)) {      // If classList is an array, add all of the items
        for (let item of classList) {
            element.classList.add(item);
        };
    } else if (typeof(classList) === 'string') {      // if classList is a string, just add it
        element.classList.add(classList);
    }

    if (id) {
        element.id = id;
    };
    
    if (text) {
        element.textContent = text;
    }
    
    return element;
}