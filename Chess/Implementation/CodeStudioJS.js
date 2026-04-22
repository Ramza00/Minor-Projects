var moves = [];
var board =
[["a1","b1","c1","d1","e1","f1","g1","h1"],["a2","b2","c2","d2","e2","f2","g2","h2"],["a3","b3","c3","d3","e3","f3","g3","h3"],["a4","b4","c4","d4","e4","f4","g4","h4"],["a5","b5","c5","d5","e5","f5","g5","h5"],["a6","b6","c6","d6","e6","f6","g6","h6"],["a7","b7","c7","d7","e7","f7","g7","h7"],["a8","b8","c8","d8","e8","f8","g8","h8"]];
var Lightentity =
[["R","N","B","Q","K","B","N","R"],["P","P","P","P","P","P","P","P"],["","","","","","","",""],["","","","","","","",""],["","","","","","","",""],["","","","","","","",""],["","","","","","","",""],["","","","","","","",""]];
var Darkentity =
[["","","","","","","",""],["","","","","","","",""],["","","","","","","",""],["","","","","","","",""],["","","","","","","",""],["","","","","","","",""],["P","P","P","P","P","P","P","P"],["R","N","B","Q","K","B","N","R"]];
var castleRook = [[true,true],[true,true]];
var castleRight = [true,true];
var bypass = false;
var kingPos = ["e1","e8"];
var square = "";
var epPotential = "";
var bot = false;
var prediction = [];
var permeate = false;
function AL(){
bot = true;
var temp;
var possibilities = [];
if(moves.length==0||moves[moves.length-1].indexOf("+")==-1){
temp = getPieces();
for(var i = 0; i < temp.length; i++){
var temp2 = validmoves(temp[i]);
for(var j = 0; j < temp2.length; j++){
appendItem(possibilities,temp[i]+temp2[j]);
}
}
}
else possibilities = prediction;
while(true && possibilities.length>0){
var index = randomNumber(0,possibilities.length-1);
square = possibilities[index].substring(0,2);
move(possibilities[index].substring(2));
if(getText("currenttile") != "na") break;
removeItem(possibilities,index);
}
bot = false;
}
function check(){
var ally = getPieces();
if(!cheque(ally)){
for(var i = 0; i < ally.length; i++)
if(ally[i]!=kingPos[moves.length%2]){if(validmoves(ally[i]).length>0) return "";} else if(domain().length>0)
return "";
return "$";
}
available(ally);
if(prediction.length==0) return "#";
return "+";
}
function domain(){
var temp = kingPos[moves.length%2];
var toReturn = validmoves(temp);
for(var i = 0; i < toReturn; i++)
if(convert(toReturn[i].substring(0,1))+2==convert(temp.substring(0,1))||convert(toReturn[i].substring(0,1))-2==convert(temp.substring(0,1))){removeItem(toReturn,i); i--;}
kingPos[moves.length%2] = "";
(moves.length%2==0 ? Lightentity : Darkentity)[temp.substring(1)-1][convert(temp.substring(0,1))-1] = "";
appendItem(moves,"");
var opp = getPieces();
permeate = true;
for(i = 0; i < opp.length; i++){
var compare = validmoves(opp[i]);
for(var j = 0; j < compare.length; j++) if(toReturn.indexOf(compare[j]) != -1) removeItem(toReturn,toReturn.indexOf(compare[j]));
}
permeate = false;
removeItem(moves,moves.length-1);
kingPos[moves.length%2] = temp;
(moves.length%2==0 ? Lightentity : Darkentity)[temp.substring(1)-1][convert(temp.substring(0,1))-1] = "K";
return toReturn;
}
function checkpath(position, king){
var allyPos = moves.length%2==0 ? Lightentity : Darkentity;
var enemyPos = moves.length%2==0 ? Darkentity : Lightentity;
var horizontal = convert(position.substring(0,1))-1;
var vertical = position.substring(1)-1;
var legalmoves = [];
var i;
var piece = allyPos[vertical][horizontal];
if(piece == "R" || piece == "Q"){
for(i = horizontal+1; i < 8; i++){
if(allyPos[vertical][i]!="") break;
appendItem(legalmoves,board[vertical][i]);
if(enemyPos[vertical][i]!="") break;
}
if(legalmoves.indexOf(king)!=-1) return legalmoves;
legalmoves = [];
for(i = horizontal-1; i >= 0; i--){
if(allyPos[vertical][i]!="") break;
appendItem(legalmoves,board[vertical][i]);
if(enemyPos[vertical][i]!="") break;
}
if(legalmoves.indexOf(king)!=-1) return legalmoves;
legalmoves = [];
for(i = vertical+1; i < 8; i++){
if(allyPos[i][horizontal]!="") break;
appendItem(legalmoves,board[i][horizontal]);
if(enemyPos[i][horizontal]!="") break;
}
if(legalmoves.indexOf(king)!=-1) return legalmoves;
legalmoves = [];
for(i = vertical-1; i >= 0; i--){
if(allyPos[i][horizontal]!="") break;
appendItem(legalmoves,board[i][horizontal]);
if(enemyPos[i][horizontal]!="") break;
}
if(legalmoves.indexOf(king)!=-1) return legalmoves;
legalmoves = [];
}
if(piece == "B" || piece == "Q"){
for(i = [vertical+1,horizontal+1]; i[0]<8 && i[1]<8; i[0]++,i[1]++){
if(allyPos[i[0]][i[1]]!="") break;
appendItem(legalmoves,board[i[0]][i[1]]);
if(enemyPos[i[0]][i[1]]!="") break;
}
if(legalmoves.indexOf(king)!=-1) return legalmoves;
legalmoves = [];
for(i = [vertical+1,horizontal-1]; i[0]<8 && i[1]>=0; i[0]++,i[1]--){
if(allyPos[i[0]][i[1]]!="") break;
appendItem(legalmoves,board[i[0]][i[1]]);
if(enemyPos[i[0]][i[1]]!="") break;
}
if(legalmoves.indexOf(king)!=-1) return legalmoves;
legalmoves = [];
for(i = [vertical-1,horizontal+1]; i[0]>=0 && i[1]<8; i[0]--,i[1]++){
if(allyPos[i[0]][i[1]]!="") break;
appendItem(legalmoves,board[i[0]][i[1]]);
if(enemyPos[i[0]][i[1]]!="") break;
}
if(legalmoves.indexOf(king)!=-1) return legalmoves;
legalmoves = [];
for(i = [vertical-1,horizontal-1]; i[0]>=0 && i[1]>=0; i[0]--,i[1]--){
if(allyPos[i[0]][i[1]]!="") break;
appendItem(legalmoves,board[i[0]][i[1]]);
if(enemyPos[i[0]][i[1]]!="") break;
}
if(legalmoves.indexOf(king)!=-1) return legalmoves;
legalmoves = [];
}
return legalmoves;
}
function validmoves(position){
var allyPos = moves.length%2==0 ? Lightentity : Darkentity;
var enemyPos = moves.length%2==0 ? Darkentity : Lightentity;
var horizontal = convert(position.substring(0,1))-1;
var vertical = position.substring(1)-1;
var legalmoves = [];
var i;
var piece = allyPos[vertical][horizontal];
if(piece == "R" || piece == "Q"){
for(i = horizontal+1; i < 8; i++){
if(allyPos[vertical][i]!=""){if(permeate) appendItem(legalmoves,board[vertical][i]); break;}
appendItem(legalmoves,board[vertical][i]);
if(enemyPos[vertical][i]!="") break;
}
for(i = horizontal-1; i >= 0; i--){
if(allyPos[vertical][i]!=""){if(permeate) appendItem(legalmoves,board[vertical][i]); break;}
appendItem(legalmoves,board[vertical][i]);
if(enemyPos[vertical][i]!="") break;
}
for(i = vertical+1; i < 8; i++){
if(allyPos[i][horizontal]!=""){ if(permeate) appendItem(legalmoves,board[i][horizontal]); break;}
appendItem(legalmoves,board[i][horizontal]);
if(enemyPos[i][horizontal]!="") break;
}
for(i = vertical-1; i >= 0; i--){
if(allyPos[i][horizontal]!=""){ if(permeate) appendItem(legalmoves,board[i][horizontal]); break;}
appendItem(legalmoves,board[i][horizontal]);
if(enemyPos[i][horizontal]!="") break;
}
}
if(piece == "B" || piece == "Q"){
for(i = [vertical+1,horizontal+1]; i[0]<8 && i[1]<8; i[0]++,i[1]++){
if(allyPos[i[0]][i[1]]!=""){ if(permeate) appendItem(legalmoves,board[i[0]][i[1]]); break;}
appendItem(legalmoves,board[i[0]][i[1]]);
if(enemyPos[i[0]][i[1]]!="") break;
}
for(i = [vertical+1,horizontal-1]; i[0]<8 && i[1]>=0; i[0]++,i[1]--){
if(allyPos[i[0]][i[1]]!=""){ if(permeate) appendItem(legalmoves,board[i[0]][i[1]]); break;}
appendItem(legalmoves,board[i[0]][i[1]]);
if(enemyPos[i[0]][i[1]]!="") break;
}
for(i = [vertical-1,horizontal+1]; i[0]>=0 && i[1]<8; i[0]--,i[1]++){
if(allyPos[i[0]][i[1]]!=""){ if(permeate) appendItem(legalmoves,board[i[0]][i[1]]); break;}
appendItem(legalmoves,board[i[0]][i[1]]);
if(enemyPos[i[0]][i[1]]!="") break;
}
for(i = [vertical-1,horizontal-1]; i[0]>=0 && i[1]>=0; i[0]--,i[1]--){
if(allyPos[i[0]][i[1]]!=""){ if(permeate) appendItem(legalmoves,board[i[0]][i[1]]); break;}
appendItem(legalmoves,board[i[0]][i[1]]);
if(enemyPos[i[0]][i[1]]!="") break;
}
}
else if(piece == "N"){
try{if(allyPos[vertical+1][horizontal+2]==""||permeate) appendItem(legalmoves,(convert(horizontal+3))+(vertical+2));}catch(error){}
try{if(allyPos[vertical+1][horizontal-2]==""||permeate) appendItem(legalmoves,(convert(horizontal-1))+(vertical+2));}catch(error){}
try{if(allyPos[vertical+2][horizontal+1]==""||permeate) appendItem(legalmoves,(convert(horizontal+2))+(vertical+3));}catch(error){}
try{if(allyPos[vertical+2][horizontal-1]==""||permeate) appendItem(legalmoves,(convert(horizontal))+(vertical+3));}catch(error){}
try{if(allyPos[vertical-1][horizontal+2]==""||permeate) appendItem(legalmoves,(convert(horizontal+3))+(vertical));}catch(error){}
try{if(allyPos[vertical-1][horizontal-2]==""||permeate) appendItem(legalmoves,(convert(horizontal-1))+(vertical));}catch(error){}
try{if(allyPos[vertical-2][horizontal+1]==""||permeate) appendItem(legalmoves,(convert(horizontal+2))+(vertical-1));}catch(error){}
try{if(allyPos[vertical-2][horizontal-1]==""||permeate) appendItem(legalmoves,(convert(horizontal))+(vertical-1));}catch(error){}
}
else if(piece == "P"){
var reverse = moves.length%2 == 0 ? 1 : -1;
if(allyPos[vertical+reverse][horizontal]==""&&enemyPos[vertical+reverse][horizontal]==""){
appendItem(legalmoves,convert(horizontal+1)+(vertical+1+reverse));
if(position.substring(1)==4.5-2.5*reverse&&allyPos[vertical+2*reverse][horizontal]==""&&enemyPos[vertical+2*reverse][horizontal]=="")
appendItem(legalmoves,convert(horizontal+1)+(vertical+1+2*reverse));
}
if(allyPos[vertical+reverse][horizontal-1] == "" && ((enemyPos[vertical+reverse][horizontal-1] !=""^epPotential == convert(horizontal)+(vertical+1))||permeate))
appendItem(legalmoves,convert(horizontal)+(vertical+1+reverse));
if(allyPos[vertical+reverse][horizontal+1] == "" && ((enemyPos[vertical+reverse][horizontal+1] !=""^epPotential == convert(horizontal+2)+(vertical+1))||permeate))
appendItem(legalmoves,convert(horizontal+2)+(vertical+1+reverse));
}
else if(piece == "K"){
if(castleRight[moves.length%2]){
if(castleRook[moves.length%2][0] && allyPos[vertical][horizontal-1]=="" &&
allyPos[vertical][horizontal-2]=="" &&
enemyPos[vertical][horizontal-1]=="" && enemyPos[vertical][horizontal-2]=="")
appendItem(legalmoves,convert(horizontal-1)+(vertical+1));
if(castleRook[moves.length%2][1] && allyPos[vertical][horizontal+1]=="" &&
allyPos[vertical][horizontal+2]=="" &&
enemyPos[vertical][horizontal+1]=="" && enemyPos[vertical][horizontal+2]=="")
appendItem(legalmoves,convert(horizontal+3)+(vertical+1));
}
try{if(allyPos[vertical+1][horizontal+1] == "") appendItem(legalmoves,convert(horizontal+2)+(vertical+2));}catch(error){}
try{if(allyPos[vertical+1][horizontal] == "") appendItem(legalmoves,convert(horizontal+1)+(vertical+2));}catch(error){}
try{if(allyPos[vertical+1][horizontal-1] == "") appendItem(legalmoves,convert(horizontal)+(vertical+2));}catch(error){}
try{if(allyPos[vertical][horizontal+1] == "") appendItem(legalmoves,convert(horizontal+2)+(vertical+1));}catch(error){}
try{if(allyPos[vertical][horizontal-1] == "") appendItem(legalmoves,convert(horizontal)+(vertical+1));}catch(error){}
try{if(allyPos[vertical-1][horizontal+1] == "") appendItem(legalmoves,convert(horizontal+2)+(vertical));}catch(error){}
try{if(allyPos[vertical-1][horizontal] == "") appendItem(legalmoves,convert(horizontal+1)+(vertical));}catch(error){}
try{if(allyPos[vertical-1][horizontal-1] == "") appendItem(legalmoves,convert(horizontal)+(vertical));}catch(error){}
}
return legalmoves;
}
function notation(origin,end){
var color = moves.length % 2 == 0 ? "Light" : "Dark";
var allyPos = color == "Light" ? Lightentity : Darkentity;
var enemyPos = color == "Light" ? Darkentity : Lightentity;
var xaxis1 = (origin.substring(1)-1);
var yaxis1 = (convert(origin.substring(0,1))-1);
var xaxis2 = (end.substring(1)-1);
var yaxis2 = (convert(end.substring(0,1))-1);
var piece = allyPos[xaxis1][yaxis1];
if(piece==""||allyPos[xaxis2][yaxis2]!="") return "";
var toReturn = piece != "P" && piece != "K" ? piece : "";
var returnTail = "";
var possiblemoves = [];
var castle = "";
var ep = false;
var i;
var vnot = 0;
var hnot = 0;
if(piece == "R"){
for(i = xaxis2+1; i < 8; i++){
if(enemyPos[i][yaxis2]!=""||(allyPos[i][yaxis2]!=""&&allyPos[i][yaxis2]!=piece)) break;
else if(allyPos[i][yaxis2]=="") continue;
else appendItem(possiblemoves,board[i][yaxis2]);
}
for(i = xaxis2-1; i >= 0; i--){
if(enemyPos[i][yaxis2]!=""||(allyPos[i][yaxis2]!=""&&allyPos[i][yaxis2]!=piece)) break;
else if(allyPos[i][yaxis2]=="") continue;
else appendItem(possiblemoves,board[i][yaxis2]);
}
if(possiblemoves.indexOf(origin)!=-1){
if(possiblemoves.length > 1) toReturn += origin.substring(0,1);
}
else {
for(i = yaxis2+1; i < 8; i++){
if(enemyPos[xaxis2][i]!=""||(allyPos[xaxis2][i]!=""&&allyPos[xaxis2][i]!=piece)) break;
else if(allyPos[xaxis2][i]=="") continue;
else appendItem(possiblemoves,board[xaxis2][i]);
}
for(i = yaxis2-1; i >= 0; i--){
if(enemyPos[xaxis2][i]!=""||(allyPos[xaxis2][i]!=""&&allyPos[xaxis2][i]!=piece)) break;
else if(allyPos[xaxis2][i]=="") continue;
else appendItem(possiblemoves,board[xaxis2][i]);
}
if(possiblemoves.indexOf(origin)==-1) return "";
}
if(origin == "a1" || origin == "h1" || origin == "a8" || origin == "h8")
castleRook[color=="Light"?0:1][xaxis1>4?0:1] = false;
}
else if(piece == "B"){
for(i = [xaxis2+1,yaxis2+1]; i[0]<8 && i[1]<8; i[0]++,i[1]++){
if(enemyPos[i[0]][i[1]]!=""||(allyPos[i[0]][i[1]]!=""&&allyPos[i[0]][i[1]]!=piece)) break;
else if(allyPos[i[0]][i[1]]=="") continue;
else appendItem(possiblemoves,board[i[0]][i[1]]);
}
for(i = [xaxis2+1,yaxis2-1]; i[0]<8 && i[1]>=0; i[0]++,i[1]--){
if(enemyPos[i[0]][i[1]]!=""||(allyPos[i[0]][i[1]]!=""&&allyPos[i[0]][i[1]]!=piece)) break;
else if(allyPos[i[0]][i[1]]=="") continue;
else appendItem(possiblemoves,board[i[0]][i[1]]);
}
for(i = [xaxis2-1,yaxis2+1]; i[0]>=0 && i[1]<8; i[0]--,i[1]++){
if(enemyPos[i[0]][i[1]]!=""||(allyPos[i[0]][i[1]]!=""&&allyPos[i[0]][i[1]]!=piece)) break;
else if(allyPos[i[0]][i[1]]=="") continue;
else appendItem(possiblemoves,board[i[0]][i[1]]);
}
for(i = [xaxis2-1,yaxis2-1]; i[0]>=0 && i[1]>=0; i[0]--,i[1]--){
if(enemyPos[i[0]][i[1]]!=""||(allyPos[i[0]][i[1]]!=""&&allyPos[i[0]][i[1]]!=piece)) break;
else if(allyPos[i[0]][i[1]]=="") continue;
else appendItem(possiblemoves,board[i[0]][i[1]]);
}
if(possiblemoves.indexOf(origin)==-1) return "";
for(i = 0; i < possiblemoves.length; i++){
if(possiblemoves[i] == origin) continue;
if(possiblemoves[i].substring(0,1)==origin.substring(0,1)){
toReturn += origin.substring(1,2);
break;
}
else if(possiblemoves[i].substring(1,2)==origin.substring(1,2)){
toReturn += origin.substring(0,1);
break;
}
}
}
else if(piece == "Q"){
if(yaxis1==yaxis2||xaxis1==xaxis2){
for(i = xaxis2+1; i < 8; i++){
if(enemyPos[i][yaxis2]!=""||(allyPos[i][yaxis2]!=""&&allyPos[i][yaxis2]!=piece)) break;
else if(allyPos[i][yaxis2]=="") continue;
else appendItem(possiblemoves,board[i][yaxis2]);
}
for(i = xaxis2-1; i >= 0; i--){
if(enemyPos[i][yaxis2]!=""||(allyPos[i][yaxis2]!=""&&allyPos[i][yaxis2]!=piece)) break;
else if(allyPos[i][yaxis2]=="") continue;
else appendItem(possiblemoves,board[i][yaxis2]);
}
for(i = yaxis2+1; i < 8; i++){
if(enemyPos[xaxis2][i]!=""||(allyPos[xaxis2][i]!=""&&allyPos[xaxis2][i]!=piece)) break;
else if(allyPos[xaxis2][i]=="") continue;
else appendItem(possiblemoves,board[xaxis2][i]);
}
for(i = yaxis2-1; i >= 0; i--){
if(enemyPos[xaxis2][i]!=""||(allyPos[xaxis2][i]!=""&&allyPos[xaxis2][i]!=piece)) break;
else if(allyPos[xaxis2][i]=="") continue;
else appendItem(possiblemoves,board[xaxis2][i]);
}
}
else {
for(i = [xaxis2+1,yaxis2+1]; i[0]<8 && i[1]<8; i[0]++,i[1]++){
if(enemyPos[i[0]][i[1]]!=""||(allyPos[i[0]][i[1]]!=""&&allyPos[i[0]][i[1]]!=piece)) break;
else if(allyPos[i[0]][i[1]]=="") continue;
else appendItem(possiblemoves,board[i[0]][i[1]]);
}
for(i = [xaxis2+1,yaxis2-1]; i[0]<8 && i[1]>=0; i[0]++,i[1]--){
if(enemyPos[i[0]][i[1]]!=""||(allyPos[i[0]][i[1]]!=""&&allyPos[i[0]][i[1]]!=piece)) break;
else if(allyPos[i[0]][i[1]]=="") continue;
else appendItem(possiblemoves,board[i[0]][i[1]]);
}
for(i = [xaxis2-1,yaxis2+1]; i[0]>=0 && i[1]<8; i[0]--,i[1]++){
if(enemyPos[i[0]][i[1]]!=""||(allyPos[i[0]][i[1]]!=""&&allyPos[i[0]][i[1]]!=piece)) break;
else if(allyPos[i[0]][i[1]]=="") continue;
else appendItem(possiblemoves,board[i[0]][i[1]]);
}
for(i = [xaxis2-1,yaxis2-1]; i[0]>=0 && i[1]>=0; i[0]--,i[1]--){
if(enemyPos[i[0]][i[1]]!=""||(allyPos[i[0]][i[1]]!=""&&allyPos[i[0]][i[1]]!=piece)) break;
else if(allyPos[i[0]][i[1]]=="") continue;
else appendItem(possiblemoves,board[i[0]][i[1]]);
}
}
if(possiblemoves.indexOf(origin)==-1) return "";
}
else if(piece == "N"){
try{if(allyPos[xaxis2+1][yaxis2+2]==piece) appendItem(possiblemoves,(convert(yaxis2+3))+(xaxis2+2));}catch(error){}
try{if(allyPos[xaxis2+1][yaxis2-2]==piece) appendItem(possiblemoves,(convert(yaxis2-1))+(xaxis2+2));}catch(error){}
try{if(allyPos[xaxis2-1][yaxis2+2]==piece) appendItem(possiblemoves,(convert(yaxis2+3))+(xaxis2));}catch(error){}
try{if(allyPos[xaxis2-1][yaxis2-2]==piece) appendItem(possiblemoves,(convert(yaxis2-1))+(xaxis2));}catch(error){}
try{if(allyPos[xaxis2+2][yaxis2+1]==piece) appendItem(possiblemoves,(convert(yaxis2+2))+(xaxis2+3));}catch(error){}
try{if(allyPos[xaxis2+2][yaxis2-1]==piece) appendItem(possiblemoves,(convert(yaxis2))+(xaxis2+3));}catch(error){}
try{if(allyPos[xaxis2-2][yaxis2+1]==piece) appendItem(possiblemoves,(convert(yaxis2+2))+(xaxis2-1));}catch(error){}
try{if(allyPos[xaxis2-2][yaxis2-1]==piece) appendItem(possiblemoves,(convert(yaxis2))+(xaxis2-1));}catch(error){}
if(possiblemoves.indexOf(origin)==-1) return "";
}
else if(piece == "P"){
var reverse = color == "Light" ? 1 : -1;
if(xaxis2-xaxis1==2*reverse){
if(yaxis1 != yaxis2 || !(xaxis1 == 3.5-2.5*reverse && xaxis2 == 3.5-0.5*reverse
&& allyPos[xaxis1+reverse][yaxis1] == ""
&& allyPos[xaxis1+2*reverse][yaxis1] == ""
&& enemyPos[xaxis1+reverse][yaxis1] == "" &&
enemyPos[xaxis1+2*reverse][yaxis1] == "")) return "";
epPotential = end;
}
else if(xaxis2-xaxis1==reverse){
if(yaxis1==yaxis2&&allyPos[xaxis2][yaxis1]=="" && enemyPos[xaxis2][yaxis1]=="");
else if((yaxis1+1==yaxis2||yaxis1-1==yaxis2)&&allyPos[xaxis2][yaxis2]==""){
if(enemyPos[xaxis2][yaxis2]!="") toReturn += origin.substring(0,1);
else if(board[xaxis1][yaxis2] == epPotential){toReturn += origin.substring(0,1); ep = true; returnTail += " e.p."}
else return "";
}
}
else return "";
if(xaxis2==3.5+3.5*reverse){
var x = getProperty(end,"x");
var y = getProperty(end,"y");
setProperty("blackout","hidden",false);
setProperty("promote","x",x);
setProperty("promote","y",y);
setProperty("promote","hidden",false);
if(bot) setProperty("promote","index",1);
else while(true){
setTimeout(function(){},500);
if(getProperty("promote","index")!=0) break;
}
if(getProperty("promote","index")==5){setProperty("promote","index",0); return "";}
var temp = convert(getText("promote"));
returnTail += "="+temp;
piece = temp;
setProperty("promote","index",0);
setProperty("blackout","hidden",true);
setProperty("promote","hidden",true);
}
if(ep){
(color == "Light" ? Darkentity : Lightentity)[xaxis1][yaxis2]="";
setProperty(moves[moves.length-1],"image","");
toReturn += "x";
}
}
else if(piece == "K"){
if(xaxis1==xaxis2&&(yaxis1+(yaxis1>yaxis2?-2:2)==yaxis2)&&(castleRight[color=="Light"?0:1])&&
allyPos[xaxis1][yaxis1+(yaxis1>yaxis2?-1:1)]==""&&allyPos[xaxis1][yaxis1+(yaxis1>yaxis2?-2:2)]==""&&
enemyPos[xaxis1][yaxis1+(yaxis1>yaxis2?-1:1)]==""&&enemyPos[xaxis1][yaxis1+(yaxis1>yaxis2?-2:2)]==""&&
castleRook[color=="Light"?0:1][yaxis1>yaxis2?0:1]&&allyPos[color=="Light"?0:7][yaxis1>yaxis2?0:7]=="R"&&
(yaxis1<yaxis2?true:(allyPos[xaxis1][1]==""&&enemyPos[xaxis1][1]==""))){
appendItem(moves,"");
var temp2 = getPieces();
for(var i = 0; i < temp2.length; i++){
var test = validmoves(temp2[i]);
if(test.indexOf(board[xaxis1][yaxis1+(yaxis1>yaxis2?-1:1)])!=-1) break;
}
removeItem(moves,moves.length-1);
if(i != temp2.length) return "";
(color=="Light"?Lightentity:Darkentity)[xaxis1][yaxis1+(yaxis1>yaxis2?-4:3)] = "";
(color=="Light"?Lightentity:Darkentity)[xaxis1][yaxis1+(yaxis1>yaxis2?-1:1)] = "R";
setProperty(board[xaxis1][yaxis1+(yaxis1>yaxis2?-4:3)],"image","");
setProperty(board[xaxis1][yaxis1+(yaxis1>yaxis2?-1:1)],"image",color+"Rook.jpg");
castle = "O-O"+(yaxis1>yaxis2?"-O":"");
}
else if(!((xaxis1+1==xaxis2||xaxis1==xaxis2||xaxis1-1==xaxis2) &&
(yaxis1+1==yaxis2||yaxis1==yaxis2||yaxis1-1==yaxis2))) return "";
else toReturn += "K";
kingPos[moves.length%2] = end;
castleRight[color=="Light"?0:1] = false;
}
else return "";
if(possiblemoves.length>1&&!(piece == "P" || piece == "K")){
for(i = possiblemoves.length-1; i >= 0; i--){
if(origin.substring(0,1)==possiblemoves[i].substring(0,1)) vnot++;
if(origin.substring(1,2)==possiblemoves[i].substring(1,2)) hnot++;
}
toReturn += (hnot>1?(vnot>1?origin:origin.substring(0,1)):(vnot>1?origin.substring(1,2):origin.substring(0,1)));
}
if(enemyPos[xaxis2][yaxis2]!=""){
toReturn += "x";
(color == "Light" ? Darkentity : Lightentity)[xaxis2][yaxis2] = "";
}
toReturn += end;
toReturn += returnTail;
toReturn = castle.length==0?toReturn:castle;
if(epPotential != end) epPotential = false;
(color == "Light" ? Lightentity : Darkentity)[xaxis2][yaxis2] = piece;
(color == "Light" ? Lightentity : Darkentity)[xaxis1][yaxis1] = "";
toReturn += check();
setProperty(end,"image",color+convert(piece)+".jpg");
setProperty(origin,"image","");
return toReturn;
}
function move(position){
var time = getTime();
if(square == ""){square = position; setProperty("currenttile","text",square); return;}
var k = validmoves(square);
if(k.indexOf(position)==-1) setText("currenttile","na");
else {
var i;
if(prediction.length>0) for(i = 0; i < prediction.length; i++) if(prediction[i].substring(0,2)==square && prediction[i].substring(2) == position) break;
if(prediction.length>0 && i == prediction.length) setText("currenttile","na");
else {
var che = false;
if(square==kingPos[moves.length%2]) che = domain().indexOf(position)==-1;
else {
var temp = (moves.length%2==0 ? Lightentity : Darkentity)[square.substring(1)-1][convert(square.substring(0,1))-1];
(moves.length%2==0 ? Lightentity : Darkentity)[position.substring(1)-1][convert(position.substring(0,1))-1] = temp;
(moves.length%2==0 ? Lightentity : Darkentity)[square.substring(1)-1][convert(square.substring(0,1))-1] = "";
appendItem(moves,"");
che = cheque(getPieces());
removeItem(moves,moves.length-1);
(moves.length%2==0 ? Lightentity : Darkentity)[position.substring(1)-1][convert(position.substring(0,1))-1] = "";
(moves.length%2==0 ? Lightentity : Darkentity)[square.substring(1)-1][convert(square.substring(0,1))-1] = temp;
}
if(che) setText("currenttile","na");
else {
prediction = [];
k = notation(square,position);
if(k.length==0) setText("currenttile","na");
else{
setText("currenttile","");
setText("moves",getText("moves")+(moves.length%2==0 ? "\n" + (moves.length/2+1)+"." : "") + " " + k);
appendItem(moves,k);
if(k.indexOf("#") != -1 || k.indexOf("$")!=-1) endGame(k.substring(k.length-1));
else if(!bot && getProperty("bot","background-color")=="rgb(0, 188, 0)") AL();
}
}
}
}
square = "";
console.log("Turn used " + (getTime()-time)/1000 + " seconds");
return;
}
function getPieces(){
var toReturn = [];
var temp = moves.length%2==0?Lightentity:Darkentity;
for(var i = 0; i < 8; i++){
for(var j = 0; j < 8; j++){
if(temp[i][j] != "") appendItem(toReturn, convert(j+1)+(i+1));
}
}
return toReturn;
}
function endGame(result){
setProperty("blackout","hidden",false);
setProperty("gameover","hidden",false);
setText("gameover", "Game set. Match ends in a " + (result == "#" ? "win for " + (moves.length%2 == 1 ? "white" : "black") : "draw") + ".");
setProperty("reset","hidden",false);
}
function newGame(){
for(var i = 0; i < 8; i++){
if(i >= 1 && i <= 6){
for(var j = 0; j < 8; j++) setProperty(board[i][j],"image", i == 1 ? "LightPawn.jpg" : i == 6 ? "DarkPawn.jpg" : "");
continue;
}
var img = "";
if(i==0) img+="Light";
else img += "Dark";
setProperty(board[i][0],"image",img+"Rook.jpg");
setProperty(board[i][7],"image",img+"Rook.jpg");
setProperty(board[i][1],"image",img+"Knight.jpg");
setProperty(board[i][6],"image",img+"Knight.jpg");
setProperty(board[i][2],"image",img+"Bishop.jpg");
setProperty(board[i][5],"image",img+"Bishop.jpg");
setProperty(board[i][3],"image",img+"Queen.jpg");
setProperty(board[i][4],"image",img+"King.jpg");
}
moves = [];
board =
[["a1","b1","c1","d1","e1","f1","g1","h1"],["a2","b2","c2","d2","e2","f2","g2","h2"],["a3","b3","c3","d3","e3","f3","g3","h3"],["a4","b4","c4","d4","e4","f4","g4","h4"],["a5","b5","c5","d5","e5","f5","g5","h5"],["a6","b6","c6","d6","e6","f6","g6","h6"],["a7","b7","c7","d7","e7","f7","g7","h7"],["a8","b8","c8","d8","e8","f8","g8","h8"]];
Lightentity =
[["R","N","B","Q","K","B","N","R"],["P","P","P","P","P","P","P","P"],["","","","","","","",""],["","","","","","","",""],["","","","","","","",""],["","","","","","","",""],["","","","","","","",""],["","","","","","","",""]];
Darkentity =
[["","","","","","","",""],["","","","","","","",""],["","","","","","","",""],["","","","","","","",""],["","","","","","","",""],["","","","","","","",""],["P","P","P","P","P","P","P","P"],["R","N","B","Q","K","B","N","R"]];
castleRook = [[true,true],[true,true]];
castleRight = [true,true];
bypass = false;
kingPos = ["e1","e8"];
square = "";
epPotential = "";
bot = false;
prediction = [];
permeate = false;
square = "";
setProperty("blackout","hidden",true);
setProperty("reset","hidden",true);
setProperty("gameover","hidden",true);
setProperty("currenttile","text","");
setProperty("moves","text","");
}
function convert(pass){
switch(pass){
case 1: return "a";
case 2: return "b";
case 3: return "c";
case 4: return "d";
case 5: return "e";
case 6: return "f";
case 7: return "g";
case 8: return "h";
case "a": return 1;
case "b": return 2;
case "c": return 3;
case "d": return 4;
case "e": return 5;
case "f": return 6;
case "g": return 7;
case "h": return 8;
case "Q": return "Queen";
case "R": return "Rook";
case "N": return "Knight";
case "B": return "Bishop";
case "K": return "King";
case "Queen": return "Q";
case "Rook": return "R";
case "Knight": return "N";
case "Bishop": return "B";
case "King" : return "K";
default: return "Pawn";
}
}
function cheque(opp){
for(var i = 0; i < opp.length; i++) if(validmoves(opp[i]).indexOf(kingPos[(moves.length+1)%2])!=-1) break;
return i != opp.length;
}
function available(attackSide){
prediction = [];
var attacking = [];
for(var i = 0; i < attackSide.length; i++)
if(validmoves(attackSide[i]).indexOf(kingPos[(moves.length+1)%2])!=-1)
appendItem(attacking,attackSide[i]);
appendItem(moves,"");
var defending = getPieces();
var attackLines = [];
for(i = 0; i < attacking.length; i++) appendItem(attackLines,[]);
var temp = domain();
for(i = 0; i < temp.length; i++) appendItem(prediction,kingPos[moves.length%2]+temp[i]);
for(var z = 0; z < defending.length; z++){
if(defending[z]==kingPos[moves.length%2]) continue;
for(i = 0; i < attacking.length; i++){
appendItem(moves,"");
var path = checkpath(attacking[i],kingPos[(moves.length+1)%2]);
removeItem(moves,moves.length-1);
appendItem(path,attacking[i]);
for(var j = 0; j < path.length; j++){
var mvts = validmoves(defending[z]);
if(mvts.indexOf(path[j])!=-1){
appendItem(attackLines[i],defending[z]+mvts[mvts.indexOf(path[j])]);
}
}
}
}
var comparison = attackLines[0];
if(attackLines.length>1) for(i = 1; i < attackLines.length; i++){
for(var j = 0; j < comparison.length; j++){
if(attackLines[i].indexOf(comparison[j])==-1){removeItem(comparison,j); j--;}
}
}
removeItem(moves,moves.length-1);
for(i = 0; i < comparison.length; i++) appendItem(prediction, comparison[i]);
}
onEvent("reset","click",function(){newGame();});
onEvent("bot","click",function(){
getProperty("bot","background-color")=="rgb(255, 0, 0)" ?
setProperty("bot","background-color","#00bc00") : setProperty("bot","background-color","#FF0000");
if(getProperty("bot","background-color")=="rgb(0, 188, 0)") AL();
});
onEvent("board","click",function(){if(square!="") move((convert(Math.floor(arguments[0].pageX/40)+1))+(8-Math.floor(arguments[0].pageY/40)));});
onEvent("a1","click",function(){move(arguments[0].targetId);});
onEvent("a2","click",function(){move(arguments[0].targetId);});
onEvent("a3","click",function(){move(arguments[0].targetId);});
onEvent("a4","click",function(){move(arguments[0].targetId);});
onEvent("a5","click",function(){move(arguments[0].targetId);});
onEvent("a6","click",function(){move(arguments[0].targetId);});
onEvent("a7","click",function(){move(arguments[0].targetId);});
onEvent("a8","click",function(){move(arguments[0].targetId);});
onEvent("b1","click",function(){move(arguments[0].targetId);});
onEvent("b2","click",function(){move(arguments[0].targetId);});
onEvent("b3","click",function(){move(arguments[0].targetId);});
onEvent("b4","click",function(){move(arguments[0].targetId);});
onEvent("b5","click",function(){move(arguments[0].targetId);});
onEvent("b6","click",function(){move(arguments[0].targetId);});
onEvent("b7","click",function(){move(arguments[0].targetId);});
onEvent("b8","click",function(){move(arguments[0].targetId);});
onEvent("c1","click",function(){move(arguments[0].targetId);});
onEvent("c2","click",function(){move(arguments[0].targetId);});
onEvent("c3","click",function(){move(arguments[0].targetId);});
onEvent("c4","click",function(){move(arguments[0].targetId);});
onEvent("c5","click",function(){move(arguments[0].targetId);});
onEvent("c6","click",function(){move(arguments[0].targetId);});
onEvent("c7","click",function(){move(arguments[0].targetId);});
onEvent("c8","click",function(){move(arguments[0].targetId);});
onEvent("d1","click",function(){move(arguments[0].targetId);});
onEvent("d2","click",function(){move(arguments[0].targetId);});
onEvent("d3","click",function(){move(arguments[0].targetId);});
onEvent("d4","click",function(){move(arguments[0].targetId);});
onEvent("d5","click",function(){move(arguments[0].targetId);});
onEvent("d6","click",function(){move(arguments[0].targetId);});
onEvent("d7","click",function(){move(arguments[0].targetId);});
onEvent("d8","click",function(){move(arguments[0].targetId);});
onEvent("e1","click",function(){move(arguments[0].targetId);});
onEvent("e2","click",function(){move(arguments[0].targetId);});
onEvent("e3","click",function(){move(arguments[0].targetId);});
onEvent("e4","click",function(){move(arguments[0].targetId);});
onEvent("e5","click",function(){move(arguments[0].targetId);});
onEvent("e6","click",function(){move(arguments[0].targetId);});
onEvent("e7","click",function(){move(arguments[0].targetId);});
onEvent("e8","click",function(){move(arguments[0].targetId);});
onEvent("f1","click",function(){move(arguments[0].targetId);});
onEvent("f2","click",function(){move(arguments[0].targetId);});
onEvent("f3","click",function(){move(arguments[0].targetId);});
onEvent("f4","click",function(){move(arguments[0].targetId);});
onEvent("f5","click",function(){move(arguments[0].targetId);});
onEvent("f6","click",function(){move(arguments[0].targetId);});
onEvent("f7","click",function(){move(arguments[0].targetId);});
onEvent("f8","click",function(){move(arguments[0].targetId);});
onEvent("g1","click",function(){move(arguments[0].targetId);});
onEvent("g2","click",function(){move(arguments[0].targetId);});
onEvent("g3","click",function(){move(arguments[0].targetId);});
onEvent("g4","click",function(){move(arguments[0].targetId);});
onEvent("g5","click",function(){move(arguments[0].targetId);});
onEvent("g6","click",function(){move(arguments[0].targetId);});
onEvent("g7","click",function(){move(arguments[0].targetId);});
onEvent("g8","click",function(){move(arguments[0].targetId);});
onEvent("h1","click",function(){move(arguments[0].targetId);});
onEvent("h2","click",function(){move(arguments[0].targetId);});
onEvent("h3","click",function(){move(arguments[0].targetId);});
onEvent("h4","click",function(){move(arguments[0].targetId);});
onEvent("h5","click",function(){move(arguments[0].targetId);});
onEvent("h6","click",function(){move(arguments[0].targetId);});
onEvent("h7","click",function(){move(arguments[0].targetId);});
onEvent("h8","click",function(){move(arguments[0].targetId);});
