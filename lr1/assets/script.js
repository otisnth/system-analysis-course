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

function createSetList(set) {
    let ul = createElem("ul", "set", "", "");

    for (let i = 0; i < set.length; ++i) {
        let str = `G(${i+1}) = {`;
        if (set[i].length == 0){
            str += "Нет вершин";
        }
        else {
            str += set[i].join(", ");
        }
        str += "}";
        let li = createElem("li", "set-item", "", str);

        ul.append(li);
    }
    return ul;
}


document.addEventListener("DOMContentLoaded", () => {
    let inputDimension = document.querySelector(".matrix-dimension");
    let matrixDimension, matrix, leftSet, rightSet;
    let matrixArea = document.querySelector('.input-matrix'),
        leftSetArea = document.querySelector('.left-set'),
        rightSetArea = document.querySelector('.right-set'),
        sendMatrixBtn = document.querySelector(".send-matrix");

    inputDimension.addEventListener("change", (e) =>{
        matrixDimension = e.target.value;
        removeAllChilds(matrixArea);
        
        for (let i = 0; i < matrixDimension; ++i){
            let  tr = createElem("tr", "matrix-row", i, "");

            for (let j = 0; j < matrixDimension; ++j){
                
                let td = createElem("td", "matrix-cell", i + "-" + j, `<input class="matrix-cell-value" type="text" value="0">`);

                td.firstChild.addEventListener("change", (e) => {
                    if (e.target.value != 1 && e.target.value !=0) {
                        e.target.classList.add("matrix-cell-value__error");
                        sendMatrixBtn.disabled = true;
                    } else {
                        e.target.classList.remove("matrix-cell-value__error");
                        sendMatrixBtn.disabled = false;
                    }
                })

                tr.append(td);
            }
            matrixArea.append(tr);
        }
        
    })

    sendMatrixBtn.addEventListener("click", (e) => {

        matrix = new Array(matrixDimension);
        leftSet = new Array(matrixDimension);
        rightSet = new Array(matrixDimension);
        for (let i = 0; i < matrixDimension; i++) {
            matrix[i] = new Array(matrixDimension);
            leftSet[i] = [];
            rightSet[i] = [];
        }

        let tr = matrixArea.firstChild;
        for (let i = 0; i < matrixDimension; ++i){
            let td = tr.firstChild;
            for (let j = 0; j < matrixDimension; ++j){
                matrix[i][j] = td.firstChild.value;
                td = td.nextSibling;
            }
            tr =  tr.nextSibling;
        }
        
        for (let i = 0; i < matrix.length; ++i) {

            for (let j = 0; j < matrix[i].length; ++j) {
                if (matrix[i][j] > 0) {
                    leftSet[j].push(i + 1);
                    rightSet[i].push(j + 1);
                }
            }

        }

        removeAllChilds(leftSetArea);
        removeAllChilds(rightSetArea);

        leftSetArea.append(createSetList(leftSet));
        rightSetArea.append(createSetList(rightSet));
        
    })

})