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

document.addEventListener("DOMContentLoaded", () => {
    let inputDimension = document.querySelector(".matrix-dimension");
    let matrixDimension, matrix, rightSet;
    let matrixArea = document.querySelector(".input-matrix"),
        rightSetArea = document.querySelector(".right-set"),
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
            for (let j = 0; j < matrix[i].length; ++j) {
                if (matrix[i][j] > 0) {
                    leftSet[j].push(i + 1);
                }
            }
        }
        removeAllChilds(rightSetArea);
    });
});

let testMatr = [
    [0, 1, 0, 0, 1, 1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 1, 0, 1],
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
];

// let testMatr = [[0, 1, 0, 0, 0],
// [0, 0, 0, 1, 0],
// [0, 1, 0, 0, 0],
// [0, 0, 1, 0, 0],
// [1, 0, 1, 1, 0]];


let rightSet = [];
let newRightSet;

let vertexList = new Array(testMatr.length).fill(true);
let components = [];


for (let i = 0; i < testMatr.length; ++i) {
    rightSet.push(new Array());
    for (let j = 0; j < testMatr[i].length; ++j) {
        if (testMatr[i][j] > 0) {
            rightSet[i].push(j + 1);
        }
    }

}

console.log(rightSet);


for (let i = 0; i < vertexList.length; ++i) {
    let reachVertList = buildReachable(testMatr, i);
    
    let contVertList = buildControllable(testMatr, i);

    let tmpComps = [];

    for (let j = 0; j < vertexList.length; j++) {
        if (reachVertList[j] && contVertList[j] && vertexList[j]) {
            tmpComps.push(j + 1);
            vertexList[j] = false;
        }
    }
    if (tmpComps.length != 0) components.push(tmpComps);
}

console.log(components);

// let checkComponents = new Array(components.length).fill(new Array(components.length).fill(true));
// console.log(checkComponents);

newRightSet = [];
let newMatrix = new Array(components.length).fill(new Array(components.length).fill(0));

for (let i = 0; i < testMatr.length; ++i) {
    for (let j = 0; j < testMatr[i].length; ++j) {
        if (testMatr[i][j] > 0) {
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

console.log(newMatrix);

for (let i = 0; i < newMatrix.length; ++i) {
    newRightSet.push(new Array());
    for (let j = 0; j < newMatrix[i].length; ++j) {
        if (newMatrix[i][j] > 0) {
            newRightSet[i].push(j + 1);
        }
    }

}

// for (let i in rightSet) {
//     for (let j in rightSet[i]) {
//         let startSubGraph, endSubGraph;
//         for (let l in components) {
//             if (components[l].includes(+i + 1)) {
//                 startSubGraph = +l;
//             }
//             if (components[l].includes(+rightSet[i][j])){
//                 endSubGraph = +l;
//             }
//         }
        
//         if (checkComponents[startSubGraph][endSubGraph] && (startSubGraph != endSubGraph)){
//             checkComponents[startSubGraph][endSubGraph] = false;
//             console.log(startSubGraph);
//             console.log(endSubGraph);
//             console.log("++");
//             newRightSet[startSubGraph].push(endSubGraph + 1);
//         }
//     }
// }
console.log(newRightSet);