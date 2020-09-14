const PawnTable = [
0	,	0	,	0	,	0	,	0	,	0	,	0	,	0	,
10	,	10	,	0	,	-10	,	-10	,	0	,	10	,	10	,
5	,	0	,	0	,	5	,	5	,	0	,	0	,	5	,
0	,	0	,	10	,	20	,	20	,	10	,	0	,	0	,
5	,	5	,	5	,	10	,	10	,	5	,	5	,	5	,
10	,	10	,	10	,	20	,	20	,	10	,	10	,	10	,
20	,	20	,	20	,	30	,	30	,	20	,	20	,	20	,
0	,	0	,	0	,	0	,	0	,	0	,	0	,	0	
];


const KnightTable = [
0	,	-10	,	0	,	0	,	0	,	0	,	-10	,	0	,
0	,	0	,	0	,	5	,	5	,	0	,	0	,	0	,
0	,	0	,	10	,	10	,	10	,	10	,	0	,	0	,
0	,	0	,	10	,	20	,	20	,	10	,	5	,	0	,
5	,	10	,	15	,	20	,	20	,	15	,	10	,	5	,
5	,	10	,	10	,	20	,	20	,	10	,	10	,	5	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
0	,	0	,	0	,	0	,	0	,	0	,	0	,	0		
];

const BishopTable = [
0	,	0	,	-10	,	0	,	0	,	-10	,	0	,	0	,
0	,	0	,	0	,	10	,	10	,	0	,	0	,	0	,
0	,	0	,	10	,	15	,	15	,	10	,	0	,	0	,
0	,	10	,	15	,	20	,	20	,	15	,	10	,	0	,
0	,	10	,	15	,	20	,	20	,	15	,	10	,	0	,
0	,	0	,	10	,	15	,	15	,	10	,	0	,	0	,
0	,	0	,	0	,	10	,	10	,	0	,	0	,	0	,
0	,	0	,	0	,	0	,	0	,	0	,	0	,	0	
];

const RookTable = [
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
25	,	25	,	25	,	25	,	25	,	25	,	25	,	25	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0		
];

//Bonus that a side gets if they have the bishop pair
const BishopPair = 40;

//Static eval, to be called at leaf nodes
function EvalPosition ()
{
	//Material difference
	let score = GameBoard.material[COLORS.WHITE] - GameBoard.material[COLORS.BLACK];
	
	//Piece square tables
	let pce, sq;
	
	pce = PIECES.wP;
	for (let pceNum = 0; pceNum < GameBoard.pceNum[pce]; pceNum++)
	{
		sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
		score += PawnTable[SQ64(sq)];
	}
	
	pce = PIECES.wN;
	for (let pceNum = 0; pceNum < GameBoard.pceNum[pce]; pceNum++)
	{
		sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
		score += KnightTable[SQ64(sq)];
	}
	
	pce = PIECES.wB;
	for (let pceNum = 0; pceNum < GameBoard.pceNum[pce]; pceNum++)
	{
		sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
		score += BishopTable[SQ64(sq)];
	}
	
	pce = PIECES.wR;
	for (let pceNum = 0; pceNum < GameBoard.pceNum[pce]; pceNum++)
	{
		sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
		score += RookTable[SQ64(sq)];
	}
	
	//We actually use the Rook Table / 2 for the queen
	pce = PIECES.wQ;
	for (let pceNum = 0; pceNum < GameBoard.pceNum[pce]; pceNum++)
	{
		sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
		score += RookTable[Mirror64(SQ64(sq))]/2;
	}
	
	pce = PIECES.bP;
	for (let pceNum = 0; pceNum < GameBoard.pceNum[pce]; pceNum++)
	{
		sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
		score -= PawnTable[Mirror64(SQ64(sq))];
	}
	
	pce = PIECES.bN;
	for (let pceNum = 0; pceNum < GameBoard.pceNum[pce]; pceNum++)
	{
		sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
		score -= KnightTable[Mirror64(SQ64(sq))];
	}
	
	pce = PIECES.bB;
	for (let pceNum = 0; pceNum < GameBoard.pceNum[pce]; pceNum++)
	{
		sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
		score -= BishopTable[Mirror64(SQ64(sq))];
	}
	
	pce = PIECES.bR;
	for (let pceNum = 0; pceNum < GameBoard.pceNum[pce]; pceNum++)
	{
		sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
		score -= RookTable[Mirror64(SQ64(sq))];
	}
	
	//We actually use the Rook Table / 2 for the queen
	pce = PIECES.bQ;
	for (let pceNum = 0; pceNum < GameBoard.pceNum[pce]; pceNum++)
	{
		sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
		score -= RookTable[Mirror64(SQ64(sq))]/2;
	}
	
	if (GameBoard.pceNum[PIECES.wB] >= 2)
	{
		score += BishopPair;
	}
	if (GameBoard.pceNum[PIECES.bB] >= 2)
	{
		score -= BishopPair;
	}
	
	return (GameBoard.side == COLORS.WHITE ? score: -score);
}




































