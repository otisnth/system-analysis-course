function buildTranspose(adjMatrix) {
    let n = adjMatrix.length;

    let transpose = new Array(n).fill().map(() => new Array(n).fill(0));

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            transpose[j][i] = adjMatrix[i][j];
        }
    }

    return transpose;
}

function buildReachable(adjMatrix, start) {
    let n = adjMatrix.length;
    let visited = new Array(n).fill(false);
    let stack = [];

    stack.push(start);

    while (stack.length > 0) {
        let node = stack.pop();

        if (!visited[node]) {
            visited[node] = true;

            for (let i = 0; i < n; i++) {
                if (adjMatrix[node][i] === 1) {
                    stack.push(i);
                }
            }
        }
    }

    return visited;
}

function buildControllable(adjMatrix, start) {
    let transpose = buildTranspose(adjMatrix);
    return buildReachable(transpose, start);
}

function createSetList(set, text) {
    let ul = createElem("ul", "set", "", "");

    for (let i = 0; i < set.length; ++i) {
        let str = `${text}(${i+1}) = {`;
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
    let matrixDimension, matrix, rightSet, newRightSet, components, vertexList, newMatrix;
    let matrixArea = document.querySelector(".input-matrix"),
        rightSetArea = document.querySelector(".right-set"),
        subgraphsArea = document.querySelector(".subgraphs"),
        sendMatrixBtn = document.querySelector(".send-matrix");

    inputDimension.addEventListener("change", (e) => {
        matrixDimension = e.target.value;
        removeAllChilds(matrixArea);

        for (let i = 0; i < matrixDimension; ++i) {
            let tr = createElem("tr", "matrix-row", i, "");

            for (let j = 0; j < matrixDimension; ++j) {
                let td = createElem(
                    "td",
                    "matrix-cell",
                    i + "-" + j,
                    `<input class="matrix-cell-value" type="text" value="0">`
                );

                td.firstChild.addEventListener("change", (e) => {
                    if (e.target.value != 1 && e.target.value != 0) {
                        e.target.classList.add("matrix-cell-value__error");
                        sendMatrixBtn.disabled = true;
                    } else {
                        e.target.classList.remove("matrix-cell-value__error");
                        sendMatrixBtn.disabled = false;
                    }
                });

                tr.append(td);
            }
            matrixArea.append(tr);
        }
    });

    sendMatrixBtn.addEventListener("click", (e) => {

        components = [];
        matrix = new Array(matrixDimension);
        rightSet = new Array(matrixDimension);
        for (let i = 0; i < matrixDimension; i++) {
            matrix[i] = new Array(matrixDimension);
            rightSet[i] = [];
        }

        let tr = matrixArea.firstChild;
        for (let i = 0; i < matrixDimension; ++i) {
            let td = tr.firstChild;
            for (let j = 0; j < matrixDimension; ++j) {
                matrix[i][j] = Number(td.firstChild.value);
                td = td.nextSibling;
            }
            tr = tr.nextSibling;
        }

        for (let i = 0; i < matrix.length; ++i) {
            rightSet.push(new Array());
            for (let j = 0; j < matrix[i].length; ++j) {
                if (matrix[i][j] > 0) {
                    rightSet[i].push(j + 1);
                }
            }
        
        }

        vertexList = new Array(matrix.length).fill(true);

        for (let i = 0; i < vertexList.length; ++i) {
            let reachVertList = buildReachable(matrix, i);
            
            let contVertList = buildControllable(matrix, i);
        
            let tmpComps = [];
        
            for (let j = 0; j < vertexList.length; j++) {
                if (reachVertList[j] && contVertList[j] && vertexList[j]) {
                    tmpComps.push(j + 1);
                    vertexList[j] = false;
                }
            }
            if (tmpComps.length != 0) components.push(tmpComps);
        }

        newRightSet = [];
        newMatrix = new Array(components.length);
        
        for (let i = 0; i < components.length; ++i) {
            newMatrix[i] = new Array(components.length);
        }
        
        for (const i in newMatrix) {
            for (const j in newMatrix[i]) {
                newMatrix[i][j] = 0;
            }
        }
        
        for (let i = 0; i < matrix.length; ++i) {
            for (let j = 0; j < matrix[i].length; ++j) {
                if (matrix[i][j] > 0) {
                    let startSubGraph, endSubGraph;
                    for (let l in components) {
                        if (components[l].includes(+i + 1)) {
                            startSubGraph = +l;
                        }
                        if (components[l].includes(+j + 1)){
                            endSubGraph = +l;
                        }
                    }
                    if (startSubGraph != endSubGraph){
                        newMatrix[startSubGraph][endSubGraph] = 1;
                    }
                }
            }
        
        }
        
        
        for (let i = 0; i < newMatrix.length; ++i) {
            newRightSet.push(new Array());
            for (let j = 0; j < newMatrix[i].length; ++j) {
                if (newMatrix[i][j] > 0) {
                    newRightSet[i].push(j + 1);
                }
            }
        
        }
        console.log(components);
        console.log(newRightSet);


        removeAllChilds(rightSetArea);
        removeAllChilds(subgraphsArea);

        subgraphsArea.append(createSetList(components, "G"));
        rightSetArea.append(createSetList(newRightSet, "G"));
    });
});
