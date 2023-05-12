function removeAllChilds(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function createElem(typeElem, classElem, idElem, type, content) {
    let element = document.createElement(typeElem);
    if (type) element.type = type;
    element.className = classElem;
    element.id = idElem;
    element.innerHTML = content;
    return element;
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

function checkGraphConnectivity(graph) {

    for (const i in graph) {
        let tmpArray = [];
        tmpArray = buildReachable(graph, i);
        for (const j of tmpArray) {
            if (!j) return false;
        }
    }
    return true;

}

document.addEventListener("DOMContentLoaded", () => {
    let inputDimension = document.querySelector(".matrix-dimension");
    let matrixDimension, matrix, leftSet, redundancy, unevenness;
    let setArea = document.querySelector('.input-set-area'),
        sendSetBtn = document.querySelector(".send-set"),
        redundancyArea = document.querySelector(".redundancy-area"),
        unevennessArea = document.querySelector(".unevenness-area");

    inputDimension.addEventListener("change", (e) =>{
        matrixDimension = e.target.value;
        removeAllChilds(setArea);
        
        for (let i = 0; i < matrixDimension; ++i){
            let inputWrap = createElem("div", "input-set-wrap", i, "", "");
            let label = createElem("label", "", i, "", `G(${i+1}) =`);
            let input = createElem("input", "input-set", i, "text", ``);
            inputWrap.append(label);
            inputWrap.append(input);
            setArea.append(inputWrap);
        }
        
    })

    sendSetBtn.addEventListener("click", (e) => {
        matrix = [];
        leftSet = [];
        redundancy = 0; 
        unevenness = 0;

        let setNodes = setArea.querySelectorAll(".input-set");
        let midStep = 0;

        matrix = new Array(matrixDimension);

        for (let i = 0; i < matrixDimension; i++) {
            matrix[i] = new Array(matrixDimension);
        }

        for (let i = 0; i < matrixDimension; ++i) {
            for (let j = 0; j < matrixDimension; ++j) {
                matrix[i][j] = 0;
            }
        }

        for (const i of setNodes) {
            let tmpSet = i.value.split(' ');
            leftSet.push(tmpSet);
        }

        for (const i in leftSet) {
            for (const j in leftSet[i]) {
                if (leftSet[i][j]) matrix[leftSet[i][j]-1][i]=1;
            }
        }

        for (const i of matrix) {
            for (const j of i) {
                redundancy += j;
            }
        }

        redundancy /= 2 * (matrixDimension - 1);
        redundancy--;

        for (let i = 0; i < matrixDimension; ++i) {
            for (let j = 0; j < matrixDimension; ++j) {
                matrix[j][i] = matrix[j][i] || matrix[i][j];
            }
        }

        for (let i = 0; i < matrixDimension; ++i) {
            for (let j = 0; j < matrixDimension; ++j) {
                midStep += matrix[i][j];
            }
        }

        midStep /= matrixDimension;

        for (let i in matrix) {
            let stepVertex = 0;
            for (let j in matrix[i]) {
                stepVertex += matrix[i][j];
            }
            unevenness += (stepVertex - midStep) * (stepVertex - midStep);
        }

        unevenness = checkGraphConnectivity(matrix) ? unevenness : null;

        redundancyArea.innerHTML = redundancy.toFixed(2);

        if (unevenness === null) unevennessArea.innerHTML = "-";
        else unevennessArea.innerHTML = unevenness.toFixed(2);
    })

})