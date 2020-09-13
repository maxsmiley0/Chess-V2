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

//Adds a piece pce to the board at square sq
function AddPiece (sq, pce)
{
	//Defining color
	let col = PieceCol[pce];
	
	//Updating posKey in GameBoard
	HASH_PCE(pce, sq);
	//Updating square
	GameBoard.pieces[sq] = pce;
	//Updating material of GameBoard
	GameBoard.material[col] += PieceVal[pce];
	//Updating piece list
	GameBoard.pList[PCEINDEX(pce, GameBoard.pceNum[pce])] = sq;
	//Updating number of those pieces
	GameBoard.pceNum[pce]++;
}

//Clears a piece from its original square, and adds it to the target square
function MovePiece (from, to)
{
	//Defining piece
	let pce = GameBoard.pieces[from];
	
	//Updating posKey due to removal of piece from initial square
	HASH_PCE(pce, from);
	//Updating square to empty
	GameBoard.pieces[from] = PIECES.EMPTY;
	
	//Updating posKey due to addition of piece to end square
	HASH_PCE(pce, to);
	//Updating square to the piece
	GameBoard.pieces[to] = pce;
	
	/*
	We don't need to update piece num or material since that doesn't change
	If a capture occurs that's handled in MakeMove
	*/
	
	//Looping through the pieces until we find the one on the square we want
	for (let i = 0; i < GameBoard.pceNum[pce]; i++)
	{
		if (GameBoard.pList[PCEINDEX(pce, i)] == from)
		{
			//Setting that piece's square to the new square
			GameBoard.pList[PCEINDEX(pce, i)] = to;
			break;
		}
	}
}

































