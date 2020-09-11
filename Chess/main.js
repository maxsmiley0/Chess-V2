$(function()
{
	init();
	console.log("Main Init Called");
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

function init()
{
	console.log("init() called");
	InitFileRanksBrd();				//Initializing rank and file arrays
	InitHashKeys();					//Initializing position keys
}