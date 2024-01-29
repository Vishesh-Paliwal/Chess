const gameBoard = document.querySelector("#gameboard")
const playerDisplay = document.querySelector("#player")
const infoDisplay = document.querySelector("#info-display")
const width = 8
let playerGo = 'blackF'
playerDisplay.textContent = "black's turn"

 const startPeices = [
    rook , knight , bishop , queen , king , bishop , knight , rook,
    pawn , pawn , pawn , pawn , pawn , pawn , pawn , pawn ,
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    pawn , pawn , pawn , pawn , pawn , pawn , pawn , pawn ,
    rook , knight , bishop , queen , king , bishop , knight , rook,
 ]

 function createBoard() {
    startPeices.forEach((startPeice, i) =>{
        const square = document.createElement('div')
        square.classList.add('square')
        square.innerHTML = startPeice
        square.firstChild?.setAttribute('draggable',true)

        square.setAttribute('square-id',i)
        const row = Math.floor((63-i)/8)+1
        if(row%2==0){
            square.classList.add(i%2==0 ? "black" : "white")
        }
        else{
            square.classList.add(i%2==0 ? "white" : "black")
        }

        if(i<=15){
            square.firstChild.firstChild.classList.add('blackF');
        }

        if(i>=48){
            square.firstChild.firstChild.classList.add('whiteF');
        }
        gameBoard.append(square)
    })
 }

 createBoard() 




const allSquares = document.querySelectorAll("#gameboard .square")
allSquares.forEach(square => {
    square.addEventListener('dragstart', dragStart)
    square.addEventListener('dragover', dragOver)
    square.addEventListener('drop', dragDrop)
})

let startPositionId 
let dragElement

function dragStart(e){
   startPositionId = e.target.parentNode.getAttribute('square-id')
   dragElement = e.target;
}

function dragOver(e){
    e.preventDefault()
}

function dragDrop(e){
    e.stopPropagation()
    // console.log(e.target)
    // console.log(dragElement);
    const correctGo = dragElement.firstChild.classList?.contains(playerGo)
    const taken = e.target.classList.contains('peice')
    const valid = checkIfValid(e.target)
    console.log(valid)
    const opponentGo = playerGo ==='whiteF' ? 'blackF' : 'whiteF'
    const takenByopponent = e.target.parentNode?.classList?.contains(opponentGo)
    // console.log(takenByopponent)
    // console.log(correctGo);
    if(correctGo){
        if(takenByopponent && valid){
            // console.log(e.target)
            console.log(dragElement)
            e.target.parentNode.parentNode.parentNode.append(dragElement)
            e.target.parentNode.parentNode.remove()
            playAudio();
            checkForWin();
            changePlayer()
            return
        }
    // }

    if(taken && !takenByopponent){
        return
    }

    if(!valid){
        changePlayer();
        changePlayer();
        return;
    }

    if(valid){
        e.target.append(dragElement)
        document.getElementById("move").play()
        checkForWin();
        changePlayer()
        return;
    }
    changePlayer()
}
}

function changePlayer(){
    if(playerGo==='blackF'){
        reverseIds();
        playerGo = "whiteF"
        playerDisplay.textContent = "white's turn"
    }
    else{
        revertIds();
        playerGo = "blackF"
        playerDisplay.textContent = "black's turn"
    }
    // gameBoard.style.rotate = "90deg";
}

function reverseIds(){
    const allSquares = document.querySelectorAll(".square")
    allSquares.forEach((square , i) => 
    square.setAttribute('square-id', (width*width-1)-i))
}

function revertIds(){
    const allSquares = document.querySelectorAll(".square")
    allSquares.forEach((square , i) => 
    square.setAttribute('square-id', i))
}

function checkIfValid(target){
    // console.log(target);
    const opponentGo = playerGo ==='whiteF' ? 'blackF' : 'whiteF'
    // console.log(opponentGo)
    const targetId = Number(target.getAttribute('square-id'))
    || Number(target.parentNode.parentNode.parentNode.getAttribute('square-id'))
    const startId = Number(startPositionId)
    const peice = dragElement.id
    // console.log(`startId is ${startId}`)
            //  console.log(`targetId is ${targetId}` )
    switch(peice){
        case 'pawn' : 
            const starterRow  = [8,9,10,11,12,13,14,15]
            if((starterRow.includes(startId) && (startId+width*2===targetId) && !target.parentNode.classList.contains(opponentGo))
            || startId+width===targetId && !target.parentNode.classList.contains(opponentGo)
            || (startId+width-1===targetId && target.parentNode.classList.contains(opponentGo))
            || (startId+width+1===targetId && target.parentNode.classList.contains(opponentGo)) 
            )
             {
             return true}
             break;

        case 'knight':
            if(
                startId+(width*2)+1 == targetId
                || startId+(width*2)-1 == targetId
                || startId+width-2 == targetId
                || startId+width+2 == targetId
                ||  startId-(width*2)+1 == targetId
                || startId-(width*2)-1 == targetId
                || startId-width-2 == targetId
                || startId-width+2 == targetId
            ) {
                return true;
            }
            break;

        case 'bishop':
            if((startId+width+1 == targetId) ||
            (startId+width*2 + 2 == targetId && checkPath(startId ,2)) ||
            (startId+width*3 + 3 == targetId && checkPath(startId ,3)) ||
            (startId+width*4 + 4 == targetId && checkPath(startId ,4)) ||
            (startId+width*5 + 5 == targetId && checkPath(startId ,5)) ||
            (startId+width*6 + 6 == targetId && checkPath(startId ,6)) ||
            (startId+width*7 + 7 == targetId && checkPath(startId ,7)) ||
            (startId-width-1 == targetId) ||
            (startId-width*2 - 2 == targetId && checkPathB(startId,2)) ||
            (startId-width*3 - 3 == targetId && checkPathB(startId,3)) ||
            (startId-width*4 - 4 == targetId && checkPathB(startId,4)) ||
            (startId-width*5 - 5 == targetId && checkPathB(startId,5)) ||
            (startId-width*6 - 6 == targetId && checkPathB(startId,6)) ||
            (startId-width*7 - 7 == targetId && checkPathB(startId,7)) ||
            (startId-width+1 == targetId) ||
            (startId-width*2 + 2 == targetId && checkPathBR(startId,2)) ||
            (startId-width*3 + 3 == targetId && checkPathBR(startId,3)) ||
            (startId-width*4 + 4 == targetId && checkPathBR(startId,4)) ||
            (startId-width*5 + 5 == targetId && checkPathBR(startId,5)) ||
            (startId-width*6 + 6 == targetId && checkPathBR(startId,6)) ||
            (startId-width*7 + 7 == targetId && checkPathBR(startId,7)) ||
            (startId+width-1 == targetId) ||
            (startId+width*2 - 2 == targetId && checkPathL(startId,2)) ||
            (startId+width*3 - 3 == targetId && checkPathL(startId,3)) ||
            (startId+width*4 - 4 == targetId && checkPathL(startId,4)) ||
            (startId+width*5 - 5 == targetId && checkPathL(startId,5)) ||
            (startId+width*6 - 6 == targetId && checkPathL(startId,6)) ||
            (startId+width*7 - 7 == targetId && checkPathL(startId,7)) 
            )
           {
           return true;
           }
           break;

        case 'rook':
            // console.log(startId/8)
            // console.log(targetId/8)
            if((startId+width == targetId) ||
            (startId+width*2 == targetId && checkPathRU(startId,2)) ||
            (startId+width*3 == targetId && checkPathRU(startId,3)) ||
            (startId+width*4 == targetId && checkPathRU(startId,4)) ||
            (startId+width*5 == targetId && checkPathRU(startId,5)) ||
            (startId+width*6 == targetId && checkPathRU(startId,6)) ||
            (startId+width*7 == targetId && checkPathRU(startId,7)) ||
            (startId-width == targetId) ||
            (startId-width*2 == targetId && checkPathRL(startId,2)) ||
            (startId-width*3 == targetId && checkPathRL(startId,3)) ||
            (startId-width*4 == targetId && checkPathRL(startId,4)) ||
            (startId-width*5 == targetId && checkPathRL(startId,5)) ||
            (startId-width*6 == targetId && checkPathRL(startId,6)) ||
            (startId-width*7 == targetId && checkPathRL(startId,7)) ||
            (Math.floor(startId/8)==Math.floor(targetId/8) && checkPathSLR(startId, targetId-startId))
            ){
                return true;
            }
            break;

        case 'king':
            if(startId+1 == targetId && !target.parentNode.classList.contains(playerGo)
            || (startId-1 == targetId && !target.parentNode.classList.contains(playerGo))
            || (startId+width == targetId && !target.parentNode.classList.contains(playerGo))
            || (startId-width == targetId && !target.parentNode.classList.contains(playerGo))
            || (startId-width-1 == targetId && !target.parentNode.classList.contains(playerGo))
            || (startId-width+1 == targetId && !target.parentNode.classList.contains(playerGo))
            || (startId+width-1 == targetId && !target.parentNode.classList.contains(playerGo))
            || (startId+width+1 == targetId && !target.parentNode.classList.contains(playerGo))
            ){
            return true;
            }
            break;

        case 'queen':
            if(
                (checkPathUD(startId, Math.floor(targetId/8)-Math.floor(startId/8))) ||
                (Math.floor(startId/8)==Math.floor(targetId/8) && checkPathSLR(startId, targetId-startId)) ||
                (startId+width+1 == targetId) ||
            (startId+width*2 + 2 == targetId && checkPath(startId ,2)) ||
            (startId+width*3 + 3 == targetId && checkPath(startId ,3)) ||
            (startId+width*4 + 4 == targetId && checkPath(startId ,4)) ||
            (startId+width*5 + 5 == targetId && checkPath(startId ,5)) ||
            (startId+width*6 + 6 == targetId && checkPath(startId ,6)) ||
            (startId+width*7 + 7 == targetId && checkPath(startId ,7)) ||
            (startId-width-1 == targetId) ||
            (startId-width*2 - 2 == targetId && checkPathB(startId,2)) ||
            (startId-width*3 - 3 == targetId && checkPathB(startId,3)) ||
            (startId-width*4 - 4 == targetId && checkPathB(startId,4)) ||
            (startId-width*5 - 5 == targetId && checkPathB(startId,5)) ||
            (startId-width*6 - 6 == targetId && checkPathB(startId,6)) ||
            (startId-width*7 - 7 == targetId && checkPathB(startId,7)) ||
            (startId-width+1 == targetId) ||
            (startId-width*2 + 2 == targetId && checkPathBR(startId,2)) ||
            (startId-width*3 + 3 == targetId && checkPathBR(startId,3)) ||
            (startId-width*4 + 4 == targetId && checkPathBR(startId,4)) ||
            (startId-width*5 + 5 == targetId && checkPathBR(startId,5)) ||
            (startId-width*6 + 6 == targetId && checkPathBR(startId,6)) ||
            (startId-width*7 + 7 == targetId && checkPathBR(startId,7)) ||
            (startId+width-1 == targetId) ||
            (startId+width*2 - 2 == targetId && checkPathL(startId,2)) ||
            (startId+width*3 - 3 == targetId && checkPathL(startId,3)) ||
            (startId+width*4 - 4 == targetId && checkPathL(startId,4)) ||
            (startId+width*5 - 5 == targetId && checkPathL(startId,5)) ||
            (startId+width*6 - 6 == targetId && checkPathL(startId,6)) ||
            (startId+width*7 - 7 == targetId && checkPathL(startId,7)) 
            ){
                return true;
            }
            break;

    }
}

function checkPath(startId , i){
    const opponentGo = playerGo ==='whiteF' ? 'blackF' : 'whiteF'
    let a = document.querySelectorAll('.square')
    for(let j = 1; j<i ; j++){
        if(a[startId+ (width*j )+ j].firstChild){
            if(a[startId+ (width*j )+ j].firstChild.firstChild.classList.contains(opponentGo) || a[startId+ (width*j )+ j].firstChild.firstChild.classList.contains(playerGo) ){
                return false;
            }
        }
    }
    return true;
}

function checkPathB(startId,i){
    const opponentGo = playerGo ==='whiteF' ? 'blackF' : 'whiteF'
    let a = document.querySelectorAll('.square')
    for(let j = 1; j<i ; j++){
        if(a[startId- (width*j )- j].firstChild){
            if(a[startId- (width*j )- j].firstChild.firstChild.classList.contains(opponentGo) || a[startId- (width*j )- j].firstChild.firstChild.classList.contains(playerGo) ){
                return false;
            }
        }
    }
    return true;
}

function checkPathBR(startId,i){
    const opponentGo = playerGo ==='whiteF' ? 'blackF' : 'whiteF'
    let a = document.querySelectorAll('.square')
    for(let j = 1; j<i ; j++){
        if(a[startId- (width*j )+ j].firstChild){
            if(a[startId- (width*j )+ j].firstChild.firstChild.classList.contains(opponentGo) || a[startId- (width*j )+ j].firstChild.firstChild.classList.contains(playerGo) ){
                return false;
            }
        }
    }
    return true;
}

function checkPathL(startId,i){
    const opponentGo = playerGo ==='whiteF' ? 'blackF' : 'whiteF'
    let a = document.querySelectorAll('.square')
    for(let j = 1; j<i ; j++){
        if(a[startId+ (width*j )- j].firstChild){
            if(a[startId+ (width*j )- j].firstChild.firstChild.classList.contains(opponentGo) || a[startId+ (width*j )- j].firstChild.firstChild.classList.contains(playerGo) ){
                return false;
            }
        }
    }
    return true;
}

function checkPathRU(startId,i){
    const opponentGo = playerGo ==='whiteF' ? 'blackF' : 'whiteF'
    let a = document.querySelectorAll('.square')
    for(let j = 1; j<i ; j++){
        if(a[startId+width*j].firstChild){
            if(a[startId+width*j].firstChild.firstChild.classList.contains(opponentGo) || a[startId+width*j].firstChild.firstChild.classList.contains(playerGo)){
                return false
            }
        }
    }
    return true;
}

function checkPathRL(startId,i){
    const opponentGo = playerGo ==='whiteF' ? 'blackF' : 'whiteF'
    let a = document.querySelectorAll('.square')
    for(let j = 1; j<i ; j++){
        if(a[startId-width*j].firstChild){
            if(a[startId-width*j].firstChild.firstChild.classList.contains(opponentGo) || a[startId-width*j].firstChild.firstChild.classList.contains(playerGo)){
                return false
            }
        }
    }
    return true;
}

function checkPathSLR(startId, diff){
    const opponentGo = playerGo ==='whiteF' ? 'blackF' : 'whiteF'
    let a = document.querySelectorAll('.square')
    if(diff>1){
        for(let i = 1; i<diff ; i++){
            if(a[startId+i].firstChild){
                if(a[startId+i].firstChild.firstChild.classList.contains(opponentGo) || a[startId+i].firstChild.firstChild.classList.contains(playerGo)){
                    console.log(a[startId+i].firstChild.firstChild);
                    return false;
                }
            }
        }
    }
    if(diff<1){
        for(let i = 1; i<-1*diff ; i++){
            if(a[startId-i].firstChild){
                if(a[startId-i].firstChild.firstChild.classList.contains(opponentGo) || a[startId-i].firstChild.firstChild.classList.contains(playerGo)){
                    console.log(a[startId-i].firstChild.firstChild)
                    return false;
                }
            }
        }
    }
    return true;
}

function checkPathUD(startId, diff){
    const opponentGo = playerGo ==='whiteF' ? 'blackF' : 'whiteF'
    let a = document.querySelectorAll('.square')
    if(diff>1){
        for(let i = 1; i<diff ; i++){
            if(a[startId+width*i].firstChild){
                if(a[startId+width*i].firstChild.firstChild.classList.contains(opponentGo) || a[startId+width*i].firstChild.firstChild.classList.contains(playerGo)){
                    // console.log(a[startId+i].firstChild.firstChild);
                    return false;
                }
            }
        }
    }
    if(diff<1){
        for(let i = 1; i<-1*diff ; i++){
            if(a[startId-width*i].firstChild){
                if(a[startId-width*i].firstChild.firstChild.classList.contains(opponentGo) || a[startId-width*i].firstChild.firstChild.classList.contains(playerGo)){
                    // console.log(a[startId-i].firstChild.firstChild)
                    return false;
                }
            }
        }
    }
    return true;
}

function checkForWin(){
    const kings = Array.from(document.querySelectorAll("#king"))
    console.log(kings.length);
    if(kings.length==1 && kings[0].firstChild.classList.contains("blackF")){
        infoDisplay.innerHTML = "Black Player wins !!!"
        infoDisplay.style.display = "flex";
        document.getElementById("checkmate").play();
        setTimeout(function(){
            location.reload(); 
        },7000)
    }
    if(kings.length==1 && kings[0].firstChild.classList.contains("whiteF")){
        infoDisplay.innerHTML = "White Player wins !!!"
        infoDisplay.style.display = "flex";
        document.getElementById("checkmate").play();
        setTimeout(function(){
            location.reload(); 
        },7000)
    }
}

let soundtoPlay = document.getElementById("capture"); 
console.log(soundtoPlay)
function playAudio(){
    soundtoPlay.play();
}

