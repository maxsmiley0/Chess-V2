//Returns the principal variation move in a given position, if any
function ProbePvTable ()
{
	let index = GameBoard.posKey % PVENTRIES;
	
	if (GameBoard.PvTable[i] == GameBoard.posKey)
	{
		return GameBoard.PvTable[index].move;
	}
	
	return NOMOVE;
}

//Stores the principal variation move in the PvTable
function StorePvMove (move)
{
	let index = GameBoard.posKey % PVENTRIES;
	GameBoard.PvTable[index].posKey = GameBoard.posKey;
	GameBoard.PvTable[index].move = move;
}