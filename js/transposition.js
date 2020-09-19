var TranspositionTable = 
{
	//Stores positions, indexed by posKey modulo TTABLEENTRIES
	position: new Array(TTABLEENTRIES),
	//Stores depth at which position is searched to
	depth: new Array(TTABLEENTRIES),
	//Stores score of position
	score: new Array(TTABLEENTRIES)
};

function ClearTranspositionTable ()
{
	/*
	We only need to clear the position, because that is what we use to determine if we
	should use all other fields. Other fields will get overwritten by new data
	*/
	for (let i = 0; i < TTABLEENTRIES.length; i++)
	{
		position[i] = 0;
	}
}