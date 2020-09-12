//Maps a square onto its chess position equivalen (e.g. 21 => a1)
function PrSq(sq)
{
	return `${FileChar[FilesBrd[sq]]}${RankChar[RanksBrd[sq]]}`;
}