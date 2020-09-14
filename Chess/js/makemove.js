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

//Makes a move, main function in this file
function MakeMove (move)
{
	//Extracting information from the move number
	let from = FROMSQ(move);
	let to = TOSQ(move);
	let side = GameBoard.side;
	
	//Checking flags
	
	//en passant case
	if (move & MFLAGEP)
	{
		if (side == COLORS.WHITE)
		{
			//Remove the pawn we've 'captured'	
			ClearPiece(to - 10);
		}
		else 
		{
			//Remove the pawn we've 'captured'	
			ClearPiece(to + 10);
		}
	}
	//castling case
	else if (move & MFLAGCA)
	{
		switch (to)
		{
			case SQUARES.C1:
				MovePiece(SQUARES.A1, SQUARES.D8);
				break;
			case SQUARES.C8:
				MovePiece(SQUARES.A8, SQUARES.D8);
				break;
			case SQUARES.G1:
				MovePiece(SQUARES.H1, SQUARES.F1);
				break;
			case SQUARES.G8:
				MovePiece(SQUARES.H8, SQUARES.F8);
				break;
			default:
				console.error("Castling to an invalid square");
				break;
		}
	}
	
	//If there was an en passant square, we need to reset it (hash it out), because this
	//square is reset every turn
	if (GameBoard.enPas != SQUARES.NO_SQ)
	{
		HASH_EP();
	}
	
	//I'm not sure why this is here but BFS put it in
	HASH_CA();
	
	//Updating the history table
	GameBoard.history[GameBoard.hisPly].move = move;
	GameBoard.history[GameBoard.hisPly].fiftyMove = GameBoard.fiftyMove;
	GameBoard.history[GameBoard.hisPly].enPas = GameBoard.enPas;
	GameBoard.history[GameBoard.hisPly].castlePerm = GameBoard.castlePerm;
	
	//Handling castling perm, if a square to where a rook or king is, we hash out those values
	//Most values are 15, or 1111 in binary (the identity value)
	GameBoard.castlePerm &= CastlePerm[from];
	GameBoard.castlePerm &= CastlePerm[to];
	
	//Update castlePerms
	HASH_CA();
	
	//Now we remove the captured piece
	let captured = CAPTURED(move);
	GameBoard.fiftyMove++;				//increasing the move since last capture
	
	if (captured != PIECES.EMPTY)
	{
		ClearPiece(to);
		GameBoard.fiftyMove = 0;		//if a piece was captured, reset fifty-move timer
	}
	
	GameBoard.hisPly++;
	GameBoard.ply++;
	
	if (PiecePawn[GameBoard.pieces[from]] == BOOL.TRUE)
	{
		GameBoard.fiftyMove = 0;		//if a pawn move, we also reset fifty-move timer
		if (move & MFLAGPS)
		{
			//If pawn starting move, set en passant square	
			if (side == COLORS.WHITE)
			{
				GameBoard.enPas = from + 10;
			}
			else 
			{
				GameBoard.enPas = from - 10;
			}
			//Hash in the en passant to the position key
			HASH_EP();
		}
	}
	
	//Most special cases have been handled, now we actually move the piece
	MovePiece(from, to);
	
	//Last special case, promotion. Needs to be after the piece is moved from obvious reasons
	
	if (PROMOTED(move) != PIECES.EMPTY)
	{
		//this is actually where the pawn currently resides, on the last or first rank
		ClearPiece(to);
		//adding promoted piece
		AddPiece(to, PROMOTED(move));
	}
	
	//Switch side
	GameBoard.side ^= 1;
	HASH_SIDE();
	
	//Ensuring the king is not in check at the end of the move
	if (SqAttacked(GameBoard.pList[PCEINDEX(Kings[side], 0)], GameBoard.side))
	{
		//take move
		return BOOL.FALSE;
	}
	else 
	{
		return BOOL.TRUE;
	}
}

























































