//Gets the principal variation line to a given depth
function GetPvLine (depth)
{
	let move = ProbePvTable ();
	let count = 0;
	
	//While there is still another move in the line, or the line exceeds the depth
	while (move != NOMOVE && count < depth)
	{
		//Make the moves
		if (MoveExists(move) == BOOL.TRUE)
		{
			MakeMove(move);
			GameBoard.PvArray[count++] = move;
		}
		else 
		{
			break;
		}
		move = ProbePvTable();
	}
	//Take back the moves so the initial GameBoard state is unchanged
	while (GameBoard.ply > 0)
	{
		TakeMove();
	}
	
	return count;
}

//Returns the principal variation move in a given position, if any
function ProbePvTable ()
{
	let index = GameBoard.posKey % PVENTRIES;
	
	if (GameBoard.PvTable[index].posKey == GameBoard.posKey)
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
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	