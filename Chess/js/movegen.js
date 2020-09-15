const MvvLvaValue = [0, 100, 200, 300, 400, 500, 600, 100, 200, 300, 400, 500, 600];
const MvvLvaScores = new Array(14 * 14); //indexed by piece attacker / victim type

//Uses principal of Most Valuable Victim, Least Valuable Attacker (MVV LVA)
function InitMvvLva ()
{
	for (let Attacker = PIECES.wP; Attacker <= PIECES.bK; Attacker++)
	{
		for (let Victim = PIECES.wP; Victim <= PIECES.bK; Victim++)
		{
			//This orders the MvvLva score by most valuable victim first, and within that ordering,
			//the east valuable attacker first
			MvvLvaScores[Victim * 14 + Attacker] = MvvLvaValue[Victim] + 6 - (MvvLvaValue[Attacker]/100);
		}
	}
}

//Returns true or false, if a move exists or not
function MoveExists (move)
{
	GenerateMoves();
	
	let moveFound = NOMOVE;
	//Looping through legal moves
	for (let i = GameBoard.moveListStart[GameBoard.ply]; i < GameBoard.moveListStart[GameBoard.ply + 1]; i++)
	{
		moveFound = GameBoard.moveList[i];
		//If move is not legal, continue
		if (MakeMove(moveFound) == BOOL.FALSE)
		{
			continue;
		}
		//If move was legal, take it back and return true if it is the move we're interested in
		else 
		{
			TakeMove();
			if (move == moveFound)
			{
				return BOOL.TRUE;
			}
		}
	}
	return BOOL.FALSE;
}

//Generates the 25-bit move number given from, to, captured, promoted, and flag
function MOVE(from, to, captured, promoted, flag)
{
	//flag doesn't need to be shifted because it already accounts for being at the end
	return (from | (to << 7) | (captured << 14) | (promoted << 20) | flag); 
}

function AddCaptureMove (move)
{
	//Adding the move to its appropriate spot in the GameBoard moveListStart array
	//Also increasing moveListStart for the given ply, because one spot has been filled
	//priority is the MvvLva weight plus a million, so it gets evaluated before killer / history heuristic
	let priority = MvvLvaScores[CAPTURED(move) * 14 + GameBoard.pieces[FROMSQ(move)]] + 1000000;
	GameBoard.moveList[GameBoard.moveListStart[GameBoard.ply + 1]] = move;
	GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1]++] = priority;
}

function AddQuietMove (move)
{
	//Adding the move to its appropriate spot in the GameBoard moveListStart array
	//Also increasing moveListStart for the given ply, because one spot has been filled
	GameBoard.moveList[GameBoard.moveListStart[GameBoard.ply + 1]] = move;
	GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1]] = 0;
	
	if (move == GameBoard.searchKillers[GameBoard.ply])
	{
		//Killer 1 hit, set priority to above all else, but below MvvLva
		GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1]] = 900000;
	}
	else if (move == GameBoard.searchKillers[GameBoard.ply + MAXDEPTH])
	{
		//Killer 2 hit, set priority to above all else, but below MvvLva and below killer 1
		GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1]] = 800000;
	}
	else 
	{
		//Quiet move, not a killer move, order by history heuristic
		GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1]] = 
		GameBoard.searchHistory[GameBoard.pieces[FROMSQ(move)] * BRD_SQ_NUM + TOSQ(move)];
	}
	
	GameBoard.moveListStart[GameBoard.ply + 1]++;
}

function AddEnPassantMove (move)
{
	//Adding the move to its appropriate spot in the GameBoard moveListStart array
	//Also increasing moveListStart for the given ply, because one spot has been filled
	GameBoard.moveList[GameBoard.moveListStart[GameBoard.ply + 1]] = move;
	GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1]++] = 105 + 1000000;
}

//Pawn related captures, we need a separate function to handle promotions

function AddWhitePawnCaptureMove (from, to, cap)
{
	//Promotion clause
	if (RanksBrd[from] == RANKS.RANK_7)
	{
		AddCaptureMove(MOVE(from, to, cap, PIECES.wQ, NOMOVE));
		AddCaptureMove(MOVE(from, to, cap, PIECES.wR, NOMOVE));
		AddCaptureMove(MOVE(from, to, cap, PIECES.wB, NOMOVE));
		AddCaptureMove(MOVE(from, to, cap, PIECES.wN, NOMOVE));
	}
	//General capture clause
	else 
	{
		AddCaptureMove(MOVE(from, to, cap, PIECES.EMPTY, NOMOVE));
	}
}

function AddBlackPawnCaptureMove (from, to, cap)
{
	//Promotion clause	
	if (RanksBrd[from] == RANKS.RANK_2)
	{
		AddCaptureMove(MOVE(from, to, cap, PIECES.bQ, NOMOVE));
		AddCaptureMove(MOVE(from, to, cap, PIECES.bR, NOMOVE));
		AddCaptureMove(MOVE(from, to, cap, PIECES.bB, NOMOVE));
		AddCaptureMove(MOVE(from, to, cap, PIECES.bN, NOMOVE));
	}
	//General capture clause
	else 
	{
		AddCaptureMove(MOVE(from, to, cap, PIECES.EMPTY, NOMOVE));
	}
}

function AddWhitePawnQuietMove (from, to)
{
	if (RanksBrd[from] == RANKS.RANK_7)
	{
		AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wQ, NOMOVE));
		AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wR, NOMOVE));
		AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wB, NOMOVE));
		AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wN, NOMOVE));
	}
	else 
	{
		AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.EMPTY, NOMOVE));
	}
}

function AddBlackPawnQuietMove (from, to)
{
	if (RanksBrd[from] == RANKS.RANK_2)
	{
		AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bQ, NOMOVE));
		AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bR, NOMOVE));
		AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bB, NOMOVE));
		AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bN, NOMOVE));
	}
	else 
	{
		AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.EMPTY, NOMOVE));
	}
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
	let dir;
	
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
			if (GameBoard.pieces[sq + 10] == PIECES.EMPTY)
			{
				//Forward 1
				AddWhitePawnQuietMove(sq, sq + 10);
				
				//Forward 2
				if (RanksBrd[sq] == RANKS.RANK_2 && GameBoard.pieces[sq + 20] == PIECES.EMPTY)
				{
					AddQuietMove(MOVE(sq, sq + 20, PIECES.EMPTY, PIECES.EMPTY, MFLAGPS));
				}
			}
			
			//Capture cases
			if (SQOFFBOARD(sq + 9) == BOOL.FALSE && PieceCol[GameBoard.pieces[sq + 9]] == COLORS.BLACK)
			{
				AddWhitePawnCaptureMove(sq, sq + 9, GameBoard.pieces[sq + 9]);
			}
			
			if (SQOFFBOARD(sq + 11) == BOOL.FALSE && PieceCol[GameBoard.pieces[sq + 11]] == COLORS.BLACK)
			{
				AddWhitePawnCaptureMove(sq, sq + 11, GameBoard.pieces[sq + 11]);
			}
			
			//En passant cases
			if (GameBoard.enPas != SQUARES.NO_SQ)
			{
				if (sq + 9 == GameBoard.enPas)
				{
					AddEnPassantMove(MOVE(sq, sq + 9, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP));
				}
			}
			
			if (GameBoard.enPas != SQUARES.NO_SQ)
			{
				if (sq + 11 == GameBoard.enPas)
				{
					AddEnPassantMove(MOVE(sq, sq + 11, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP));
				}
			}
		}
		
		//Castle perms
		//Kingside
		if (GameBoard.castlePerm & CASTLEBIT.WKCA)
		{
			//Pawns can't be on these squares
			if (GameBoard.pieces[SQUARES.F1] == PIECES.EMPTY && GameBoard.pieces[SQUARES.G1] == PIECES.EMPTY)
			{
				if (SqAttacked(SQUARES.F1, COLORS.BLACK) == BOOL.FALSE && SqAttacked(SQUARES.E1, COLORS.BLACK) == BOOL.FALSE)
				{
					AddQuietMove(MOVE(SQUARES.E1, SQUARES.G1, PIECES.EMPTY, PIECES.EMPTY, MFLAGCA));
				}
			}
		}
			
		//Queenside
		if (GameBoard.castlePerm & CASTLEBIT.WQCA)
		{
			//Pawns can't be on these squares
			if (GameBoard.pieces[SQUARES.D1] == PIECES.EMPTY && GameBoard.pieces[SQUARES.C1] == PIECES.EMPTY && GameBoard.pieces[SQUARES.B1] == PIECES.EMPTY)
			{
				if (SqAttacked(SQUARES.D1, COLORS.BLACK) == BOOL.FALSE && SqAttacked(SQUARES.E1, COLORS.BLACK) == BOOL.FALSE)
				{
					AddQuietMove(MOVE(SQUARES.E1, SQUARES.C1, PIECES.EMPTY, PIECES.EMPTY, MFLAGCA));
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
			if (GameBoard.pieces[sq - 10] == PIECES.EMPTY)
			{
				//Forward one
				AddBlackPawnQuietMove(sq, sq - 10);
				//Forward two
				if (RanksBrd[sq] == RANKS.RANK_7 && GameBoard.pieces[sq - 20] == PIECES.EMPTY)
				{
					AddQuietMove(MOVE(sq, sq - 20, PIECES.EMPTY, PIECES.EMPTY, MFLAGPS));
				}
			}
			
			//Capture cases
			if (SQOFFBOARD(sq - 9) == BOOL.FALSE && PieceCol[GameBoard.pieces[sq - 9]] == COLORS.WHITE)
			{
				AddBlackPawnCaptureMove(sq, sq - 9, GameBoard.pieces[sq - 9]);
			}
			
			if (SQOFFBOARD(sq - 11) == BOOL.FALSE && PieceCol[GameBoard.pieces[sq - 11]] == COLORS.WHITE)
			{
				AddBlackPawnCaptureMove(sq, sq - 11, GameBoard.pieces[sq - 11]);
			}
			
			//En passant cases
			if (GameBoard.enPas != SQUARES.NO_SQ)
			{
				if (sq - 9 == GameBoard.enPas)
				{
					AddEnPassantMove(MOVE(sq, sq - 9, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP));
				}
			}
			
			if (GameBoard.enPas != SQUARES.NO_SQ)
			{
				if (sq - 11 == GameBoard.enPas)
				{
					AddEnPassantMove(MOVE(sq, sq - 11, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP));
				}
			}
		}
		
		//Castle perms
		//Kingside
		if (GameBoard.castlePerm & CASTLEBIT.BKCA)
		{
			//pawns can't be on these squares	
			if (GameBoard.pieces[SQUARES.F8] == PIECES.EMPTY && GameBoard.pieces[SQUARES.G8] == PIECES.EMPTY)
			{
				if (SqAttacked(SQUARES.F8, COLORS.WHITE) == BOOL.FALSE && SqAttacked(SQUARES.E8, COLORS.WHITE) == BOOL.FALSE)
				{
					AddQuietMove(MOVE(SQUARES.E8, SQUARES.G8, PIECES.EMPTY, PIECES.EMPTY, MFLAGCA));
				}
			}
		}
			
		//Queenside
		if (GameBoard.castlePerm & CASTLEBIT.BQCA)
		{
			//pawns can't be on these squares
			if (GameBoard.pieces[SQUARES.D8] == PIECES.EMPTY && GameBoard.pieces[SQUARES.C8] == PIECES.EMPTY && GameBoard.pieces[SQUARES.B8] == PIECES.EMPTY)
			{
				if (SqAttacked(SQUARES.D8, COLORS.WHITE) == BOOL.FALSE && SqAttacked(SQUARES.E8, COLORS.WHITE) == BOOL.FALSE)
				{
					AddQuietMove(MOVE(SQUARES.E8, SQUARES.C8, PIECES.EMPTY, PIECES.EMPTY, MFLAGCA));
				}
			}
		}
	}
	
	//Non-Sliding pieces implementation (king, knight)
	
	pceIndex = LoopNonSlideIndex[GameBoard.side];
	pce = LoopNonSlidePce[pceIndex++];
	
	//Looping through all non-sliding pieces
	while (pce != 0)
	{
		//Looping through all pieces of this type / color
		for (let pceNum = 0; pceNum < GameBoard.pceNum[pce]; pceNum++)
		{
			sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
			//Loop through all moves
			for (let i = 0; i < DirNum[pce]; i++)
			{
				dir = PceDir[pce][i];
				//target square
				t_sq = sq + dir;
				//break out of the loop if target square is off board
				if (SQOFFBOARD(t_sq) == BOOL.TRUE)
				{
					continue;
				}
				
				if (GameBoard.pieces[t_sq] != PIECES.EMPTY)
				{
					if (PieceCol[GameBoard.pieces[t_sq]] != GameBoard.side)
					{
						AddCaptureMove(MOVE(sq, t_sq, GameBoard.pieces[t_sq]), PIECES.EMPTY, NOMOVE);
					}
					
				}
				else 
				{
					AddQuietMove(MOVE(sq, t_sq, PIECES.EMPTY, PIECES.EMPTY, NOMOVE));
				}
			}
		}
		pce = LoopNonSlidePce[pceIndex++];	//set piece to the next piece in the non-sliding set
	}
	
	//Sliding pieces implementation (bishop, rook, queen)
	pceIndex = LoopSlideIndex[GameBoard.side];
	pce = LoopSlidePce[pceIndex++];
	
	//Looping through all of the sliding pieces
	while (pce != 0)
	{
		//Looping through all pieces of this type / color
		for (let pceNum = 0; pceNum < GameBoard.pceNum[pce]; pceNum++)
		{
			sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
			
			//Loop through all moves
			for (let i = 0; i < DirNum[pce]; i++)
			{
				dir = PceDir[pce][i];
				//target square
				t_sq = sq + dir;
				//loop until piece goes off board
				
				while (SQOFFBOARD(t_sq) == BOOL.FALSE)
				{
					//encounters a piece	
					if (GameBoard.pieces[t_sq] != PIECES.EMPTY)
					{
						//opposite side induces a capture, same side means we break from the loop
						if (PieceCol[GameBoard.pieces[t_sq]] != GameBoard.side)
						{
							AddCaptureMove(MOVE(sq, t_sq, GameBoard.pieces[t_sq]), PIECES.EMPTY, NOMOVE);
						}
						break;
					}
					else 
					{
						AddQuietMove(MOVE(sq, t_sq, PIECES.EMPTY, PIECES.EMPTY, NOMOVE));
						t_sq += dir;
					}
				}
			}
		}
		pce = LoopSlidePce[pceIndex++];
	}
}

//Generates captures, to be used in the Quiescence Search, filling the GameBoard arrays of moveList and moveListStart
function GenerateCaptures()
{
	//Simply updating the next moveListStart to start at the current moveList, before we
	//add in the moves for the current ply
	GameBoard.moveListStart[GameBoard.ply + 1] = GameBoard.moveListStart[GameBoard.ply];
	
	let pceType;
	let sq;
	let t_sq;
	let pceIndex;
	let pce;
	let dir;
	
	//Pawns have direction, so we have to specify the color
	if (GameBoard.side == COLORS.WHITE)
	{
		pceType = PIECES.wP;
		
		//Looping through the number of white pawns
		for (let pceNum = 0; pceNum < GameBoard.pceNum[pceType]; pceNum++)
		{
			//Setting square to the square that that pawn resides on
			sq = GameBoard.pList[PCEINDEX(pceType, pceNum)];
			
			//Capture cases
			if (SQOFFBOARD(sq + 9) == BOOL.FALSE && PieceCol[GameBoard.pieces[sq + 9]] == COLORS.BLACK)
			{
				AddWhitePawnCaptureMove(sq, sq + 9, GameBoard.pieces[sq + 9]);
			}
			
			if (SQOFFBOARD(sq + 11) == BOOL.FALSE && PieceCol[GameBoard.pieces[sq + 11]] == COLORS.BLACK)
			{
				AddWhitePawnCaptureMove(sq, sq + 11, GameBoard.pieces[sq + 11]);
			}
			
			//En passant cases
			if (GameBoard.enPas != SQUARES.NO_SQ)
			{
				if (sq + 9 == GameBoard.enPas)
				{
					AddEnPassantMove(MOVE(sq, sq + 9, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP));
				}
			}
			
			if (GameBoard.enPas != SQUARES.NO_SQ)
			{
				if (sq + 11 == GameBoard.enPas)
				{
					AddEnPassantMove(MOVE(sq, sq + 11, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP));
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
			
			//Capture cases
			if (SQOFFBOARD(sq - 9) == BOOL.FALSE && PieceCol[GameBoard.pieces[sq - 9]] == COLORS.WHITE)
			{
				AddBlackPawnCaptureMove(sq, sq - 9, GameBoard.pieces[sq - 9]);
			}
			
			if (SQOFFBOARD(sq - 11) == BOOL.FALSE && PieceCol[GameBoard.pieces[sq - 11]] == COLORS.WHITE)
			{
				AddBlackPawnCaptureMove(sq, sq - 11, GameBoard.pieces[sq - 11]);
			}
			
			//En passant cases
			if (GameBoard.enPas != SQUARES.NO_SQ)
			{
				if (sq - 9 == GameBoard.enPas)
				{
					AddEnPassantMove(MOVE(sq, sq - 9, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP));
				}
			}
			
			if (GameBoard.enPas != SQUARES.NO_SQ)
			{
				if (sq - 11 == GameBoard.enPas)
				{
					AddEnPassantMove(MOVE(sq, sq - 11, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP));
				}
			}
		}
	}
	
	//Non-Sliding pieces implementation (king, knight)
	
	pceIndex = LoopNonSlideIndex[GameBoard.side];
	pce = LoopNonSlidePce[pceIndex++];
	
	//Looping through all non-sliding pieces
	while (pce != 0)
	{
		//Looping through all pieces of this type / color
		for (let pceNum = 0; pceNum < GameBoard.pceNum[pce]; pceNum++)
		{
			sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
			//Loop through all moves
			for (let i = 0; i < DirNum[pce]; i++)
			{
				dir = PceDir[pce][i];
				//target square
				t_sq = sq + dir;
				//break out of the loop if target square is off board
				if (SQOFFBOARD(t_sq) == BOOL.TRUE)
				{
					continue;
				}
				
				if (GameBoard.pieces[t_sq] != PIECES.EMPTY)
				{
					if (PieceCol[GameBoard.pieces[t_sq]] != GameBoard.side)
					{
						AddCaptureMove(MOVE(sq, t_sq, GameBoard.pieces[t_sq]), PIECES.EMPTY, NOMOVE);
					}
				}
			}
		}
		pce = LoopNonSlidePce[pceIndex++];	//set piece to the next piece in the non-sliding set
	}
	
	//Sliding pieces implementation (bishop, rook, queen)
	pceIndex = LoopSlideIndex[GameBoard.side];
	pce = LoopSlidePce[pceIndex++];
	
	//Looping through all of the sliding pieces
	while (pce != 0)
	{
		//Looping through all pieces of this type / color
		for (let pceNum = 0; pceNum < GameBoard.pceNum[pce]; pceNum++)
		{
			sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
			
			//Loop through all moves
			for (let i = 0; i < DirNum[pce]; i++)
			{
				dir = PceDir[pce][i];
				//target square
				t_sq = sq + dir;
				//loop until piece goes off board
				
				while (SQOFFBOARD(t_sq) == BOOL.FALSE)
				{
					//encounters a piece	
					if (GameBoard.pieces[t_sq] != PIECES.EMPTY)
					{
						//opposite side induces a capture, same side means we break from the loop
						if (PieceCol[GameBoard.pieces[t_sq]] != GameBoard.side)
						{
							AddCaptureMove(MOVE(sq, t_sq, GameBoard.pieces[t_sq]), PIECES.EMPTY, NOMOVE);
						}
						break;
					}
					else 
					{
						t_sq += dir;
					}
				}
			}
		}
		pce = LoopSlidePce[pceIndex++];
	}
}











































