document.addEventListener("DOMContentLoaded", () => {
    let inputDimension = document.querySelector(".matrix-dimension");
    let matrixDimension;
    let matrixArea = document.querySelector('.input-matrix');
    inputDimension.addEventListener("change", (e) =>{
        matrixDimension = e.target.value;
        
        while (matrixArea.firstChild) {
            matrixArea.removeChild(matrixArea.firstChild);
        }
        
        for (let i = 0; i < matrixDimension; ++i){
            let inputRow = document.createElement('div');
            inputRow.className = "matrix-row";

            for (let i = 0; i < matrixDimension; ++i){
                
                let input = document.createElement('input');
                input.type = "text";
                inputRow.append(input);
            }
            matrixArea.append(inputRow);
        }
        
    })
})