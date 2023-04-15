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

function createHierarchyList(set) {
    let ul = createElem("ul", "set", "", "");

    for (let i = 0; i < set.length; ++i) {
        let str = `Уровень ${i} = `;
        str += set[i].join(", ");

        let li = createElem("li", "set-item", "", str);

        ul.append(li);
    }
    return ul;
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
    let matrixDimension, matrix, leftSet, hierarchyList, newRightSet;
    let matrixArea = document.querySelector('.input-matrix'),
        hierarchyLevelArea = document.querySelector('.hierarchy-level'),
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

        let hierarchyArr = [];

        matrix = new Array(matrixDimension);
        leftSet = new Array(matrixDimension);
        newRightSet = new Array(matrixDimension);
        hierarchyList = [];
        for (let i = 0; i < matrixDimension; i++) {
            matrix[i] = new Array(matrixDimension);
            leftSet[i] = [];
            newRightSet[i] = [];
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
                }
            }

        }

        removeAllChilds(hierarchyLevelArea);
        removeAllChilds(rightSetArea);

        
        
    })

})

const graph = [
    [Infinity, 4, Infinity, Infinity, Infinity, Infinity, Infinity],
    [5, Infinity, 1, Infinity, Infinity, Infinity, Infinity],
    [Infinity, Infinity, Infinity, 11, 6, Infinity, Infinity],
    [Infinity, Infinity, 3, Infinity, 8, Infinity, Infinity],
    [Infinity, 1, Infinity, 3, Infinity, 15, Infinity],
    [8, 2, Infinity, Infinity, Infinity, Infinity, Infinity],
    [Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity]
  ];

  for (let key in graph) {
    console.log(levit(graph, key));
  }
  
  