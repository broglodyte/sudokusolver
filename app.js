//test.js

var fs = require('fs');
// var puzzleData = fs.readFileSync('pData_hard.txt', 'utf8').replace(/\r\n/g, '').replace(/\D/g, '0');//.split('');
var puzzleData = "270000400908027000035006000003000004007805200600000100000700510000560308004000029";
// puzzleData = "080900070050008030900007100000800040002546700040001000008300006070600050010009020";
console.log(`puzzleData: ${puzzleData}`);
console.log(`length:     ${puzzleData.length}`);

var SudokuSolver = require('./SudokuSolver');
var sudokuSolver = new SudokuSolver();
sudokuSolver.ShowBreadCrumbs(false);
sudokuSolver.Load(puzzleData);

var printPuzzle = sudokuSolver.toString();
var printPossibles = sudokuSolver.toString(true);
console.log(printPuzzle);
console.log(printPossibles);

sudokuSolver.Solve();

console.log('After Solve(): ');

var printPuzzle = sudokuSolver.toString();
var printPossibles = sudokuSolver.toString(true);
console.log(printPuzzle);
// console.log(printPossibles);
