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

function kosaraju(graph) {
    let n = graph.length;
    let visited = new Array(n).fill(false);
    let stack = [];
  
    // Функция для добавления вершин в стек в порядке post-order
    function dfs1(v) {
      visited[v] = true;
      for (let i = 0; i < n; i++) {
        if (graph[v][i] && !visited[i]) {
          dfs1(i);
        }
      }
      stack.push(v);
    }
  
    // Функция для обхода графа в порядке, обратном post-order, и нахождения компонент сильной связности
    function dfs2(vertex, component) {
        visited[vertex] = true;
        component.push(vertex);
        for (let i = 0; i < graph[vertex].length; i++) {
          if (graph[vertex][i] && !visited[i]) {
            dfs2(i, component);
          }
        }
      }
  
    // Обход графа в порядке post-order
    for (let i = 0; i < n; i++) {
      if (!visited[i]) {
        dfs1(i);
      }
    }
    
    

    // Обход графа в порядке, обратном post-order, и нахождение компонент сильной связности
    visited.fill(false);
    let components = [];
    while (stack.length) {
      let v = stack.pop();
      if (!visited[v]) {
        let component = [];
        dfs2(v, component);
        components.push(component);
      }
    }
    console.log(components);
    return components;
}

function tarjan(graph) {
    const n = graph.length;
    const index = new Map();
    const lowlink = new Array(n).fill(Infinity);
    const onStack = new Array(n).fill(false);
    const stack = [];
    const result = [];
  
    let counter = 0;
  
    function strongconnect(v) {
      index.set(v, counter);
      lowlink[v] = counter;
      counter++;
      stack.push(v);
      onStack[v] = true;
  
      for (let i = 0; i < n; i++) {
        if (graph[v][i] == 1) {
          if (!index.has(i)) {
            strongconnect(i);
            lowlink[v] = Math.min(lowlink[v], lowlink[i]);
          } else if (onStack[i]) {
            lowlink[v] = Math.min(lowlink[v], index.get(i));
          }
        }
      }
  
      if (lowlink[v] === index.get(v)) {
        const component = [];
        let w;
        do {
          w = stack.pop();
          onStack[w] = false;
          component.push(w);
        } while (w !== v);
        result.push(component);
      }
    }
  
    for (let i = 0; i < n; i++) {
      if (!index.has(i)) {
        strongconnect(i);
      }
    }
  
    return result;
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
                matrix[i][j] = Number(td.firstChild.value);
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

        console.log(matrix);
        let components = tarjan(matrix);
        console.log(components);
        
    })

})