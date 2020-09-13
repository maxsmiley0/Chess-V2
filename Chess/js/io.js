
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









