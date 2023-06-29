export const colors = [
    '#ffffff',         // white
    '#ffeb3b',         // yellow
    '#aeea00',         // green
    '#80deea',         // blue
    '#ff80ab',         // pink
    '#ff9e00',         // orange
];

// this returns the same colors as above, but with a low alpha value that works for a bg color
export function getBgColor(index) {
    // return `${colors[index]}11`;
    if (index == 0) {       // If the selected color is white, we can add a bit of gray
        return `linear-gradient(149deg, ${colors[index]} 0%, #eeeeee 100%)`  
    }
    return `linear-gradient(149deg, ${colors[index]}11 0%, ${colors[index]}44 100%)`    
}