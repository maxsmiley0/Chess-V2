var perft_leafNodes;

//This updates perft_leafNodes to the number of leaf nodes searched at a given depth
function Perft (depth)
{
	//Case leaf node	
	if (depth == 0)
	{
		//Add a leaf node	
		perft_leafNodes++;
		return;
	}
	else 
	{
		//Generate moves
		GenerateMoves();
		//Iterate through the moves
		for (let i = GameBoard.moveListStart[GameBoard.ply]; i < GameBoard.moveListStart[GameBoard.ply + 1]; i++)
		{
			let move = GameBoard.moveList[i];
			//If illegal move, ignore
			if (MakeMove(move) == BOOL.FALSE)
			{
				continue;
			}
			//If legal move, go one node deeper into the tree
			Perft(depth - 1);
			TakeMove();
		}
	}
	return;
}

//Calling this outputs an analysis of the leaf nodes searched to the console
function PerftTest (depth)
{
	PrintBoard();
	console.log(`Starting Test to Depth: ${depth}`);
	//Reset leaf nodes
	perft_leafNodes = 0;
	//Generate moves
	GenerateMoves();
	//Loop through moves
	let moveNum = 0;
	for (let i = GameBoard.moveListStart[GameBoard.ply]; i < GameBoard.moveListStart[GameBoard.ply + 1]; i++)
	{
		let move = GameBoard.moveList[i];
		//Case illegal move
		if (MakeMove(move) == BOOL.FALSE)
		{
			continue;
		}
		//If legal move
		/*
		We actually print which move leads to how many leaf nodes, instead of the total number
		of leaf nodes from a given position, for debugging purposes
		*/
		moveNum++;
		let cumnodes = perft_leafNodes;
		Perft(depth - 1);
		TakeMove();
		let oldnodes = perft_leafNodes - cumnodes;
		console.log(`Move: ${moveNum} ${PrMove(move)} ${oldnodes}`);
	}
	//Print out total number of leaf nodes
	console.log(`Test Complete: ${perft_leafNodes} leaf nodes visited`);
	return;
}





