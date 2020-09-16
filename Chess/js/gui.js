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
	CheckAndSet();
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
		
		//Add the piece to the square, if valid
		if (pce >= PIECES.wP && pce <= PIECES.bK)
		{
			AddGUIPiece(sq120, pce);
		}
	}
}

//Handles square color changing to "deselected" on click event
function DeSelectSq (sq)
{
	//looping through each square object
	$(".Square").each(function(i) 
	{
		//If a square is on a given rank / file
		if (PieceIsOnSq(sq, $(this).position().top, $(this).position().left) == BOOL.TRUE)
		{
			//Add the html class "SqSelected"
			$(this).removeClass("SqSelected");
		}
	});
}

//Handles square color changing to "selected" on click event
function SetSqSelected (sq)
{
	//looping through each square object
	$(".Square").each(function(i) 
	{
		//If a square is on a given rank / file
		if (PieceIsOnSq(sq, $(this).position().top, $(this).position().left) == BOOL.TRUE)
		{
			//Add the html class "SqSelected"
			$(this).addClass("SqSelected");
		}
	});
}

//Simply prints the arguments, will be called during click events
function ClickedSquare (pageX, pageY)
{
	console.log(`Clicked square at ${pageX}, ${pageY}`);
	
	let position = $("#Board").position();	//top lefthand corner of board
	let workedX = Math.floor(position.left);	//x coordinate of top lefthand corner of board
	let workedY = Math.floor(position.top);		//y coordinate of top lefthand corner of board
	
	Math.floor(pageX);
	Math.floor(pageY);
	
	//Rank is flipped, since "y" coords start at top, but first rank is at bottom
	let file = Math.floor((pageX - workedX) / 60);
	let rank = 7 - Math.floor((pageY - workedY) / 60);
	
	let sq = FR2SQ(file, rank);
	
	console.log(`Clicked sq: ${PrSq(sq)}`);
	
	SetSqSelected(sq);
	
	return sq;
}

//Executes upon clicking a div of class type .Piece
$(document).on("click", ".Piece", function (e)
{
	console.log("Piece click");
	
	//If "from" user move not already set, then set it to this square
	if (UserMove.from == SQUARES.NO_SQ)
	{
		UserMove.from = ClickedSquare(e.pageX, e.pageY);
	}
	//If "from" user move is already set to some piece, then set the "to" square to this square
	else 
	{
		UserMove.to = ClickedSquare(e.pageX, e.pageY);
	}
	
	MakeUserMove();
});

//Executes upon clicking a div of class type .Square
$(document).on("click", ".Square", function (e)
{
	console.log("Square click");
	
	//Clicking on empty squares to make moves only makes sense if we already have a "from" square
	if (UserMove.from != SQUARES.NO_SQ)
	{
		//set the "to" user move to this square
		UserMove.to = ClickedSquare(e.pageX, e.pageY);
		MakeUserMove();
	}
});

//User making a move through the GUI
function MakeUserMove ()
{
	//Both to and from squares must be defined
	if (UserMove.from != SQUARES.NO_SQ && UserMove.to != SQUARES.NO_SQ)
	{
		console.log(`User Move: ${PrSq(UserMove.from)} ${PrSq(UserMove.to)}`);
		
		//move
		let parsed = ParseMove(UserMove.from, UserMove.to);
		
		if (parsed != NOMOVE)
		{
			//Makes the move on the internal board
			MakeMove(parsed);
			PrintBoard();
			//Updates the pieces images on the external board
			MoveGUIPiece(parsed);
			//Checks if game over
			CheckAndSet();
		}
		
		//Deselecting squares on GUI
		DeSelectSq(UserMove.from);
		DeSelectSq(UserMove.to);
		
		//Clearing the UserMoves, because we made a move
		UserMove.from = SQUARES.NO_SQ;
		UserMove.to = SQUARES.NO_SQ;
	}
}

//Returns true if there is a piece on the square
function PieceIsOnSq (sq, top, left)
{
	if ((RanksBrd[sq] == 7 - Math.round(top / 60)) && 
		 FilesBrd[sq] == Math.round(left / 60))
	{
		return BOOL.TRUE;
	}
	else 
	{
		return BOOL.FALSE;
	}
}

//Removing a piece from the GUI
function RemoveGUIPiece (sq)
{
	//looping through each piece object
	$(".Piece").each(function(i) 
	{
		//If a square is on a given rank / file
		if (PieceIsOnSq(sq, $(this).position().top, $(this).position().left) == BOOL.TRUE)
		{
			//Removes all html classes from this object
			$(this).remove();
		}
	});
}

//Adds a piece from the GUI
function AddGUIPiece (sq, pce)
{
	let rankName = `rank${RanksBrd[sq] + 1}`;
	let fileName = `file${FilesBrd[sq] + 1}`;
	
	let pieceFileName = "images/" + SideChar[PieceCol[pce]] + PceChar[pce].toUpperCase() + ".png";
	let imageString = "<image src=\"" + pieceFileName + "\" class=\"Piece " + rankName + " " + fileName + "\"/>";
	//Adds these divs to the board, a give piece with a type / color
	$("#Board").append(imageString);
}

//Makes a move on the GUI
function MoveGUIPiece (move)
{
	//Structured similarly to MovePiece, but as it pertains to the GUI
	let from = FROMSQ(move);
	let to = TOSQ(move);
	
	//Special cases
	
	//En passant
	if ((move & MFLAGEP) != 0)
	{
		let epRemove;
		if (GameBoard.side == COLORS.BLACK)
		{
			epRemove = to - 10;
		}
		else
		{
			epRemove = to + 10;
		}
		RemoveGUIPiece(epRemove);
	}
	//Capture case
	else if (CAPTURED(move))
	{
		RemoveGUIPiece(to);
	}
	
	let rankName = `rank${RanksBrd[to] + 1}`;
	let fileName = `file${FilesBrd[to] + 1}`;
	
	//looping through each piece object
	$(".Piece").each(function(i) 
	{
		//If a square is on a given rank / file
		if (PieceIsOnSq(from, $(this).position().top, $(this).position().left) == BOOL.TRUE)
		{
			//Removes classes from html object (captured piece)
			$(this).removeClass();
			$(this).addClass(`Piece ${rankName} ${fileName}`);
		}
	});
	
	//Case castling
	if ((move & MFLAGCA) != 0)
	{
		//This updates the rooks
		switch (to)
		{
			case SQUARES.G1:
				RemoveGUIPiece(SQUARES.H1);
				AddGUIPiece(SQUARES.F1, PIECES.wR);
				break;
				
			case SQUARES.C1:
				RemoveGUIPiece(SQUARES.A1);
				AddGUIPiece(SQUARES.D1, PIECES.wR);
				
				break;
			case SQUARES.G8:
				RemoveGUIPiece(SQUARES.H8);
				AddGUIPiece(SQUARES.F8, PIECES.bR);
				break;
				
			case SQUARES.C8:
				RemoveGUIPiece(SQUARES.A8);
				AddGUIPiece(SQUARES.D8, PIECES.bR);
				break;
		}
	}
	//Promoted case
	else if (PROMOTED(move))
	{
		//Adds the piece to the GUI
		RemoveGUIPiece(to);
		AddGUIPiece(to, PROMOTED(move));
	}
}

//Returns true if position is drawn due to insufficient material
function DrawMaterial ()
{
	//If any pawns exist, it is not drawn due to material
	if (GameBoard.pceNum[PIECES.wP] != 0 || GameBoard.pceNum[PIECES.bP] != 0) return BOOL.FALSE;
	if (GameBoard.pceNum[PIECES.wP] != 0 || GameBoard.pceNum[PIECES.bP] != 0) return BOOL.FALSE;
	//If one queen or rook is on board, position is not drawn due to material
	if (GameBoard.pceNum[PIECES.wQ] != 0 || GameBoard.pceNum[PIECES.bQ] != 0 ||
	    GameBoard.pceNum[PIECES.wR] != 0 || GameBoard.pceNum[PIECES.bR] != 0) return BOOL.FALSE;
	//Returns false if we have more than 1 minor piece
	if (GameBoard.pceNum[PIECES.wB] > 1 || GameBoard.pceNum[PIECES.bB] > 1) return BOOL.FALSE;
	if (GameBoard.pceNum[PIECES.wN] > 1 || GameBoard.pceNum[PIECES.bN] > 1) return BOOL.FALSE;
	if (GameBoard.pceNum[PIECES.wB] != 0 && GameBoard.pceNum[PIECES.bB] != 0) return BOOL.FALSE;
	if (GameBoard.pceNum[PIECES.wN] != 0 && GameBoard.pceNum[PIECES.bN] != 0) return BOOL.FALSE;
	
	return BOOL.TRUE;
}

//Checks for draw due to three fold repetition
function ThreeFoldRep ()
{
	let r = 0;
	
	//Loops through history
	for (let i = 0; i < GameBoard.hisply; i++)
	{
		//Increments repetition count
		if (GameBoard.history[i].posKey == GameBoard.posKey)
		{
			r++;
		}
	}
	
	return r;
}

//Checks to see if the game is over, and if so, is it a draw or mate?
function CheckResult()
{
	//Drawn cases
	
	//100 because plies are half moves
	if (GameBoard.fiftyMove >= 100)
	{
		$("#GameStatus").text("Game Drawn (fifty move rule)");
		return BOOL.TRUE;
	}
	//2, because 3-fold means the current position has occurred twice before
	else if (ThreeFoldRep() >= 2)
	{
		$("#GameStatus").text("Game Drawn (three-fold repetition)");
		return BOOL.TRUE;
	}
	//Insufficient material
	else if (DrawMaterial() == BOOL.TRUE)
	{
		$("#GameStatus").text("Game Drawn (insufficient material)");
		return BOOL.TRUE;
	}
	
	//Checkmate / stalemate cases
	
	GenerateMoves();
	
	let found = 0;
	
	//Loop through legal moves
	for (let MoveNum = GameBoard.moveListStart[GameBoard.ply]; MoveNum < GameBoard.moveListStart[GameBoard.ply + 1]; MoveNum++)
	{
		if (MakeMove(GameBoard.moveList[MoveNum]) == BOOL.FALSE)
		{
			continue;
		}

		found++;
		TakeMove();
		break;
	}
	
	//If there are legal moves, return false, because game is still on
	if (found != 0)
	{
		return BOOL.FALSE;
	}
	else 
	{
		//Now there is a stalemate or checkmate
		if (SqAttacked(GameBoard.pList[PCEINDEX(Kings[GameBoard.side], 0)], GameBoard.side^1) == BOOL.TRUE)
		{
			//Mate
			if (GameBoard.side == COLORS.WHITE)
			{
				$("#GameStatus").text("Game Over (Black Wins)");
				return BOOL.TRUE;
			}
			else 
			{
				$("#GameStatus").text("Game Over (White Wins)");
				return BOOL.TRUE;
			}
		}
		else 
		{
			//Stalemate
			$("#GameStatus").text("Game Drawn (stalemate)");
			return BOOL.TRUE;
		}
	}
	
	//Should theoretically never reach this
	console.error("Reaching end of CheckResults() in gui.js");
	return BOOL.FALSE;
}

//Checks if game is over, and sets #GameStatus
function CheckAndSet()
{
	if (CheckResult() == BOOL.TRUE)
	{
		//#GameStatus set in CheckResult if game over
		GameController.GameOver = BOOL.TRUE;
	}
	else 
	{
		GameController.GameOver = BOOL.FALSE;
		$("#GameStatus").text("");
	}
}




























