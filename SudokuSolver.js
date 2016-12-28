"use strict";

var colors = require('colors');
var _ = require('lodash');

colors.setTheme({
	given : ['white'],
	solved : ['green', 'bold'],
	unsolved : [ 'magenta', 'bgRed'],
	possible : ['gray', 'bgBlue'],
	lines : ['white', 'bold'],
	innerlines : ['white', 'dim'],
	none : ['white', 'bold']
});

const MAX_ITERATIONS = 20;
const ALL_DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const unknownChar = '▓';//˽‾▓░';

var showBreadCrumbs = true;

function SudokuSolver() {
	this.Matrix = [];
	this.Load(_.padStart('', 81, '0'));
}
	/*
	v2:
			  A   B   C   D   E   F   G   H   I
			┏━━━┯━━━┯━━━┳━━━┯━━━┯━━━┳━━━┯━━━┯━━━┓
		 1	┃ _	│ 8 │ 4 ┃ 3 │ _ │ _ ┃ _ │ _ │ 1 ┃ 
			┠───┼───┼───╂───┼───┼───╂───┼───┼───┨
		 2	┃   │   │   ┃   │   │   ┃   │   │   ┃
			┠───┼───┼───╂───┼───┼───╂───┼───┼───┨
		 3	┃   │   │   ┃   │   │   ┃   │   │   ┃
			┣━━━┿━━━┿━━━╋━━━┿━━━┿━━━╋━━━┿━━━┿━━━┫
		 4	┃   │   │   ┃   │   │   ┃   │   │   ┃
			┠───┼───┼───╂───┼───┼───╂───┼───┼───┨
		 5	┃   │   │   ┃   │   │   ┃   │   │   ┃
			┠───┼───┼───╂───┼───┼───╂───┼───┼───┨
		 6	┃   │   │   ┃   │   │   ┃   │   │   ┃
			┣━━━┿━━━┿━━━╋━━━┿━━━┿━━━╋━━━┿━━━┿━━━┫
		 7	┃   │   │   ┃   │   │   ┃   │   │   ┃
			┠───┼───┼───╂───┼───┼───╂───┼───┼───┨
		 8	┃   │   │   ┃   │   │   ┃   │   │   ┃
			┠───┼───┼───╂───┼───┼───╂───┼───┼───┨
		 9	┃   │   │   ┃   │   │   ┃   │   │   ┃
			┗━━━┷━━━┷━━━┻━━━┷━━━┷━━━┻━━━┷━━━┷━━━┛
	*/

var proto = {
	Load : function (initData) {
		if (typeof initData === 'string')
			this.Data = initData.split('');
		else
			this.Data = initData;
		
		var _dm = [];
		var _da = [];
		for (var _dp = 0; _dp < 81; _dp++) {
			let _d = parseInt(this.Data[_dp]);
			let _y = _.floor(_dp / 9);
			let _x = _dp % 9;
			let _g = _d !== 0;
			let _dObj = {
				row : _y,
				col : _x,
				candidates : _g ? [] : ALL_DIGITS.slice(),
				given : _g,
				solved : _g,
				value : _g ? _d : undefined,
				display : _g ? _d.toString() : ''
			};

			if (_x === 0)
				_dm[_y] = [];

			_dm[_y][_x] = _dObj;
			_da[_dp] = _dObj;
		}
		this.Matrix = _dm;
		this.Data = _da;
	},
	Clone : function () {
		var newMatrix = [];
		for(var i=0;i<this.Matrix.length;i++) {
			newMatrix[i] = [];
			for(var j=0;j<this.Matrix[i].length;j++) {
				var oldObj = this.Matrix[i][j];
				newMatrix[i][j] = {
					row : oldObj.row,
					col : oldObj.col,
					candidates : oldObj.candidates.slice(),
					given : oldObj.given,
					solved : oldObj.solved,
					value : oldObj.value,
					display : oldObj.display
				};
			}
		}
		return newMatrix;
	},
	GetMatrix : function () {
		return this.Matrix;
	},
	ShowBreadCrumbs : function(_showCrumbs) {
		showBreadCrumbs = _showCrumbs;		
	},
	toString : function (_showPoss) {
		var buildString = '     A   B   C   D   E   F   G   H   I   \n'.cyan.bold;
		buildString    += '   ┏━━━┯━━━┯━━━┳━━━┯━━━┯━━━┳━━━┯━━━┯━━━┓ \n'.lines;
		for (var y = 0; y < 9; y++) {
			if (y == 3 || y == 6)
				buildString += '   ┣━━━┿━━━┿━━━╋━━━┿━━━┿━━━╋━━━┿━━━┿━━━┫ \n'.lines;
			else if( y > 0 ) {
				
				buildString += '   ┠'.lines;
				buildString += '┈┈┈┼┈┈┈┼┈┈┈'.innerlines;
				buildString += '╂'.lines;
				buildString += '┈┈┈┼┈┈┈┼┈┈┈'.innerlines;
				buildString += '╂'.lines;
				buildString += '┈┈┈┼┈┈┈┼┈┈┈'.innerlines;
				buildString += '┨ \n'.lines;
				
			}
			buildString +=  ` ${y+1} `.cyan.bold;
			buildString += '┃'.lines;
			for (var x = 0; x < 9; x++) {
				var dObj = this.Matrix[y][x];

				buildString += ' ';
				if (dObj.solved)
					buildString += dObj.display[dObj.given ? 'given' : 'solved'];
				else
					buildString += _showPoss ? dObj.candidates.length.toString().possible : unknownChar.unsolved;
				
				buildString += ' ';
				buildString += (x % 3 == 2) ? '┃'.lines : '┊'.innerlines;
			}
			buildString += '\n';
		}
		buildString += '   ┗━━━┷━━━┷━━━┻━━━┷━━━┷━━━┻━━━┷━━━┷━━━┛ \n'.lines;

		return buildString;
	},

	toHashString : function (prettify) {
		return _.flattenDeep(this.Matrix).map('display').join();
	},
	toDataString : function () {},
	RowSet : function (_rowNum) {
		var rowArray = [];
		var m = this.Matrix;
		for (var i = 0; i < 9; i++) {
			var _val = m[_rowNum][i];
			if (_val.solved)
				rowArray.push(_val.value);
		}
		return rowArray;
	},
	ColumnSet : function (_colNum) {
		var colArray = [];
		var m = this.Matrix;
		for (var j = 0; j < 9; j++) {
			var _val = m[j][_colNum];
			if (_val.solved)
				colArray.push(_val.value);
		}
		return colArray;
	},
	SubGridSet : function (_x, _y) {
		var xPrime = 3 * parseInt(_x / 3);
		var yPrime = 3 * parseInt(_y / 3);
		var subGridArray = [];

		var m = this.Matrix;
		for (var xx = xPrime; xx < xPrime + 3; xx++)
			for (var yy = yPrime; yy < yPrime + 3; yy++) {
				var _val = m[yy][xx];
				if (_val.solved)
					subGridArray.push(_val.value);
			}
		return subGridArray;
	},
	Solve : function () {
		printBreadCrumbs('Solve():');
		this.__SolveIterative();
	},
	__SolveIterative : function() {
		var previousSudoState = this.Clone();
		for(var _iterations=0;_iterations<MAX_ITERATIONS;_iterations++) {			
			var changes = this.SolveIncremental(_iterations);
			
			console.log(`>>>Changes: ${changes}<<<`);
			if(changes===0)
				break;
		}
	},
	SolveIncremental : function() {
		var _step = arguments.length>0 ? arguments[0] : '?';
		printBreadCrumbs(`SolveIncremental(${_step}):`);
		
		var changeBachelors  = this.ReduceCandidates();
		var changeSnowflakes = this.FindSnowflakes();
		return changeBachelors + changeSnowflakes;
	},
	ReduceCandidates : function() {
		printBreadCrumbs("ReduceCandidates:");
		let changesMade = 0;
		var m = this.Matrix;
		for (var i = 0; i < 9; i++) {
			for (var j = 0; j < 9; j++) {
				var o = m[i][j];
				if (o.solved)
					continue;

				var elementList = this.getCandidateList(i, j);
				if (elementList.length === 1)
					changesMade += this.SetCellValue(o, elementList[0]);
				else if(!_.isEqualWith(o.candidates, elementList, (a1,a2) => { return (_.join(_.sortedUniq(a1), '') === _.join(_.sortedUniq(a2), ''))})) {
					o.candidates = elementList;
					changesMade++;
				}
			}
		}
		return changesMade;
	},
	FindSnowflakes : function() {
		printBreadCrumbs("FindSnowflakes:");
		let changesMade = 0;
		var m = this.Matrix;
		
		for(var i=0;i<9;i++) {
			for(var j=0;j<9;j++) {
				var _vObj = m[i][j];
				if(_vObj.solved)
					continue;
				
				var currentCandyList = _vObj.candidates;
				if(currentCandyList.length===1) {
					changesMade += this.SetCellValue(_vObj, currentCandyList[0]);
					continue;
				}
				
				var rowCandyLists = this.getCandidateListsByRow(i, j);
				var colCandyLists = this.getCandidateListsByColumn(i, j);
				var subCandyLists = this.getCandidateListsBySubgrid(i, j);
				//	for each possible snowflake...
				for(var sfPtr=0; sfPtr<currentCandyList.length; sfPtr++) {
					var snowflake = currentCandyList[sfPtr];
					
					// console.log(`     row : ${rowCandyLists}`);
					if(_.every(rowCandyLists, (_list) => { return !_.includes(_list, snowflake) })) {
						//	snowflake found
						changesMade += this.SetCellValue(_vObj, snowflake);
						break;
					}
					
					// console.log(`     col : ${colCandyLists}`);
					if(_.every(colCandyLists, (_list) => { return !_.includes(_list, snowflake) })) {
						changesMade += this.SetCellValue(_vObj, snowflake);
						break;
					}
					
					// console.log(`     sub : ${subCandyLists}`);
					if(_.every(subCandyLists, (_list) => { return !_.includes(_list, snowflake) })) {
						changesMade += this.SetCellValue(_vObj, snowflake);
						break;
					}
				}
			}
		}
		return changesMade;
	},
	SetCellValue : function(_vObj, _val) {
		if(_vObj.value === _val)
			return 0;
		
		let changesMade = 0;
		var row = _vObj.row;
		var col = _vObj.col;
		_vObj.value = _val;
		_vObj.solved = true;
		_vObj.display = _val.toString();
		_vObj.candidates = [];
		
		var colAlpha = String.fromCharCode(0x41 + col)
		printBreadCrumbs(`+SetCellValue: [${row+1}][${colAlpha}] = ${_val}`);

		this.Matrix[row][col] = _vObj;
		
		//	remove _val from all candidate lists in row:
		for (var _col = 0; _col < 9; _col++) {
			if (_col == col)
				continue;

			var _adjObj = this.Matrix[row][_col];
			_.pull(_adjObj.candidates, _val);
			if (_adjObj.candidates.length === 1)
				changesMade += this.SetCellValue(_adjObj, _adjObj.candidates[0]);
		}

		//	remove _val from all candidate lists in column:
		for (var _row = 0; _row < 9; _row++) {
			if (_row == row)
				continue;

			var _adjObj = this.Matrix[_row][col];
			_.pull(_adjObj.candidates, _val);
			if (_adjObj.candidates.length === 1)
				changesMade += this.SetCellValue(_adjObj, _adjObj.candidates[0]);
		}
		
		//	same for sub-grid:			
		var yPrime = 3 * parseInt(row / 3);
		var xPrime = 3 * parseInt(col / 3);

		for(_row=yPrime;_row<yPrime+3;_row++) {
			for(_col=xPrime;_col<xPrime+3;_col++) {
				if(_row==row && _col==col)
					continue;
				
				var _adjObj = this.Matrix[_row][_col];
				_.pull(_adjObj.candidates, _val);
				if (_adjObj.candidates.length === 1)
					changesMade += this.SetCellValue(_adjObj, _adjObj.candidates[0]);
			}
		}
		
		return changesMade;
	},
	getCandidateListsByRow : function(_y, ignoreColumn) {
		var listOfCandidateLists = [];
		var m = this.Matrix;
		
		for(var _col=0;_col<9;_col++) {
			var _valObj = m[_y][_col];
			if(_col === ignoreColumn || _valObj.solved || _valObj.candidates.length===0)
				continue;
			
			listOfCandidateLists.push(_valObj.candidates);
		}
		
		return listOfCandidateLists;
	},
	getCandidateListsByColumn : function(ignoreRow, _x) {
		var listOfCandidateLists = [];
		var m = this.Matrix;
		
		for(var _row=0;_row<9;_row++) {
			var _valObj = m[_row][_x];
			if(_row === ignoreRow || _valObj.solved || _valObj.candidates.length===0)
				continue;
			
			listOfCandidateLists.push(_valObj.candidates);
		}
		
		return listOfCandidateLists;		
	},
	getCandidateListsBySubgrid : function(_y, _x) {
		var m = this.Matrix;
		var yPrime = 3 * Math.floor(_y / 3);
		var xPrime = 3 * Math.floor(_x / 3);
		var listOfCandidateLists = [];
		
		for(var _row=yPrime;_row<yPrime+3;_row++) {
			for(var _col=xPrime;_col<xPrime+3;_col++) {
				if(_row === _y && _col === _x)
					continue;
				
				var _valObj = m[_row][_col];
				if(_valObj.solved || _valObj.candidates.length===0)
					continue;
				
				listOfCandidateLists.push(_valObj.candidates);
			}
		}		
		return listOfCandidateLists;
	},
	getCandidateList : function (_y, _x) {
		if (_.isInteger(this.Matrix[_y][_x]))
			return [this.Matrix[_y][_x]];
		var theBachelor = ALL_DIGITS.slice();
		var rowFilter = this.RowSet(_y);
		var colFilter = this.ColumnSet(_x);
		var subGridFilter = this.SubGridSet(_x, _y);
		var uberFilter = _.uniq(_.flattenDeep([rowFilter, colFilter, subGridFilter]));
		_.pullAll(theBachelor, uberFilter);
		return theBachelor;
	}
};

function printBreadCrumbs(_text) {
	if(!showBreadCrumbs) return;
	var indentVal = getStackDistance();
	// console.log('indent: ' + indentVal);
	var _printString = _.repeat(' ', indentVal*2);
	_printString += `└► ${_text}`;
	console.log(_printString);
		
	function getStackDistance() {
		var stackTrace = new Error().stack;
		var traceLines = stackTrace.split('\n').slice(2);
		var stackSize = 0;
		
		while(stackSize < traceLines.length)
			if(traceLines[stackSize++].includes('__SolveIterative'))
				return stackSize-2;
			
		return 0;
	}
}

function isSolved(_mm) {
	for (var v = 0; v < 81; v++)
		if (!_mm[Math.floor(v / 9)][v % 9].solved)
			return false;
	return true;
}

// var properties = {
	// IsSolved : {
		// get : () => {
			// return isSolved(this.Matrix);
		// },
		// enumerable: true
	// }
// };


function isDifferent(_m1, _m2) {
	return !_.isEqual(_m1, _m2);
	// for(var i=0;i<9;i++)
		// for(var j=0;j<9;j++)
			// if(
}

SudokuSolver.prototype = Object.create(proto, {});
SudokuSolver.prototype.constructor = SudokuSolver;

module.exports = SudokuSolver;
