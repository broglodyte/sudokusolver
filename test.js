//test.js

var fs = require('fs');
var puzzleData = fs.readFileSync('pData.txt', 'utf8').replace(/\r\n/g, '').replace(/\D/g, '0');//.split('');
//console.log(`puzzleData: ${puzzleData}`);
//console.log(`length:     ${puzzleData.length}`);

var SudokuSolver = require('./SudokuSolver');

SudokuSolver.Init(puzzleData);

SudokuSolver.Print(false);
	
SudokuSolver.Solve();


SudokuSolver.Print(false);
	