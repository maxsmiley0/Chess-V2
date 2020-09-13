//Generates the 25-bit move number given from, to, captured, promoted, and flag
function MOVE(from, to, captured, promoted, flag)
{
	//flag doesn't need to be shifted because it already accounts for being at the end
	return (from | (to << 7) | (captured << 14) | (promoted << 20) | flag); 
}