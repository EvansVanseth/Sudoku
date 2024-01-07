let matriz = [
  [0,0,0, 0,0,0, 0,0,0],
  [0,0,0, 0,0,0, 0,0,0],
  [0,0,0, 0,0,0, 0,0,0],

  [0,0,0, 0,0,0, 0,0,0],
  [0,0,0, 0,0,0, 0,0,0],
  [0,0,0, 0,0,0, 0,0,0],

  [0,0,0, 0,0,0, 0,0,0],
  [0,0,0, 0,0,0, 0,0,0],
  [0,0,0, 0,0,0, 0,0,0]
];


let candidatos = new Array(9);
for (let i=0;i<9;i++) {
  candidatos[i] = new Array(9);
  for (let j=0;j<9;j++) {
    candidatos[i][j] = 
      [ 
        true, true, true, 
        true, true, true, 
        true, true, true
      ]
  }
}

let notas = new Array(9);
for (let i=0;i<9;i++) {
  notas[i] = new Array(9);
  for (let j=0;j<9;j++) {
    notas[i][j] = 
      [ 
        false, false, false, 
        false, false, false, 
        false, false, false
      ]
  }
}

let htmlOutput = '';
let fila = 0;
let col = 0;
let selCellRow = 0;
let selCellCol = 0;
let numberMode = 0;
/* 0 : Poner número
   1 : Poner candidatos
   2 : Poner notas
 */
let showCand = false;

function toogleModeC() { 
  numberMode = (numberMode!==1 ? 1:0);
  mostrarTabla();
}

function toogleModeN() { 
  numberMode = (numberMode!==2 ? 2:0);
  mostrarTabla();
}

function toogleShowC() { 
  showCand = !showCand;
  mostrarTabla();
}

function selectCell(setRow, setCol) {
  selCellRow = setRow;
  selCellCol = setCol;
  mostrarTabla();
}

function vaciarNotas(preguntar) {
  if (!preguntar ||
      window.confirm("¿Estas seguro de querer eliminar todas las notas?")) {
    for (let i=0; i<9 ; i++) {
      for (let j=0; j<9 ; j++) {
        for (let k=0; k<9 ; k++) {
          notas[i][j][k]=false; } }
    }
    mostrarTabla();
  }
  
}

function vaciarCandidatos(preguntar) {
  if (!preguntar ||
      window.confirm("¿Estas seguro de querer liberar los candidatos marcados?")) {
    for (let i=0; i<9 ; i++) {
      for (let j=0; j<9 ; j++) {
        for (let k=0; k<9 ; k++) {
          candidatos[i][j][k]=true; } }
    }
    mostrarTabla();
  }
}

function vaciarNumeros() {
  if(window.confirm("¿Estas seguro de querer limpiar el SUDOKU?")) {
    vaciarNotas(false);
    vaciarCandidatos(false);
    for (let i=0; i<9 ; i++) {
      for (let j=0; j<9 ; j++) {
          matriz[i][j]=0; }
    }
    mostrarTabla();
  }

}

function findValueinCube (fcCellRow, fcCellCol, fcValue) {

  let fcCubeRow = Math.trunc(fcCellRow / 3) * 3;
  let fcCubeCol = Math.trunc(fcCellCol / 3) * 3;
  let fcRow = 0;
  let fcCol = 0;

  for (fcRow=fcCubeRow; fcRow<fcCubeRow+3; fcRow++) {
    for (fcCol=fcCubeCol; fcCol<fcCubeCol+3; fcCol++) {
      if(fcValue === matriz[fcRow][fcCol]) return true;
    }    
  }   

  return false;
}

function findValueinCol (ficCellCol, ficValue) {
  let i = 0;
  for (i=0; i<9; i++) {
    if(ficValue === matriz[i][ficCellCol]) return true;
  }
  return false;
}

function findValueinRow (firCellRow, firValue) {
  let i = 0;
  for (i=0; i<9; i++) {
    if(firValue === matriz[firCellRow][i]) return true;
  }
  return false;
}

function testValueForCell (tsCellRow, tsCellCol, tsValue) {
  let okValue = tsValue;
  let candGrey = '';
  if(showCand) {
    if (!candidatos[tsCellRow][tsCellCol][tsValue-1]) candGrey = ' cand_grey';
    if (findValueinRow(tsCellRow, tsValue)) okValue = '&nbsp';
    if (findValueinCol(tsCellCol, tsValue)) okValue = '&nbsp';
    if (findValueinCube(tsCellRow, tsCellCol, tsValue)) okValue = '&nbsp';
  } else {
    if(!notas[tsCellRow][tsCellCol][tsValue-1]) okValue = '&nbsp';
  }

  return `<div class="celdaTest${candGrey}"><p>${okValue}</p></div>`;
}

function checkCell (chCellRow, chCellCol) {

  let htmlchCell = `<div class="celdaVacia">
                    ${testValueForCell(chCellRow, chCellCol, 1)}
                    ${testValueForCell(chCellRow, chCellCol, 2)}
                    ${testValueForCell(chCellRow, chCellCol, 3)}
                    ${testValueForCell(chCellRow, chCellCol, 4)}
                    ${testValueForCell(chCellRow, chCellCol, 5)}
                    ${testValueForCell(chCellRow, chCellCol, 6)}
                    ${testValueForCell(chCellRow, chCellCol, 7)}
                    ${testValueForCell(chCellRow, chCellCol, 8)}
                    ${testValueForCell(chCellRow, chCellCol, 9)}
  </div>`;
  return htmlchCell;
}


function makeCell (cellRow, cellCol) {
  let htmlCell = '';
  let selected = '';
  let textoCelda = matriz[cellRow][cellCol].toString();
  if (textoCelda==='0') textoCelda='';
  if (selCellRow===cellRow && selCellCol===cellCol) {
    selected=' seleccionado'; }

  htmlCell = `<div class="celda${selected}" onclick="selectCell(${cellRow},${cellCol})">`;
  
  if (textoCelda !== '' ) htmlCell += `<p>${textoCelda}</p>`;
  else htmlCell += checkCell(cellRow, cellCol);
  
  htmlCell += `</div>`;
  return htmlCell;

}

function makeCube(cubeRow, cubeCol) {
  htmlCube = '<div class="cubo">';
  let IniRow = cubeRow*3;
  let IniCol = cubeCol*3;
  let cRow, cCol;
  for (cRow=IniRow; cRow<IniRow+3; cRow++) {
    htmlCube += '<div class="fila">';
    for (cCol=IniCol; cCol<IniCol+3; cCol++) {
      htmlCube += makeCell(cRow, cCol);
    }    
    htmlCube+='</div>';
  }  
  htmlCube+='</div>';
  return htmlCube;
}

function cargarDatos() {
  let lsMatriz = localStorage.getItem("sudoku_matriz");
  if (lsMatriz !== null) {
    matriz = JSON.parse(lsMatriz);
  }

  let lsCandidatos = localStorage.getItem("sudoku_candidatos");
  if (lsCandidatos !== null) candidatos = JSON.parse(lsCandidatos);

  let lsNotas = localStorage.getItem("sudoku_notas");
  if (lsNotas !== null) notas = JSON.parse(lsNotas);

  let lsMode = localStorage.getItem("sudoku_modo");
  if (lsMode !== null) numberMode = JSON.parse(lsMode);

  let lsShowCand = localStorage.getItem("sudoku_showCand");
  if (lsShowCand !== null) showCand = JSON.parse(lsShowCand);

  let lsCellRow = localStorage.getItem("sudoku_cell_row");
  if (lsCellRow !== null) selCellRow = JSON.parse(lsCellRow);

  let lsCellCol = localStorage.getItem("sudoku_cell_col");
  if (lsCellCol !== null) selCellCol = JSON.parse(lsCellCol);
  
  mostrarTabla();
}

function guardarDatos() {
  localStorage.setItem("sudoku_matriz",JSON.stringify(matriz));
  localStorage.setItem("sudoku_candidatos",JSON.stringify(candidatos));
  localStorage.setItem("sudoku_notas",JSON.stringify(notas));
  localStorage.setItem("sudoku_modo",JSON.stringify(numberMode));
  localStorage.setItem("sudoku_showCand",JSON.stringify(showCand));
  localStorage.setItem("sudoku_cell_row",JSON.stringify(selCellRow));
  localStorage.setItem("sudoku_cell_col",JSON.stringify(selCellCol));
}

function mostrarTabla() {
  
  if(!showCand && numberMode===1) numberMode=0;

  htmlOutput = '';
  for (fila=0; fila<3; fila++) {
    for (col=0; col<3; col++) {
      htmlOutput += makeCube(fila, col);
    }    
  }

  let btnC  = document.getElementById("btnModeC");
  let btnN  = document.getElementById("btnModeN");
  let btnSC = document.getElementById("btnShowC");

  switch (numberMode) {
    case 0:
      btnC.classList.remove('activado');
      btnN.classList.remove('activado');
      break;
    case 1:
      btnC.classList.add('activado');
      btnN.classList.remove('activado');
      break;
    case 2:
      btnC.classList.remove('activado');
      btnN.classList.add('activado');
      break;
  }

  showCand ? btnSC.classList.add('activado') : btnSC.classList.remove('activado');

  let sudoku = document.getElementById("main_square");
  sudoku.innerHTML = htmlOutput;
  
}

function setNumber(teclaNumber) {
  if (numberMode === 0) { matriz[selCellRow][selCellCol] = teclaNumber; }
    if (numberMode === 1) { 
      candidatos[selCellRow][selCellCol][teclaNumber-1] = 
      !candidatos[selCellRow][selCellCol][teclaNumber-1]; 
    }
    if (numberMode === 2) {
      notas[selCellRow][selCellCol][teclaNumber-1] = 
      !notas[selCellRow][selCellCol][teclaNumber-1];
    }
    mostrarTabla();
}

window.addEventListener("keydown", function(event) {
  if (event.key === undefined) return;
  if (event.key === "ArrowUp" && selCellRow>0) {
    selCellRow--; mostrarTabla(); }
    
  if (event.key === "ArrowDown" && selCellRow<8) {
    selCellRow++; mostrarTabla(); }
    
  if (event.key === "ArrowLeft" && selCellCol>0) {
    selCellCol--; mostrarTabla(); }
    
  if (event.key === "ArrowRight" && selCellCol<8) {
    selCellCol++; mostrarTabla(); }

  let teclaNum;
  teclaNum = parseInt(event.key);
  if (!isNaN(teclaNum)) setNumber(teclaNum);

})

window.addEventListener("load", cargarDatos);