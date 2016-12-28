//suso.js

var _ = require('lodash');
var SudokuSolver = require('./SudokuSolver');
var sudokuSolver = new SudokuSolver();

function ResetGrid() {
	sudokuSolver = new SudokuSolver();
	
	for(i=0;i<81;i++) {
		var inpObj = document.getElementById('C'+_.padStart(i.toString(9), 2, '0'));
		inpObj.value = '';
		inpObj.style.color = '#000000';
		inpObj.style.backgroundColor = '#ffffff';
	}	
}

function LoadFromGrid() {
	var _pd = "";
	for(i=0;i<81;i++)
		_pd+=document.getElementById('C'+_.padStart(i.toString(9), 2, '0')).value||0;
	document.getElementById('fromstring').value = _pd;
	console.log('pd-length: ' + _pd.length);
	
	LoadFromString();
}

function LoadFromString() {
	var _str = document.getElementById('fromstring').value;
	
	if(_str.length!==81) {
		alert('Invalid puzzle input');
		return false;			
	}
	sudokuSolver = new SudokuSolver();
	sudokuSolver.Load(_str);
	
	PopulateFormFromMatrix();
}

function PopulateFormFromMatrix() {
	var matrix = sudokuSolver.Matrix;
	
	for(i=0;i<9;i++) {
		for(j=0;j<9;j++) {
			var inp = document.getElementById(`C${i}${j}`);
			var val = matrix[i][j];
			inp.value = val.display;
			// debugger;
			if(val.given) {
				inp.style.color = '#000000';
				inp.style.backgroundColor = '#dddddd';
				inp.title = 'Given: ' + val.display;
				inp.readOnly = true;
				continue;
			}
			
			if(val.solved) {
				inp.style.backgroundColor='#ddffdd';	// green-ish
				inp.style.color = '#000080';
				inp.title = 'Solved: ' + val.display;
				// inp.value = val.display;
				continue;
			}
			
			var candyString = '['+val.candidates.join(' ')+']';
			inp.title=candyString;
			
			inp.style.backgroundColor = '#ffdddd';
		}
	}
}
	
function SolvePuzzle() {
	sudokuSolver.Solve();
	// debugger;
	PopulateFormFromMatrix();
}
