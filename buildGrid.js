
function selectCell(cell) {
	cell.target.select();
}

function handleKeypress(keyEvent, id) {
	// console.log(keyEvent);
	var code = keyEvent.keyCode;	
	var row = parseInt(id[0]);
	var col = parseInt(id[1]);
	
	switch(code) {
		case 8:
			document.getElementById(`C${row}${col}`).value = '';
			return false;
			
		case 38:	// up arrow
			row--;
			if(row<0) row+=9;
			break;
			
		case 40:	// down arrow
			row++;
			if(row>=9) row-=9;
			break;
			
		case 37:	// left arrow
			col--;
			if(col<0) col+=9;
			break;
			
		case 39:	// right arrow
			col++;
			if(col>=9) col-=9;
			break;
			
		default:
			if(code>=49&&code<=57) {
				document.getElementById(`C${row}${col}`).value = '';
				return true;
			}
			else 
				// 
				return false;
			break;
	}
	var newId = `C${row}${col}`;
	document.getElementById(newId).focus();
}

function buildGrid() {
	out('');
	out('<form id="suForm">');
	out('<table>');
	
	for(i=0;i<9;i++) {
		out('<tr>');
		
		for(j=0;j<9;j++) {
			
			var numId = `${i}${j}`;
			//console.log(id);
			
			var id = 'C'+numId;
			
			out(`<td id="td_${id}">`);
			out(`<input type='text' id='${id}' class='ss' maxlength=1 size=1 onfocus="selectCell(event)" onkeydown="return handleKeypress(event, '${numId}')">`);
			out('</td>');
		}
		
		out('</tr>');
	}
	
	out('</table>');
	out('<p></p>');
	out('<input type="button" class="button" onClick="LoadFromString()" value="Load From String...">  |  ');
	out('<input type="button" class="button" onClick="SolvePuzzle()" value="Solve Puzzle">  |  ');
	out('<input type="button" class="button" onClick="ResetGrid()" value="Reset Grid"> <br>');
	out('<input type="text" value="080900070050008030900007100000800040002546700040001000008300006070600050010009020" class="fromstring" id="fromstring" maxlength="81"></input>');
	out('</form>');
	out('');		
	
	function out(_text) {
		document.write(_text + '\n');
	}
}