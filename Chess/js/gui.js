//When we click the button with the ID "SetFen", it executes this
$("#SetFen").click(function ()
{
	//Inputs the value in the "Set Position" field from index.html to ParseFen
	NewGame($("#fenIn").val());
	SearchPosition();
});

//Sets a new game up on the GUI given an FEN string
function NewGame (fenStr)
{
	ParseFen(fenStr);
	PrintBoard();
	SetInitialBoardPieces();
}

//Clears all piece images from the GUI board
function ClearAllPieces()
{
	$(".Piece").remove();
}

//Sets piece images on the GUI board
function SetInitialBoardPieces ()
{	
	//Clears pieces, so we can add them
	ClearAllPieces();
	
	//Loops through all squares
	for (let sq = 0; sq < 64; sq++)
	{
		let sq120 = SQ120(sq);
		let pce = GameBoard.pieces[sq120]
		
		let file = FilesBrd[sq120];
		let rank = RanksBrd[sq120];
		
		if (pce >= PIECES.wP && pce <= PIECES.bK)
		{
			let rankName = `rank${rank + 1}`;
			let fileName = `file${file + 1}`;
			let pieceFileName = "images/" + SideChar[PieceCol[pce]] + PceChar[pce].toUpperCase() + ".png";
			let imageString = "<image src=\"" + pieceFileName + "\" class=\"Piece " + rankName + " " + fileName + "\"/>";
			//Adds these divs to the board, a give piece with a type / color
			$("#Board").append(imageString);
		}
	}
}

//Simply prints the arguments, will be called during click events
function ClickedSquare (pageX, pageY)
{
	console.log(`Clicked square at ${pageX}, ${pageY}`);
}

//Executes upon clicking a div of class type .Piece
$(document).on("click", ".Piece", function (e)
{
	console.log("Piece click");
	ClickedSquare(e.pageX, e.pageY);
});

//Executes upon clicking a div of class type .Square
$(document).on("click", ".Square", function (e)
{
	console.log("Square click");
	ClickedSquare(e.pageX, e.pageY);
});





























