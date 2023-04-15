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

function levit(graph, source) {
    const distance = Array(graph.length).fill(Infinity); // массив расстояний от начальной вершины
    const queue = []; // очередь для обхода вершин
    const visited = Array(graph.length).fill(false); // массив для хранения информации о посещении вершины
    distance[source] = 0; // начальное расстояние
  
    queue.push(source);
  
    while (queue.length > 0) {
      let currentVertex = queue.shift();
      visited[currentVertex] = false;
  
      for (let j = 0; j < graph.length; j++) {
        if (graph[currentVertex][j] !== Infinity) {
          const newDist = distance[currentVertex] + graph[currentVertex][j];
          if (newDist < distance[j]) {
            distance[j] = newDist;
  
            if (!visited[j]) {
              if (queue.length > 0 && newDist < distance[queue[0]]) {
                queue.unshift(j);
              } else {
                queue.push(j);
              }
              visited[j] = true;
            }
          }
        }
      }
    }
  
    return distance;
}

document.addEventListener("DOMContentLoaded", () => {
    let inputDimension = document.querySelector(".matrix-dimension");
    let matrixDimension, matrix, distanceMatrix;
    let matrixArea = document.querySelector('.input-matrix'),
        distanceMatrixArea = document.querySelector('.distance-matrix'),
        sendMatrixBtn = document.querySelector(".send-matrix");

    inputDimension.addEventListener("change", (e) =>{
        matrixDimension = e.target.value;
        removeAllChilds(matrixArea);
        
        for (let i = 0; i < matrixDimension; ++i){
            let  tr = createElem("tr", "matrix-row", i, "");

            for (let j = 0; j < matrixDimension; ++j){
                
                let td = createElem("td", "matrix-cell", i + "-" + j, `<input class="matrix-cell-value" type="text" value="0">`);

                tr.append(td);
            }
            matrixArea.append(tr);
        }
        
    })

    sendMatrixBtn.addEventListener("click", (e) => {

        matrix = new Array(matrixDimension);
        distanceMatrix = [];
        
        for (let i = 0; i < matrixDimension; i++) {
            matrix[i] = new Array(matrixDimension);
        }

        let tr = matrixArea.firstChild;
        for (let i = 0; i < matrixDimension; ++i){
            let td = tr.firstChild;
            for (let j = 0; j < matrixDimension; ++j){
                
                if (+td.firstChild.value != 0) matrix[i][j] = +td.firstChild.value;
                else matrix[i][j] = Infinity;

                td = td.nextSibling;
            }
            tr =  tr.nextSibling;
        }
        
        for (let i = 0; i < matrix.length; ++i) {
            distanceMatrix.push(levit(matrix, i));
        }


        removeAllChilds(distanceMatrixArea);

        for (const i in distanceMatrix) {
            let tr = createElem("tr", "matrix-row", i, "");
            for (const j in distanceMatrix[i]) {
                let td = createElem("td", "matrix-cell", i + "-" + j, "");

                if (distanceMatrix[i][j] == Infinity) td.innerHTML = "&infin;";
                else td.textContent = distanceMatrix[i][j];
                
                tr.append(td);
            }
            distanceMatrixArea.append(tr);
        }
        
    })

})