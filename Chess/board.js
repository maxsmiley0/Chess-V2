//Maps a given piece to its "maximum index". Takes in parameter piece name e.g. wP
function PCEINDEX(pce)
{
	return (pce * 10 + GameBoard.pceNum(pce));
}

var GameBoard = 
{
	pieces: new Array(BRD_SQ_NUM),	//pieces in a given game board
	side: COLORS.WHITE,				//side to move
	fiftyMove: 0,					//50 move draw rule
	hisPly: 0,						//Stack of game states / moves
	ply: 0,							//Number of plies into the search tree	
	castlePerm: 0,					//Can a given side castle?		
	enPas: 0,						//En passant
	material: new Array(2),			//Indexed by side, holds value of material
	pceNum: new Array(13),			//Indexed by piece, how many of a given piece exists?
	posKey: 0,						//Maps a board to a key (integer, unique)
	
	moveList: new Array(MAXDEPTH * MAXPOSITIONMOVES),	//generated moves
	moveScores: new Array(MAXDEPTH * MAXPOSITIONMOVES),//scores for generated moves
	moveListStart: new Array(MAXDEPTH),   //move list starts for a give depth
	
	/*
	pList stores position of each pieces
	How can one piece have an index? Especially if there are multiple of them?
	We use the value of that piece * 10 + number of pieces left on the board of that type
	E.g. white knight has a value of wN = 2, lets say there are 7 white knights on the 
	board (some sort of crazy promotion scheme)
	Then the knights will correspond to wN * 10 + GameBoard.pceNum(wN)
	= 2 * 10 + GameBoard.pceNum(2) = 20, 21, 22, 23, 24, 25, 26
	And these indicies in PlistArray will correspond to an integer representing the positions
	of the white knights
	Why 10? No board can have more than 10 pieces, so the indicies will never overlap
	*/
	
	//Making sure pList has enough space
	pList: new Array(14 * 10)
	
};

//Generates a position key, using the random numbers from the arrays
function GeneratePosKey ()
{
	let finalKey = 0;
	
	//XORing pieces, iterating through board
	for (let sq = 0; sq < BRD_SQ_NUM; sq++)
	{
		let piece = GameBoard.pieces[sq];
		//If piece is not empty or off board
		if (piece !== PIECES.EMPTY &&  piece !== PIECES.OFFBOARD)
		{
			//XOR the key corresponding to a given piece on a square
			finalKey ^= PieceKeys[(piece * 120) + sq];
		}
	}
	
	//XORing the side
	if (GameBoard.side == COLORS.WHITE)
	{
		finalKey ^= SideKey;
	}
	
	//XORing en passant permission
	if (GameBoard.enPas != SQUARES.NO_SQ)
	{
		finalKey ^= [GameBoard.enPas];
	}
	
	//XORing castling permission
	finalKey ^= CastleKeys[GameBoard.castlePerm];
	
	return finalKey;
}

function ResetBoard ()
{
	//Setting all 120 squares to off board
	for (let i = 0; i < BRD_SQ_NUM; i++)
	{
		GameBoard.pieces[i] = SQUARES.OFFBOARD;
	}
	
	//Setting middle 8x8 grid to empty pieces
	for (let i = 0; i < 64; i++)
	{
		GameBoard.pieces[SQ120(i)] = PIECES.EMPTY;
	}
	
	//Setting pList to empty 
	for (let i = 0; i < GameBoard.pList.length; i++)
	{
		GameBoard.pList[i] = PIECES.EMPTY;
	}
	
	//Material to zero
	for (let i = 0; i < GameBoard.material.length; i++)
	{
		GameBoard.material[i] = 0;
	}
	
	//Number of each piece to zero
	for (let i = 0; i < GameBoard.pceNum.length; i++)
	{
		GameBoard.pceNum[i] = 0;
	}
	
	//Members to default values
	GameBoard.side = COLORS.BOTH;
	GameBoard.enPas = SQUARES.NO_SQ;
	GameBoard.fiftyMove = 0;
	GameBoard.ply = 0;
	GameBoard.hisPly = 0;
	GameBoard.castlePerm = 0;
	GameBoard.posKey = 0;
	
	GameBoard.moveListStart[GameBoard.ply] = 0;
}

function ParseFen (fen)
{
	ResetBoard();	//clear board before we put anything in
}
















