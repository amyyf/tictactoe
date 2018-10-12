patterns1= [[(/ OO....../),0],[(/O..O.. ../),6], [(/......OO /),8],[(/.. ..O..O/),2], [(/ ..O..O../),0],[(/...... OO/),6], [(/..O..O.. /),8],[(/OO ....../),2], [(/ ...O...O/),0],[(/..O.O. ../),6], [(/O...O... /),8],[(/.. .O.O../),2], [(/O O....../),1],[(/O.. ..O../),3], [(/......O O/),7],[(/..O.. ..O/),5], [(/. ..O..O./),1],[(/... OO.../),3], [(/.O..O.. ./),7],[(/...OO .../),5]]
patterns2= [[(/  X . X  /),1],[(/ XX....../),0],[(/X..X.. ../),6], [(/......XX /),8],[(/.. ..X..X/),2],[(/ ..X..X../),0], [(/...... XX/),6],[(/..X..X.. /),8],[(/XX ....../),2], [(/ ...X...X/),0],[(/..X.X. ../),6],[(/X...X... /),8], [(/.. .X.X../),2],[(/X X....../),1],[(/X.. ..X../),3], [(/......X X/),7],[(/..X.. ..X/),5],[(/. ..X..X./),1], [(/... XX.../),3],[(/.X..X.. ./),7],[(/...XX .../),5], [(/ X X.. ../),0],[(/ ..X.. X /),6],[(/.. ..X X /),8], [(/ X ..X.. /),2],[(/  XX.. ../),0],[(/X.. .. X /),6], [(/.. .XX   /),8],[(/X  ..X.. /),2],[(/ X  ..X../),0], [(/ ..X..  X/),6],[(/..X..  X /),8],[(/X  ..X.. /),2]]
patterns3= [[(/OOO....../),'O'], [(/...OOO.../),'O'], [(/......OOO/),'O'], [(/O..O..O../),'O'], [(/.O..O..O./),'O'], [(/..O..O..O/),'O'], [(/O...O...O/),'O'], [(/..O.O.O../),'O'], [(/XXX....../),'X'], [(/...XXX.../),'X'], [(/......XXX/),'X'], [(/X..X..X../),'X'], [(/.X..X..X./),'X'], [(/..X..X..X/),'X'], [(/X...X...X/),'X'], [(/..X.X.X../),'X']]
board= [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];X= 'X';O= 'O';players= [X, O];currTurn= X

comp= function(){
  x= getPattern1Move()
    if(x==-1){
      x= getPattern2Move()
        if(x==-1){x= getMove()}
    }
  move(x,O)
}
move= function(pos,x){
  if(x!=currTurn){return false}
  if(+pos>=0&&+pos<=8&&!isNaN(+pos)&&board[+pos]==' '){
    board.splice(+pos,1,x)
      currTurn= (x==X)? O: X
      return true
  }
  return false
}
boardDisplay= function(){return ' '+board[0]+' |'+' '+board[1]+' |'+' '+board[2]+'\n===+===+===\n'+' '+board[3]+' |'+' '+board[4]+' |'+' '+board[5]+'\n===+===+===\n'+' '+board[6]+' |'+' '+board[7]+' |'+' '+board[8]}
show= function(){console.log(boardDisplay())}
boardFilled= function(){
  x = getMove()
    if(x==-1){
      show()
        console.log('Game over')
        return true
    }
  return false
}
winner= function(){
  boardString= board.join('')
    theWinner= null
    for(i=0;i<patterns3.length;i++){
      array= boardString.match(patterns3[i][0])
        if(array){theWinner= patterns3[i][1]}
    }
  if(theWinner){
    show()
      console.log('Game over')
      return true
  }
  return false
}
getPattern1Move= function(){
  boardString= board.join('')
    for(i=0;i<patterns1.length;i++){
      array= boardString.match(patterns1[i][0])
        if(array){return patterns1[i][1]}
    }
  return -1
}
getPattern2Move= function(){
  boardString= board.join('')
    for(i=0;i<patterns2.length;i++){
      array= boardString.match(patterns2[i][0])
        if(array){return patterns2[i][1]}
    }
  return -1
}
getMove= function(){
  if(board[4] == ' '){return 4}
  return board.indexOf(' ')
}
exit= function(){process.exit()}
play= function(){
  show()
    console.log("Enter [0-8]:")
    process.openStdin().on('data',function(res){
      if(move(res, X)){
        if(winner()||boardFilled()) {exit()} else {
          comp()
      if (winner()||boardFilled()) {exit()} else {show()}
        }
      }
    })
}

play()
