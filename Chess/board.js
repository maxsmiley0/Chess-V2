var GameBoard = 
{
	pieces: new Array(BRD_SQ_NUM),	//pieces in a given game board
	side: COLORS.WHITE,				//side to move
	fiftyMove: 0,					//50 move draw rule
	hisPly: 0,						//Stack of game states / moves
	ply: 0,							//Number of plies into the search tree	
	castlePerm: 0					//Can a given side castle?		
};