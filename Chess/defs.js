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