function removeAllChilds(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function createElem(typeElem, classElem, idElem, content) {
    let element = document.createElement(typeElem);
    element.className = classElem;
    element.id = idElem;
    element.innerHTML = content;
    return element;
}