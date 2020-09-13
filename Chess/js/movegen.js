//Generates the 25-bit move number given from, to, captured, promoted, and flag
function MOVE(from, to, captured, promoted, flag)
{
	//flag doesn't need to be shifted because it already accounts for being at the end
	return (from | (to << 7) | (captured << 14) | (promoted << 20) | flag); 
}

//Generates the moves, filling the GameBoard arrays of moveList and moveListStart
function GenerateMoves()
{
	//Simply updating the next moveListStart to start at the current moveList, before we
	//add in the moves for the current ply
	GameBoard.moveListStart[GameBoard.ply + 1] = GameBoard.moveListStart[GameBoard.ply];
	
	let pceType;
	let sq;
	
	//Pawns have direction, so we have to specify the color
	if (GameBoard.side == COLORS.WHITE)
	{
		pceType = PIECES.wP;
		
		//Looping through the number of white pawns
		for (let pceNum = 0; pceNum < GameBoard.pceNum[pceType]; pceNum++)
		{
			//Setting square to the square that that pawn resides on
			sq = GameBoard.pList[PCEINDEX(pceType, pceNum)];
			
			//Special cases of pawn
			
			//Moving forward one or two
			if (GameBoard.pieces[sq + 10] === PIECES.EMPTY)
			{
				//add pawn move
				if (RanksBrd[sq] === RANKS.RANK_2 && GameBoard.pieces[sq + 20] === PIECES.EMPTY)
				{
					// Add quiet move here
				}
			}
			
			//Capture cases
			if (sq + 9 !== SQUARES.OFFBOARD && PieceCol[GameBoard.pieces[sq + 9]] === COLORS.BLACK)
			{
				//add pawn cap move
			}
			
			if (sq + 11 !== SQUARES.OFFBOARD && PieceCol[GameBoard.pieces[sq + 11]] === COLORS.BLACK)
			{
				//add pawn cap move
			}
			
			//En passant cases
			if (GameBoard.enPas != SQUARES.NOSQ)
			{
				if (sq + 9 === GameBoard.enPas)
				{
					//add en pas move
				}
			}
			
			if (GameBoard.enPas != SQUARES.NOSQ)
			{
				if (sq + 11 === GameBoard.enPas)
				{
					//add en pas move
				}
			}
		}
		
		//Castle perms
		//Kingside
		if (GameBoard.castlePerm & CASTLEBIT.WKCA)
		{
			//Pawns can't be on these squares
			if (GameBoard.pieces[SQUARES.F1] === PIECES.EMPTY && GameBoard.pieces[SQUARES.G1] === PIECES.EMPTY)
			{
				if (SqAttacked(SQUARES.F1, COLORS.BLACK) === BOOL.FALSE && SqAttacked(SQUARES.E1, COLORS.BLACK) === BOOL.FALSE)
				{
					//Add quiet move
				}
			}
		}
			
		//Queenside
		if (GameBoard.castlePerm & CASTLEBIT.WQCA)
		{
			//Pawns can't be on these squares
			if (GameBoard.pieces[SQUARES.D1] === PIECES.EMPTY && GameBoard.pieces[SQUARES.C1] === PIECES.EMPTY && GameBoard.pieces[SQUARES.B1] === PIECES.EMPTY)
			{
				if (SqAttacked(SQUARES.D1, COLORS.BLACK) === BOOL.FALSE && SqAttacked(SQUARES.E1, COLORS.BLACK) === BOOL.FALSE)
				{
					//Add quiet move
				}
			}
		}
		
		pceType = PIECES.wN; //Setting up for knights, which we will check next
	}
	else 
	{
		pceType = PIECES.bP;
		
		//Looping through the number of white pawns
		for (let pceNum = 0; pceNum < GameBoard.pceNum[pceType]; pceNum++)
		{
			//Setting square to the square that that pawn resides on
			sq = GameBoard.pList[PCEINDEX(pceType, pceNum)];
			
			//Special cases of pawn
			
			//Moving forward one or two
			if (GameBoard.pieces[sq - 10] === PIECES.EMPTY)
			{
				//add pawn move
				if (RanksBrd[sq] === RANKS.RANK_7 && GameBoard.pieces[sq - 20] === PIECES.EMPTY)
				{
					// Add quiet move here
				}
			}
			
			//Capture cases
			if (sq - 9 !== SQUARES.OFFBOARD && PieceCol[GameBoard.pieces[sq - 9]] === COLORS.WHITE)
			{
				//add pawn cap move
			}
			
			if (sq - 11 !== SQUARES.OFFBOARD && PieceCol[GameBoard.pieces[sq - 11]] === COLORS.WHITE)
			{
				//add pawn cap move
			}
			
			//En passant cases
			if (GameBoard.enPas != SQUARES.NOSQ)
			{
				if (sq - 9 === GameBoard.enPas)
				{
					//add en pas move
				}
			}
			
			if (GameBoard.enPas != SQUARES.NOSQ)
			{
				if (sq - 11 === GameBoard.enPas)
				{
					//add en pas move
				}
			}
		}
		
		//Castle perms
		//Kingside
		if (GameBoard.castlePerm & CASTLEBIT.BKCA)
		{
			//pawns can't be on these squares	
			if (GameBoard.pieces[SQUARES.F8] === PIECES.EMPTY && GameBoard.pieces[SQUARES.G8] === PIECES.EMPTY)
			{
				if (SqAttacked(SQUARES.F8, COLORS.WHITE) === BOOL.FALSE && SqAttacked(SQUARES.E8, COLORS.WHITE) === BOOL.FALSE)
				{
					//Add quiet move
				}
			}
		}
			
		//Queenside
		if (GameBoard.castlePerm & CASTLEBIT.BQCA)
		{
			//pawns can't be on these squares
			if (GameBoard.pieces[SQUARES.D8] === PIECES.EMPTY && GameBoard.pieces[SQUARES.C8] === PIECES.EMPTY && GameBoard.pieces[SQUARES.B8] === PIECES.EMPTY)
			{
				if (SqAttacked(SQUARES.D8, COLORS.WHITE) === BOOL.FALSE && SqAttacked(SQUARES.E8, COLORS.WHITE) === BOOL.FALSE)
				{
					//Add quiet move
				}
			}
		}
		
		pceType = PIECES.bN; //setting it up to check the next piece, the black knight
	}
}






















