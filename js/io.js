//Maps a square onto its chess position equivalen (e.g. 21 => a1)
function PrSq(sq)
{
	return `${FileChar[FilesBrd[sq]]}${RankChar[RanksBrd[sq]]}`;
}

//Maps a single chess move into "e2e4" format
function PrMove(move)
{
	let MvStr;
	
	let ff = FilesBrd[FROMSQ(move)];
	let rf = RanksBrd[FROMSQ(move)];
	let ft = FilesBrd[TOSQ(move)];
	let rt = RanksBrd[TOSQ(move)];
	
	MvStr = FileChar[ff] + RankChar[rf] + FileChar[ft] + RankChar[rt];
	
	let promoted = PROMOTED(move);
	
	if (promoted != PIECES.EMPTY)
	{
		let pchar = 'q';
		if (PieceKnight[promoted] === BOOL.TRUE)
		{
			pchar = 'n';
		}
		else if (PieceRookQueen[promoted] === BOOL.TRUE && PieceBishopQueen[promoted] === BOOL.FALSE)
		{
			pchar = 'r';
		}
		else if (PieceRookQueen[promoted] === BOOL.FALSE && PieceBishopQueen[promoted] === BOOL.TRUE)
		{
			pchar = 'b';
		}
		MvStr += pchar;
	}
	
	return MvStr;
}

//Prints all pseudolegal moves
function PrintMoveList ()
{
	console.log("MoveList: ");
	for (let i = GameBoard.moveListStart[GameBoard.ply]; i < GameBoard.moveListStart[GameBoard.ply + 1]; i++)
	{
		console.log(PrMove(GameBoard.moveList[i]));
	}
}

//Returns if a move made from the GUI is legal
function ParseMove (from, to)
{
	GenerateMoves();
	
	let Move = NOMOVE;
	let PromPce = PIECES.EMPTY;
	let found = BOOL.FALSE;
	
	//Looping through all moves
	for (let i = GameBoard.moveListStart[GameBoard.ply]; i < GameBoard.moveListStart[GameBoard.ply + 1]; i++)
	{
		Move = GameBoard.moveList[i];
		
		//If this move is in the set of legal moves
		if (FROMSQ(Move) == from && TOSQ(Move) == to)
		{
			PromPce = PROMOTED(Move);
			if (PromPce != PIECES.EMPTY)
			{
				if ((PromPce == PIECES.wQ && GameBoard.side == COLORS.WHITE) || 
				    (PromPce == PIECES.bQ && GameBoard.side == COLORS.BLACK))
				{
					found = BOOL.TRUE;
					break;
				}
				
				continue;
			}
			
			found = BOOL.TRUE;
			break;
		}
	}
	
	//If the move has been found, check for legality
	if (found != BOOL.FALSE)
	{
		if (MakeMove(Move) == BOOL.TRUE)
		{
			TakeMove();
			return Move;
		}
		else 
		{
			return NOMOVE;
		}
	}
	
	return NOMOVE;
}































