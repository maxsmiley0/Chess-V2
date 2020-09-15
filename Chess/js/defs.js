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

const MAXGAMEMOVES = 2048;		//Tentative upper bound on game moves
const MAXPOSITIONMOVES = 256;	//Upper bound on possible moves in a position
const MAXDEPTH = 64;			//Upper bound on max depth of plies searched
const INFINITE = 30000;			//The eval will never exceed this number
const MATE = 29000;				//Needs to be far above eval, yet below infinite
const PVENTRIES = 10000;		//# entries in PvTable

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

var START_FEN =  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const PceChar = ".PNBRQKpnbrqk";
const SideChar = "wb";
const RankChar = "12345678";
const FileChar = "abcdefgh";

//Converts a file and rank to number
function FR2SQ (f, r)
{
	return (21 + f) + (10 * r);
}

//Keys, to be generated at the start of the program
const PieceKeys = new Array(14 * 120);	//14 pieces times 120 squares
var SideKey = 0;						//XOR in/out depending on the side to move
const CastleKeys = new Array(16);		//4 castling directions = 16 combinations of privileges

const Sq120ToSq64 = new Array(BRD_SQ_NUM);	//converts array 120 to array 64
const Sq64ToSq120 = new Array(64);			//converts array 64 to array 120

//Generates a random 31 bit number, essentially generates 4 numbers and shifts + concatenates
function RAND_32()
{
	return (Math.floor(Math.random() * 255 + 1) << 23 | 
		    Math.floor(Math.random() * 255 + 1) << 16 | 
		    Math.floor(Math.random() * 255 + 1) << 8  |
		    Math.floor(Math.random() * 255 + 1));
}

//Array that hold the reflection of each square about the x axis

const ReflectSquares = [
56	,	57	,	58	,	59	,	60	,	61	,	62	,	63	,
48	,	49	,	50	,	51	,	52	,	53	,	54	,	55	,
40	,	41	,	42	,	43	,	44	,	45	,	46	,	47	,
32	,	33	,	34	,	35	,	36	,	37	,	38	,	39	,
24	,	25	,	26	,	27	,	28	,	29	,	30	,	31	,
16	,	17	,	18	,	19	,	20	,	21	,	22	,	23	,
8	,	9	,	10	,	11	,	12	,	13	,	14	,	15	,
0	,	1	,	2	,	3	,	4	,	5	,	6	,	7
];

//Gets SQUARE-64 from SQUARE-120
function SQ64 (SQ120)
{
	return Sq120ToSq64[SQ120];
}

//Gets SQUARE-120 from SQUARE-64
function SQ120 (SQ64)
{
	return Sq64ToSq120[SQ64];
}

//Maps each square to its corresponding square, mirrored about the x axis (e.g. h1 -> a1)
function Mirror64 (sq)
{
	return ReflectSquares[sq];
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

//The following arrays store the directional information of how non-pawn pieces move
//No Queen Direction because she simply uses RkDir and BiDir

const KnDir = [-8, -19, -21, -12, 8, 19, 21, 12];
const RkDir	= [-1, -10, 1, 10];
const BiDir	= [-9, -11, 9, 11];
const KiDir = [-1, -10, 1, 10, -9, -11, 9, 11]

const DirNum = [0, 0, 8, 4, 4, 8, 8, 0, 8, 4, 4, 8, 8];	//# of dir indexed by piece type
//Array gets directions indexed by piece type, king and queen are synonymous
const PceDir = [0, 0, KnDir, BiDir, RkDir, KiDir, KiDir, 0, KnDir, BiDir, RkDir, KiDir, KiDir];

//If we're white, we loop from index0 until we hit the zero element, if black start at 3
const LoopNonSlidePce = [PIECES.wN, PIECES.wK, 0, PIECES.bN, PIECES.bK, 0];
const LoopNonSlideIndex = [0, 3]; //stores where se start looping through LoopNonSlidePiece from a given side

const LoopSlidePce =   [PIECES.wB, PIECES.wR, PIECES.wQ, 0, PIECES.bB, PIECES.bR, PIECES.bQ, 0];
const LoopSlideIndex = [0, 4];

//Maps a given piece to its "maximum index". Takes in parameter piece name e.g. wP
function PCEINDEX(pce, pceNum) 
{
	return (pce * 10 + pceNum);
}

const Kings = [PIECES.wK, PIECES.bK];
//We bitwise & the CastlePerm, where the entry is the board square. For example, bitwise
//&'ing 1111 (all sides can castle) with (1100) revokes the castling privileges for black
var CastlePerm = [
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 13, 15, 15, 15, 12, 15, 15, 14, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15,  7, 15, 15, 15,  3, 15, 15, 11, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15
];

/*
What do we store about a move?
From square - 64 squares, so 7 bits
To square - 64 squares, so 7 bits
If it is an en passant - boolean, so 1 bit
If we capture a piece - 12 pieces, so 4 bits
If we promote a piece - 12 pieces, so 4 bits
If it is a pawn starting move - boolean, so 1 bit
If it is a castling move - boolean, so 1 bit

We can store this with a single number, and use the bitwise and operator against the
address space to get that number

0000 0000 0000 0000 0000 0111 1111 -> 0x7F, From Square
0000 0000 0000 0011 1111 1000 0000 -> >> 7, 0x7F, To Square
0000 0000 0011 1100 0000 0000 0000 -> >> 14, 0xF, Capture Piece
0000 0000 0100 0000 0000 0000 0000 -> 0x40000, Is En Passant
0000 0000 1000 0000 0000 0000 0000 -> 0x80000, Is Pawn Start Move
0000 1111 0000 0000 0000 0000 0000 -> >>20, 0xF, Promoted Piece
0001 0000 0000 0000 0000 0000 0000 -> Castle, 0x1000000
*/



/*These functions take in a move number, and decompose them into their subsections as 
specified above
*/

function FROMSQ(m) { return (m & 0x7F); }
function TOSQ(m) { return ((m >> 7) & 0x7F); }
function CAPTURED(m) { return ((m >> 14) & 0xF); }
function PROMOTED(m) { return ((m >> 20) & 0xF); }
function PROMOTED(m) { return ((m >> 20) & 0xF); }
function PROMOTED(m) { return ((m >> 20) & 0xF); }
function PROMOTED(m) { return ((m >> 20) & 0xF); }

//Defining "flags", which are constants for the locations to check in the move number

const MFLAGEP = 0x40000;	//en passant flag
const MFLAGPS = 0x80000;	//promotion flag
const MFLAGCA = 0x1000000;	//castle flag
const MFLAGCAP = 0x7C000;	//capture flag
const MFLAGPROM = 0xF00000;	//promotion flag
const NOMOVE = 0;			//no flag

//Returns true if a square is off board, false if on board
function SQOFFBOARD(sq)
{
	return (FilesBrd[sq] == SQUARES.OFFBOARD);
}

/*
When we want to make a move, we have to update the position key
Recall we can add a piece to a square by XORing its key, and since XOR is its own inverse
we can also remove the piece from that square by XORing the same key
We also change side, en passant, castling with the keys
These functions are simply auxiliary functions for the MovePiece function
*/
function HASH_PCE(pce, sq){	GameBoard.posKey ^= PieceKeys[(pce * 120) + sq];}
function HASH_CA() {GameBoard.posKey ^= CastleKeys[GameBoard.castlePerm]; }
function HASH_SIDE() {GameBoard.posKey ^= SideKey; }
function HASH_EP() {GameBoard.posKey ^= PieceKeys[GameBoard.enPas]; }






















