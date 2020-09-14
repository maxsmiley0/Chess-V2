var GameBoard = 
{
	pieces: new Array(BRD_SQ_NUM),	//pieces in a given game board
	side: COLORS.WHITE,				//side to move
	fiftyMove: 0,					//50 move draw rule
	hisPly: 0,						//Stack of game states / moves
	ply: 0,							//Number of plies into the search tree	/ or game??
	castlePerm: 0,					//Can a given side castle?		
	enPas: 0,						//En passant
	material: new Array(2),			//Indexed by side, holds value of material
	pceNum: new Array(13),			//Indexed by piece, how many of a given piece exists?
	posKey: 0,						//Maps a board to a key (integer, unique)
	history: [],						//History array, unfixed size
	
	/*
	moveList stores all of the moves in the search tree, in order
	So, first the moves for a one ply search are stored, then the moves for a two-ply,
	then for a 3-ply, etc.
	However, how do we keep track of where the 1-ply, 2-ply, 3-ply etc. moves are sectioned
	off?
	moveListStart stores this information, it stores the first INDEX of a move at a given
	ply for moveListStart
	For example, if we want to loop through every move in a 3-ply search, we loop from
	i = moveListStart[3] until we hit i = moveListStart[4]
	And access the moves through moveList[i]
	*/
	
	moveListStart: new Array(MAXDEPTH),   
	moveList: new Array(MAXDEPTH * MAXPOSITIONMOVES),	//generated moves
	moveScores: new Array(MAXDEPTH * MAXPOSITIONMOVES), //scores for generated moves
	
	
	/*
	pList stores position of each pieces
	How can one piece have an index? Especially if there are multiple of them?
	We use the value of that piece * 10 + number of pieces left on the board of that type
	E.g. white knight has a value of wN = 2, lets say there are 7 white knights on the 
	board (some sort of crazy promotion scheme)
	Then the knights will correspond to wN * 10 + GameBoard.pceNum(wN)
	= 2 * 10 + GameBoard.pceNum(2) = 20, 21, 22, 23, 24, 25, 26
	And these indicies in PlistArray will correspond to an integer representing the positions
	of the white knights
	Why 10? No board can have more than 10 pieces, so the indicies will never overlap
	*/
	
	//Making sure pList has enough space
	pList: new Array(14 * 10),
	
	/*
	Principal Variation Table rundown: has 10000 entries
	Entries are indexed by the position key % 10000
	PvTable STORES the principal first move when searching from alpha beta
	PvTable stores a position, and a move
	*/
	
	PvTable: [],						//stores our pv information 10k entries
	PvArray: new Array(MAXDEPTH),		//stores the principal variation line
	
	searchHistory: new Array(14 * BRD_SQ_NUM),	//orders piece moves by alpha cutoffs
	searchKiller: new Array(3 * MAXDEPTH)		//orders killer moves by beta cutoffs
};

/*
We have all of these functions that generate position key, update piece list, etc.
However, these all run from scratch and take a while, in reality, it is quicker to
calculate these keys by having the previous position key and simply incrementally updating
it move by move
The latter method, while efficient, is more prone to error. This function simply checks
that everything is working as it should be
*/

function CheckBoard() 
{   
 	//Going through all members of GameBoard and ensuring everything checks out
	const t_pceNum = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	const t_material = [ 0, 0];
	
	//Looping through all pieces
	for(let t_piece = PIECES.wP; t_piece <= PIECES.bK; t_piece++) 
	{
		//Looping through all pieces of that type (e.g. from 0 to 7 for the 8 white pawns)	
		for(let t_pce_num = 0; t_pce_num < GameBoard.pceNum[t_piece]; t_pce_num++)
		 {
			//If there is some discontinuity between the GameBoard pieces and pList
			let sq120 = GameBoard.pList[PCEINDEX(t_piece,t_pce_num)];
			if(GameBoard.pieces[sq120] != t_piece) 
			{
				console.error("Error Pce Lists");
				return BOOL.FALSE;
			}
		}	
	}
	
	//Filling the temp arrays defined at the top of this function
	for(let sq64 = 0; sq64 < 64; sq64++) 
	{
		let sq120 = SQ120(sq64);
		let t_piece = GameBoard.pieces[sq120];
		t_pceNum[t_piece]++;
		t_material[PieceCol[t_piece]] += PieceVal[t_piece];
	}
	
	//Verifying the integrity of the number of pieces stored
	for(let t_piece = PIECES.wP; t_piece <= PIECES.bK; t_piece++) 
	{
		if(t_pceNum[t_piece] != GameBoard.pceNum[t_piece]) 
		{
				console.error("Error t_pceNum");
				return BOOL.FALSE;
			}	
	}
	
	//Verifying the integrity of the piece colors
	if(t_material[COLORS.WHITE] != GameBoard.material[COLORS.WHITE] ||
	   t_material[COLORS.BLACK] != GameBoard.material[COLORS.BLACK]) 
	{
		console.error("Error t_material");
		return BOOL.FALSE;
	}	
	
	//Verifying the integrity of the side to move
	if(GameBoard.side!=COLORS.WHITE && GameBoard.side!=COLORS.BLACK) 
	{
		console.error("Error GameBoard.side");
		return BOOL.FALSE;
	}
	
	//Verifying the integrity of the position key
	if(GeneratePosKey() != GameBoard.posKey) 
	{
		console.error("Error GameBoard.posKey");
		return BOOL.FALSE;
	}	
	
	return BOOL.TRUE;
}

//Prints a board representation to console, for debugging purposes
function PrintBoard ()
{	
	console.log("\nGame Board\n");
	
	for (let rank = RANKS.RANK_8; rank >= RANKS.RANK_1; rank--)
	{
		//Prints out # of Rank
		let line = RankChar[rank] + " ";
		//On the same line, prints out the pieces corresponding to those squares
		for (let file = FILES.FILE_A; file <= FILES.FILE_H; file++)
		{
			line += (" " + PceChar[GameBoard.pieces[FR2SQ(file, rank)]] + " ");
		}
		console.log(line);
	}
	
	console.log("");
	
	let line = "   ";
	//Prints out letter of File
	for (let file = FILES.FILE_A; file <= FILES.FILE_H; file++)
	{
		line += (" " + FileChar[file] + ' ');
	}
	
	//Auxiliary FEN information about the side to move, en passant state, castling rights
	//and position key
	console.log(line);
	console.log("side: " + SideChar[GameBoard.side]);
	console.log("enPas: " + GameBoard.enPas);
	
	line = "";
	
	if (GameBoard.castlePerm & CASTLEBIT.WKCA) line += 'K';
	if (GameBoard.castlePerm & CASTLEBIT.WQCA) line += 'Q';
	if (GameBoard.castlePerm & CASTLEBIT.BKCA) line += 'k';
	if (GameBoard.castlePerm & CASTLEBIT.BQCA) line += 'q';
	
	console.log("castle: " + line);
	console.log("key: " + GameBoard.posKey.toString(16));
}

//Generates a position key, using the random numbers from the arrays
function GeneratePosKey ()
{
	let finalKey = 0;
	
	//XORing pieces, iterating through board
	for (let sq = 0; sq < BRD_SQ_NUM; sq++)
	{
		let piece = GameBoard.pieces[sq];
		//If piece is not empty or off board
		if (piece != PIECES.EMPTY &&  piece != PIECES.OFFBOARD)
		{
			//XOR the key corresponding to a given piece on a square
			finalKey ^= PieceKeys[(piece * 120) + sq];
		}
	}
	
	//XORing the side
	if (GameBoard.side == COLORS.WHITE)
	{
		finalKey ^= SideKey;
	}
	
	//XORing en passant permission
	if (GameBoard.enPas != SQUARES.NO_SQ)
	{
		finalKey ^= [GameBoard.enPas];
	}
	
	//XORing castling permission
	finalKey ^= CastleKeys[GameBoard.castlePerm];
	
	return finalKey;
}

//Prints piece list in form "Piece P on e2"
function PrintPieceLists ()
{
	//Loops for each piece type	
	for (let piece = PIECES.wP; piece <= PIECES.bK; piece++)
	{
		for (let pceNum = 0; pceNum < GameBoard.pceNum[piece]; pceNum++)
		{
			console.log(`Piece ${PceChar[piece]} on ${PrSq(GameBoard.pList[PCEINDEX(piece, pceNum)])}`);
		}
	}
}

//Updates piece lists
function UpdateListsMaterial ()
{
	//Setting pList to empty 
	for (let i = 0; i < GameBoard.pList.length; i++)
	{
		GameBoard.pList[i] = PIECES.EMPTY;
	}
	
	//Material to zero
	for (let i = 0; i < GameBoard.material.length; i++)
	{
		GameBoard.material[i] = 0;
	}
	
	//Number of each piece to zero
	for (let i = 0; i < GameBoard.pceNum.length; i++)
	{
		GameBoard.pceNum[i] = 0;
	}
	
	//Loops through 64 squares
	for (let i = 0; i < 64; i++)
	{
		//Map the index onto the 12 x 10 board
		let sq = SQ120(i);
		let piece = GameBoard.pieces[sq];	//piece at that square
		
		//If the square is not empty
		if (piece != PIECES.EMPTY)
		{
			console.log(`piece ${piece} on square ${sq}`);
			
			GameBoard.material[PieceCol[piece]] += PieceVal[piece];	//update material
			GameBoard.pList[PCEINDEX(piece, GameBoard.pceNum[piece])] = sq; //add position to piece
			GameBoard.pceNum[piece]++;								//add piece to board
		}							
	}
	
	PrintPieceLists();
}

function ResetBoard ()
{
	//Setting all 120 squares to off board
	for (let i = 0; i < BRD_SQ_NUM; i++)
	{
		GameBoard.pieces[i] = SQUARES.OFFBOARD;
	}
	
	//Setting middle 8x8 grid to empty pieces
	for (let i = 0; i < 64; i++)
	{
		GameBoard.pieces[SQ120(i)] = PIECES.EMPTY;
	}
	
	//Members to default values
	GameBoard.side = COLORS.BOTH;
	GameBoard.enPas = SQUARES.NO_SQ;
	GameBoard.fiftyMove = 0;
	GameBoard.ply = 0;
	GameBoard.hisPly = 0;
	GameBoard.castlePerm = 0;
	GameBoard.posKey = 0;
	
	GameBoard.moveListStart[GameBoard.ply] = 0;
}

//Turns an FEN into a board!
function ParseFen (fen)
{
	ResetBoard();	//clear board before we put anything in
	
	let rank = RANKS.RANK_8;
	let file = FILES.FILE_A;
	let fenCnt = 0;				//stores which character are at, in the string fen
	let count = 0;				//stores how many squares will be updated by a single char
	let piece = 0;				//stores which piece will be inputted
	
	//This weird backwards loop is a byproduct of our file / rank naming conventions
	while ((rank >= RANKS.RANK_1) && fenCnt < fen.length)
	{
		count = 1;
		
		switch (fen[fenCnt])
		{
			//Case piece
			case 'p': piece = PIECES.bP; break;
			case 'r': piece = PIECES.bR; break;
			case 'n': piece = PIECES.bN; break;
			case 'b': piece = PIECES.bB; break;
			case 'k': piece = PIECES.bK; break;
			case 'q': piece = PIECES.bQ; break;
			case 'P': piece = PIECES.wP; break;
			case 'R': piece = PIECES.wR; break;
			case 'N': piece = PIECES.wN; break;
			case 'B': piece = PIECES.wB; break;
			case 'K': piece = PIECES.wK; break;
			case 'Q': piece = PIECES.wQ; break;
			
			//Case number (signifies blank squares)
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
				piece = PIECES.EMPTY;
				count = parseInt(fen[fenCnt], 10);
				break;
			
			//Reaching the end of a line
			case '/':	
			case ' ':
				rank--;
				file = FILES.FILE_A;
				fenCnt++;
				continue;
			default:
				console.log("FEN error");
				return;
		}
		
		//Sets "count" squares to the appropriate piece
		for (let i = 0; i < count; i++)
		{
			GameBoard.pieces[FR2SQ(file, rank)] = piece;
			file++;
		}
		
		fenCnt++;
	}
	
	GameBoard.side = (fen[fenCnt] == 'w') ? COLORS.WHITE : COLORS.BLACK;	//Sets turn
	fenCnt += 2;	//advances to castling privileges
	
	//Loop to 4 because there could exist up to 4 characters
	for (let i = 0; i < 4; i++, fenCnt++)
	{
		if (fen[fenCnt] == ' ')
		{
			break;
		}
		switch (fen[fenCnt])
		{
			//IOR operator??
			case 'K': GameBoard.castlePerm |= CASTLEBIT.WKCA; break;
			case 'Q': GameBoard.castlePerm |= CASTLEBIT.WQCA; break;
			case 'k': GameBoard.castlePerm |= CASTLEBIT.BKCA; break;
			case 'q': GameBoard.castlePerm |= CASTLEBIT.BQCA; break;
			default: break;
		}
	}
	
	fenCnt++;	//Moves on to en passant square
	
	if (fen[fenCnt] != '-')
	{
		file = fen[fenCnt].charCodeAt() - 'a'.charCodeAt();	//Number of ascii chars away from 'a'
		rank = parseInt(fen[fenCnt + 1], 10);
		
		console.log(`fen[fenCnt]: ${fen[fenCnt]} File: ${file} Rank: ${rank}`);
		GameBoard.enPas = FR2SQ(file, rank);
	}
	
	GameBoard.posKey = GeneratePosKey();
	UpdateListsMaterial();
	PrintSqAttacked();
}

function PrintSqAttacked ()
{
	console.log ("\nAttacked\n");
	
	for (let rank = RANKS.RANK_8; rank >= RANKS.RANK_1; rank--)
	{
		//Prints rank
		let line = `${rank + 1} `;
		let piece;
		//X for attacked square for a given side, otherwise '.'
		for (let file = FILES.FILE_A; file <= FILES.FILE_H; file++)
		{
			if (SqAttacked(FR2SQ(file, rank), GameBoard.side))
			{
				piece = 'X';
			}
			else 
			{
				piece = '.';
			}
			line += ` ${piece} `
		}
		console.log(line);
	}
	console.log('');
}

//Returns if a square is attacked by a given side
//Given a square, we first see if it is attacked by a pawn, then a knight, etc.
//Seems like it would include many unnecessary calculations
function SqAttacked (sq, side)
{	
	//pawn attack
	if (side == COLORS.WHITE)
	{
		//diagonals move by 9 and 11 in the 12x10 board
		if (GameBoard.pieces[sq - 11] == PIECES.wP || GameBoard.pieces[sq - 9] == PIECES.wP)
		{
			return BOOL.TRUE;
		}
	}
	else 
	{
		//diagonals move by 9 and 11 in the 12x10 board
		if (GameBoard.pieces[sq + 11] == PIECES.bP || GameBoard.pieces[sq + 9] == PIECES.bP)
		{
			return BOOL.TRUE;
		}
	}
	
	//Looping through various knight directions
	for (let i = 0; i < KnDir.length; i++)
	{
		let piece = GameBoard.pieces[sq + KnDir[i]];
		if (piece != SQUARES.OFFBOARD && PieceCol[piece] == side && PieceKnight[piece] == BOOL.TRUE)
		{
			return BOOL.TRUE;
		}
	}
	
	//Looping through four directions of rooks
	for (let i = 0; i < 4; i++)
	{
		let t_sq = sq + RkDir[i];
		let piece = GameBoard.pieces[t_sq];
		//loop until we go off the board
		while (piece != SQUARES.OFFBOARD)
		{
			//break out of the loop if we run into a piece
			if (piece != PIECES.EMPTY)
			{
				//Returns true if there is a rook or queen horizontally / vertically
				//Breaks if wrong color
				if (PieceRookQueen[piece] == BOOL.TRUE && PieceCol[piece] == side)
				{
					return BOOL.TRUE;
				}
				break;
			}
			
			t_sq += RkDir[i];
			piece = GameBoard.pieces[t_sq];
		}
	}
	
	//Looping through four directions of bishops
	for (let i = 0; i < 4; i++)
	{
		let t_sq = sq + BiDir[i];
		let piece = GameBoard.pieces[t_sq];
		//loop until we go off the board
		while (piece != SQUARES.OFFBOARD)
		{
			//break out of the loop if we run into a piece
			if (piece != PIECES.EMPTY)
			{
				//Returns true if there is a bishop or queen diagonally
				//Breaks if wrong color
				if (PieceBishopQueen[piece] == BOOL.TRUE && PieceCol[piece] == side)
				{
					return BOOL.TRUE;
				}
				break;
			}
			
			t_sq += BiDir[i];
			piece = GameBoard.pieces[t_sq];
		}
	}
	
	//Looping through various king directions
	for (let i = 0; i < KiDir.length; i++)
	{
		let piece = GameBoard.pieces[sq + KiDir[i]];
		if (piece != SQUARES.OFFBOARD && PieceCol[piece] == side && PieceKing[piece] == BOOL.TRUE)
		{
			return BOOL.TRUE;
		}
	}
	
	return BOOL.FALSE;
}





