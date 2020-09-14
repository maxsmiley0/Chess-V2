//When we click the button with the ID "SetFen", it executes this
$("#SetFen").click(function ()
{
	//Inputs the value in the "Set Position" field from index.html to ParseFen and prints
	ParseFen($("#fenIn").val());
	PrintBoard();
	PerftTest(6);
});