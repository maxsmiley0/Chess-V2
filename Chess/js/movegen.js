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
	let t_sq;
	let pceIndex;
	let pce;
	
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
			if (SQOFFBOARD(sq + 9) === BOOL.FALSE && PieceCol[GameBoard.pieces[sq + 9]] === COLORS.BLACK)
			{
				//add pawn cap move
			}
			
			if (SQOFFBOARD(sq + 11) === BOOL.FALSE && PieceCol[GameBoard.pieces[sq + 11]] === COLORS.BLACK)
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
			if (SQOFFBOARD(sq - 9) === BOOL.FALSE && PieceCol[GameBoard.pieces[sq - 9]] === COLORS.WHITE)
			{
				//add pawn cap move
			}
			
			if (SQOFFBOARD(sq - 11) === BOOL.FALSE && PieceCol[GameBoard.pieces[sq - 11]] === COLORS.WHITE)
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
	}
	
	//Non-Sliding pieces implementation (king, knight)
	
	pceIndex = LoopNonSlideIndex[GameBoard.side];
	pce = LoopNonSlidePce[pceIndex++];
	
	//Looping through all non-sliding pieces
	while (pce !== 0)
	{
		//Looping through all pieces of this type / color
		for (let pceNum = 0; pceNum < GameBoard.pceNum[pce]; pceNum++)
		{
			sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
			//Loop through all moves
			for (let i = 0; i < DirNum[pce]; i++)
			{
				let dir = PceDir[pce][i];
				//target square
				t_sq = sq + dir;
				//break out of the loop if target square is off board
				if (SQOFFBOARD(t_sq) === BOOL.TRUE)
				{
					continue;
				}
				
				if (GameBoard.pieces[t_sq] !== PIECES.EMPTY)
				{
					if (PieceCol[GameBoard.pieces[t_sq]] != GameBoard.side)
					{
						//add a capture
					}
					
				}
				else 
				{
					//add a quiet move
				}
			}
		}
		pce = LoopNonSlidePce[pceIndex++];	//set piece to the next piece in the non-sliding set
	}
	
	//Sliding pieces implementation (bishop, rook, queen)
	
	pceIndex = LoopSlideIndex[GameBoard.side];
	pce = LoopSlidePce[pceIndex++];
	
	//Looping through all of the sliding pieces
	while (pce !== 0)
	{
		//Looping through all pieces of this type / color
		for (let pceNum = 0; pceNum < GameBoard.pceNum[pce]; pceNum++)
		{
			sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
			//Loop through all moves
			for (let i = 0; i < DirNum[pce]; i++)
			{
				let dir = PceDir[pce][i];
				//target square
				t_sq = sq + dir;
				//loop until piece goes off board
				while (SQOFFBOARD(t_sq) === BOOL.FALSE)
				{
					//encounters a piece	
					if (GameBoard.pieces[t_sq] !== PIECES.EMPTY)
					{
						//opposite side induces a capture, same side means we break from the loop
						if (PieceCol[GameBoard.pieces[t_sq]] != GameBoard.side)
						{
							//add capture
						}
						else 
						{
							break;
						}
					}
					else 
					{
						//Add quiet move
						t_sq += dir;
					}
				}
			}
		}
		pce = LoopSlidePce[pceIndex++];
	}
}






















