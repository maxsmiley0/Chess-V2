$(function()
{
	init();
	console.log("Main Init Called");
	ParseFen(START_FEN);
	PrintBoard();
});

function InitFileRanksBrd()
{	
	//Filling entire array with the OFFBOARD value
	for (let i = 0; i < BRD_SQ_NUM; i++)
	{
		FilesBrd[i] = SQUARES.OFFBOARD;
		RanksBrd[i] = SQUARES.OFFBOARD;
	}
	
	//Filling the middle 8 x 8 grid with the appropriate numbers
	for (let rank = RANKS.RANK_1; rank < RANKS.RANK_NONE; rank++)
	{
		for (let file = FILES.FILE_A; file < FILES.FILE_NONE; file++)
		{
			FilesBrd[FR2SQ(file, rank)] = file;
			RanksBrd[FR2SQ(file, rank)] = rank;
		}
	}
}

//Filling all of the keys with RAND_32 numbers
function InitHashKeys ()
{
	PieceKeys.forEach(i => RAND_32);
	
	for (let i = 0; i < PieceKeys.length; i++)
	{
		PieceKeys[i] = RAND_32();
	}
	
	SideKey = RAND_32();
	
	for (let i = 0; i < CastleKeys.length; i++)
	{
		CastleKeys[i] = RAND_32();
	}
}

//Initializes Sq120ToSq64 and Sq64ToSq120

function InitSq120ToSq64 ()
{
	//Filling array 120 w/ placeholder values
	for (let i = 0; i < BRD_SQ_NUM; i++)
	{
		Sq120ToSq64[i] = SQUARES.OFFBOARD;
	}
	//Filling array 64 w/ placeholder values
	for (let i = 0; i < 64; i++)
	{
		Sq120ToSq64[i] = SQUARES.OFFBOARD;
	}
	
	let sq64 = 0;
	//Filling them with their actual values
	for (let rank = RANKS.RANK_1; rank < RANKS.RANK_NONE; rank++)
	{
		for (let file = FILES.FILE_A; file < FILES.FILE_NONE; file++)
		{
			let sq = FR2SQ(file, rank);
			
			Sq64ToSq120[sq64] = sq;
			Sq120ToSq64[sq] = sq64;
			sq64++;
		}
	}
}

//Initializes board history array
function InitBoardVars()
{
	//Initializing history table
	for(let i = 0; i < MAXGAMEMOVES; i++) 
	{
		GameBoard.history.push
		({
			move: NOMOVE,
			castlePerm: 0,
			enPas: 0,
			fiftyMove: 0,
			posKey: 0
		});
	}	
	//Initializing Pv Table
	for (let i = 0; i < PVENTRIES; i++)
	{
		GameBoard.PvTable.push
		({
			move: NOMOVE,
			posKey: 0
		});
	}
}

//Initializes color of board squares in the html file
function InitBoardSquares ()
{
	let light = 1;
	
	let rankName;
	let fileName;
	let divString;
	let lightString;
	
	//Loop through all squares
	for (let rankItr = RANKS.RANK_8; rankItr >= RANKS.RANK_1; rankItr--)
	{
		light ^= 1;	//flipping color of square
		rankName = `rank${rankItr + 1}`;
		
		for (let fileItr = FILES.FILE_A; fileItr <= FILES.FILE_H; fileItr++)
		{
			fileName = `file${fileItr + 1}`;
			
			if (light == 0)
			{
				lightString = "Light";
			}
			else 
			{
				lightString = "Dark";
			}
			
			light ^= 1;
			divString = "<div class=\"Square " + rankName + " " + fileName + " " + lightString + "\"/>";
			$("#Board").append(divString);
		}
	}
}

function init()
{
	console.log("init() called");
	InitFileRanksBrd();				//Initializing rank and file arrays
	InitHashKeys();					//Initializing position keys
	InitSq120ToSq64();				//Initializing Sq64ToSq120 and Sq120ToSq64 arrays
	InitBoardVars();				//Initializing board history array
	InitMvvLva();					//Initializing MvvLva array
	InitBoardSquares();
}









