//Clears piece from square, not so simple though because we have to account for all of the
//data that relies on that, like the GameBoard pList, GameBoard posKey, etc.
function ClearPiece (sq)
{
	//Defining piece and color
	let pce = GameBoard.pieces[sq];
	let col = PieceCol[pce];
	
	//Should never be -1 for debugging purposes
	//Temp pieceNum, loop through pieceList until the target square = the square we pass in
	let t_pceNum = -1;
	
	//Updating posKey in GameBoard
	HASH_PCE(pce, sq);
	//Updating square
	GameBoard.pieces[sq] = PIECES.EMPTY;
	//Updating material of GameBoard
	GameBoard.material[col] -= PieceVal[pce];
	
	//Updating piece list, looping through the pieces
	for (let i = 0; i < GameBoard.pceNum[pce]; i++)
	{
		//Break when we find the piece with the correct square
		if (GameBoard.pList[PCEINDEX(pce, i)] == sq)
		{
			t_pceNum = i;
			break;
		}
	}
	
	//Since we removed the piece, decrement the stored number of that piece
	GameBoard.pceNum[pce]--;
	//Removing piece from pList
	GameBoard.pList[PCEINDEX(pce, t_pceNum)] = GameBoard.pList[PCEINDEX(pce, GameBoard.pceNum[pce])];
}