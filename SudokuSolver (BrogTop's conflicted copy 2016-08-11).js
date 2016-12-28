var colors = require('colors');
var _ = require('lodash');

colors.setTheme({
	given: ['white'],
	solved: ['green', 'bgMagenta', 'bold'],
	unsolved: ['red', 'bgBlue', 'bold'],
	lines: ['cyan'],
	none: ['white']
});

const ALL_DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const unknownChar = '_';

function SudokuSolver() {
}

var proto = {
	Load: function (initData) {
		if (typeof initData === 'string')
			this.Data = initData.split('');
		else
			this.Data = initData;
		
		var _m = [];
		for (var rows = 0; rows < 9; rows++) {
			_m[rows] = [];
			for (var cols = 0; cols < 9; cols++) {
				var gridValue = parseInt(this.Data[rows * 9 + cols]);
				_m[rows][cols] = gridValue ? gridValue + 10 : ALL_DIGITS.slice();
			}
		}
		this.Matrix = _m;

	},
	Print: function (_showPoss) {
		out(' ┌───────┬───────┬───────┐ \n');
		for (var y = 0; y < 9; y++) {
			if (y % 3 == 0)
				out(' ├───────┼───────┼───────┤ \n', 'lines');

			for (var x = 0; x < 9; x++) {
				if (x == 3 || x == 6)
					out(' │', 'lines');

				out(' ');
				var elemVal = this.Matrix[y][x];
				var initVal = false;

				if (_.isInteger(elemVal)) {
					if (elemVal > 9) {
						elemVal -= 10;
						initVal = true;
					}
					out(elemVal, initVal ? 'given' : 'solved');
				}
				else {
					out(_showPoss ? elemVal.length : unknownChar, 'unsolved');
				}
			}
			out(' │\n', 'lines');
		}
		out(' └───────┴───────┴───────┘ \n', 'lines');

		function out(_text, _style) {
			var style = _style || 'none';
			var outStr = _text.toString();
			process.stdout.write(outStr[style]);
		}
	},

	RowSet: function (_rowNum) {
		var rowArray = [];
		for (var i = 0; i < 9; i++) {
			var _val = this.Matrix[_rowNum][i];
			if (_.isInteger(_val))
				rowArray.push(_val % 10);
		}
		return rowArray;
	},
	ColumnSet: function (_colNum) {
		var colArray = [];
		for (var j = 0; j < 9; j++) {
			var _val = this.Matrix[j][_colNum];
			if (_.isInteger(_val))
				colArray.push(_val % 10);
		}
		return colArray;
	},
	SubGridSet: function (_x, _y) {
		var xPrime = 3 * parseInt(_x / 3);
		var yPrime = 3 * parseInt(_y / 3);
		var subGridArray = [];

		for (xx = xPrime; xx < xPrime + 3; xx++)
			for (yy = yPrime; yy < yPrime + 3; yy++)
				if (_.isInteger(this.Matrix[yy][xx]))
					subGridArray.push(this.Matrix[yy][xx] % 10);
		return subGridArray;
	},

	ShowPossible: function () {
		this.Print(true);
	},
	Solve: function () {
		var iterations = 0;
		while (!isSolved(this.Matrix) && ++iterations < 100)
			for (i = 0; i < 9; i++)
				for (j = 0; j < 9; j++) {
					var elementList = this.getCandidateList(i, j);
					this.Matrix[j][i] = elementList.length === 1 ? elementList[0] : elementList;
					// this.Print(true);
				}

		console.log(`Iterations: ${iterations}`)
		return isSolved(this.Matrix);
	},
	getCandidateList: function (_x, _y) {
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

function isSolved(_mm) {
	for (var v = 0; v < 81; v++)
		if (!_.isInteger(_mm[_.floor(v / 9)][v % 9]))
			return false;
	return true;
}

SudokuSolver.prototype = Object.create(proto, {});
SudokuSolver.prototype.constructor = SudokuSolver;

module.exports = new SudokuSolver();
