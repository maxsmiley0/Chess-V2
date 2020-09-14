

//Static eval, to be called at leaf nodes
function EvalPosition ()
{
	//Material difference
	let score = GameBoard.material[COLORS.WHITE] - GameBoard.material[COLORS.BLACK];
	
	return (GameBoard.side == COLORS.WHITE ? score: -score);
}