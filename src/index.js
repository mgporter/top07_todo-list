import './meyer_reset.css';
import './style.css';

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
    circle.setAttributeNS(null, 'fill', 'none');
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

function changeListColor(e) {
    console.log(e.target.dataset.color)
    const color = e.target.dataset.color;
    const contentContainer = document.getElementById('content-container');
    contentContainer.style.backgroundColor = `var(--list-color-${color})`;
    e.target.textContent = '✓';
}

const colorPickers = document.querySelectorAll('.color-circle');
colorPickers.forEach((picker) => {
    picker.addEventListener('click', changeListColor);
})

// let draggedElement;

const itemRows = document.querySelectorAll('.item-row');
const dropzones = document.querySelectorAll('.dropzone');

itemRows.forEach((row) => {
    row.addEventListener('dragstart', (e) => {
        let draggedElement = e.target;
        
        e.dataTransfer.clearData();
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', draggedElement.id);
        
        draggedElement.classList.add('mid-drag');
        draggedElement.style.zIndex = '100';
        
        dropzones.forEach((zone) => {
            zone.style.visibility = 'visible';
        })
        
        // event.dataTransfer.setDragImage(image, xOffset, yOffset);
        
        draggedElement.addEventListener('dragend', () => {
            draggedElement.classList.remove('mid-drag');
            dropzones.forEach((zone) => {
                zone.style.visibility = 'hidden';
            })
        })
    })
})

let dragCounter = 0;

itemRows.forEach((row) => {
    row.addEventListener('dragenter', (e) => {
        e.preventDefault()
        dragCounter++;
        e.currentTarget.classList.add('drag-target-move')
    })
})

itemRows.forEach((row) => {
    row.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    })
})

itemRows.forEach((row) => {
    row.addEventListener('dragleave', (e) => {
        dragCounter--;
        if (dragCounter === 0) {
            e.currentTarget.classList.remove('drag-target-move')
        }
    })
})

itemRows.forEach((row) => {
    row.addEventListener('drop', (e) => {
        e.preventDefault();
        const data = e.dataTransfer.getData('text/plain');
        const draggedElement = document.getElementById(data);
        e.currentTarget.classList.remove('drag-target-move');
        dragCounter = 0;
    })
})

