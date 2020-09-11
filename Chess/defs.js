const PIECES = 
{
EMPTY : 0, wP: 1, wN: 2, wB: 3, wR: 4,  wQ: 5,  wK: 6,
		   bP: 7, bN: 8, bB: 9, bR: 10, bQ: 11, bK: 12
};

const FILES =
{
FILE_A: 0, FILE_B: 1, FILE_C: 2, FILE_D: 3, FILE_E: 4, FILE_F: 5,
FILE_G: 6, FILE_H: 7, FILE_NONE: 8
};

const RANKS = 
{
RANK_1: 0, RANK_2: 1, RANK_3: 2, RANK_4: 3, RANK_5: 4, RANK_6: 5,
RANK_7: 6, RANK_8: 7, RANK_NONE: 8
};

const COLORS = 
{
WHITE: 0, BLACK: 1, BOTH: 2
};

/*
Storing castling info as binary, e.g. something like
1010 means white cannot castle kingside, white can castle queenside, black cannot castle
kingside, black can castle queenside

To determine if a given side can castle a given direction, we use the bitwise and operator
e.g. (1010 && WQCA) evaluates to true
*/

const CASTLEBIT = 
{
WKCA: 1, WQCA: 2, BKCA: 4, BQCA: 8
};

const SQUARES = 
{
A1: 21, B1: 22, C1: 23, D1: 24, E1: 25, F1: 26, G1: 27, H1: 28,
A8: 91, B8: 92, C8: 93, D8: 94, E8: 95, F8: 96, G8: 97, H8: 98,
NO_SQ: 99, OFFBOARD: 100
};

const BOOL = 
{
TRUE: 1, FALSE: 0
}

/*
Why are we using an array of 120 (12 x 10) as opposed to an array of 64 (8 x 8)? 
This simplifies legal move generation down the line; for example, we will know when to
stop checking if "sliding" pieces can move in a given direction. 

Why do we (12 x 10) as opposed to (10 x 10)? This is so knights on the 1st or 8th rank
can move two squares up / down and not access an undefined element. 

Why don't we need it to be (12 x 12) as opposed to (12 x 10) following this logic? 
The board only needs one side of padding on its left and right, since due to the numbering
system of the board, if the knight is on the first or last file and tries to move two
spaces in the left or right direction, it will always land on a well-defined square.
*/
const BRD_SQ_NUM = 120;

const FilesBrd = new Array(BRD_SQ_NUM);
const RanksBrd = new Array(BRD_SQ_NUM);

//Converts a file and rank to number
function FR2SQ (f, r)
{
	return (21 + f) + (10 * r);
}

/*
The following arrays store boolean values, corresponding to if a given piece is a "big"
piece, major piece, minor piece, is of a given side, is of a given type, and an integer
array that stores the value of each piece. Note that there are 13 elements in each array,
which stand for the empty square, and each 6 unique pieces of each side
*/

const PieceBig = 
[ BOOL.FALSE, 
BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, 
BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE];

const PieceMaj = 
[ BOOL.FALSE, 
BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE,
BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE];

const PieceMin = [ BOOL.FALSE,
BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE,
BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE];

const PieceVal= [ 0, 
100, 325, 325, 550, 1000, 50000, 
100, 325, 325, 550, 1000, 50000];

const PieceCol = [ COLORS.BOTH,
COLORS.WHITE, COLORS.WHITE, COLORS.WHITE, COLORS.WHITE, COLORS.WHITE, COLORS.WHITE,
COLORS.BLACK, COLORS.BLACK, COLORS.BLACK, COLORS.BLACK, COLORS.BLACK, COLORS.BLACK];
	
const PiecePawn = [ BOOL.FALSE,
BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE,
BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE];
	
const PieceKnight = [ BOOL.FALSE,
BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE,
BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE];

const PieceKing = [ BOOL.FALSE,
BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE,
BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE];

//Rook OR Queen
const PieceRookQueen = [ BOOL.FALSE,
BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE,
BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE];

//Bishop OR Queen
const PieceBishopQueen = [ BOOL.FALSE,
BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE,
BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE];

//Bishop, Rook, OR Queen
const PieceSlides = [ BOOL.FALSE,
BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE,
BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE];





































