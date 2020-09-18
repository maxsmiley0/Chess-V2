//Have some FEN database and the best move assigned
//One array that will index the start the other by ply
//Another array that will store the lines indexed by above
//Another array that will store the best move indexed by above

var Book =
{
	//Starting positions
	//Only for black,
	position: [
	//Sicilian
	//g3 line
	"rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e2",
	"rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq -",
	"rnbqkbnr/pp2pppp/3p4/2p5/4P3/5NP1/PPPP1P1P/RNBQKB1R b KQkq -",
	"rnbqkb1r/pp2pppp/3p1n2/2p5/4P3/2N2NP1/PPPP1P1P/R1BQKB1R b KQkq -",
	"rnbqkb1r/pp2pp1p/3p1np1/2p5/4P3/2N2NP1/PPPP1PBP/R1BQK2R b KQkq -",
	"r1bqkb1r/pp2pp1p/2np1np1/2p5/4P3/2N2NP1/PPPP1PBP/R1BQ1RK1 b kq -",
	//Bb4 line
	"rnbqkbnr/pp2pppp/3p4/2p5/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq -",
	"rnbqkb1r/pp2pppp/3p1n2/2p5/2B1P3/2N2N2/PPPP1PPP/R1BQK2R b KQkq -",
	"rnbqkb1r/pp3ppp/3ppn2/8/2BNP3/2N5/PPP2PPP/R1BQK2R b KQkq -",
	"rnbqk2r/pp2bppp/3ppn2/8/2BNP3/2N1B3/PPP2PPP/R2QK2R b KQkq -",
	"rnbqkb1r/pp2pppp/3p1n2/2p5/2B1P3/3P1N2/PPP2PPP/RNBQK2R b KQkq -",
	"rnbqkb1r/pp3ppp/3ppn2/2p5/2B1PB2/3P1N2/PPP2PPP/RN1QK2R b KQkq -",
	//d4 line
	"rnbqkbnr/pp2pppp/3p4/8/3NP3/8/PPP2PPP/RNBQKB1R b KQkq -",
	"rnbqkb1r/pp2pppp/3p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R b KQkq -"

	],
	bestMove: [
	//Sicilian
	//g3 line
	MOVE(83, 63, PIECES.EMPTY, PIECES.EMPTY, NOMOVE),
	MOVE(84, 74, PIECES.EMPTY, PIECES.EMPTY, NOMOVE),
	MOVE(97, 76, PIECES.EMPTY, PIECES.EMPTY, NOMOVE),
	MOVE(87, 77, PIECES.EMPTY, PIECES.EMPTY, NOMOVE),
	MOVE(92, 73, PIECES.EMPTY, PIECES.EMPTY, NOMOVE),
	MOVE(96, 87, PIECES.EMPTY, PIECES.EMPTY, NOMOVE),
	//Bb4 line
	MOVE(97, 76, PIECES.EMPTY, PIECES.EMPTY, NOMOVE),
	MOVE(85, 75, PIECES.EMPTY, PIECES.EMPTY, NOMOVE),
	MOVE(96, 85, PIECES.EMPTY, PIECES.EMPTY, NOMOVE),
	MOVE(95, 97, PIECES.EMPTY, PIECES.EMPTY, MFLAGCA),
	MOVE(85, 75, PIECES.EMPTY, PIECES.EMPTY, NOMOVE),
	MOVE(96, 85, PIECES.EMPTY, PIECES.EMPTY, NOMOVE),
	//d4 line
	MOVE(97, 76, PIECES.EMPTY, PIECES.EMPTY, NOMOVE),
	MOVE(81, 71, PIECES.EMPTY, PIECES.EMPTY, NOMOVE)
	]
};

//Kings pawn
//rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1



//Queens pawn

//English

//Either knight 
//"rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -"
//MOVE(33, 53, PIECES.NONE, PIECES.NONE, NOMOVE)
