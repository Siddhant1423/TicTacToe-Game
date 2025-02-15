const gameboard = () => {
    const rows = 3;
    const columns = 3;
    const board = [];
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
          board[i].push(Cell());
        }
      }
    const getboard = ()  => board;
    const printBoard = () => {
        const boardAndValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.table(boardAndValues)
    }
    const dropToken = (row,column,player) => {
        return board[row][column].addToken(player)
    }
    const checkWinner = () => {
        const winConditions = [
            // rows
            [[0,0],[0,1],[0,2]],
            [[1,0],[1,1],[1,2]],
            [[2,0],[2,1],[2,2]],
            // columns
            [[0,0],[1,0],[2,0]],
            [[0,1],[1,1],[2,1]],
            [[0,2],[1,2],[2,2]],
            // diagonals
            [[0,0],[1,1],[2,2]],
            [[0,2],[1,1],[2,0]]
        ]
        for(let condition of winConditions){
            const [a,b,c] = condition;
            const cellA = board[a[0]][a[1]].getValue();
            const cellB = board[b[0]][b[1]].getValue();
            const cellC = board[c[0]][c[1]].getValue();
            if(cellA && cellA === cellB && cellA === cellC) return cellA;
        }
        let isDraw = true;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
              const square = board[i][j]
              if(square.getValue() === null){
                isDraw = false;
                break;
              }
            }
          }
        if(isDraw) return "draw";
        return null;
    }

    return {getboard,printBoard,dropToken,checkWinner};
}

const Cell = () => {
    let value = null;
    const addToken = (player) => {
        if(value === null){
            value = player;
            return true;
        }
        return false;
    }
    const getValue = () => value;
    return{addToken,getValue}
}

const GameController = (playerOne,playerTwo) => {
    const firstPlayer = document.querySelector("#first-player-name");
    const secondPlayer = document.querySelector("#second-player-name");
    const result = document.querySelector(".result");

    playerOne = firstPlayer.value;
    playerTwo = secondPlayer.value;

    const board = gameboard();
    const players = [
        {name:playerOne, token:"O"},
        {name:playerTwo, token:"X"}
    ]
    let activePlayer = players[0];
    const switchPlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0]
    }
    const getActivePlayer = () => activePlayer;

    let isGameOver = false;
    const playRound = (row , column) => {
        if (isGameOver){
            console.log("Game Over !!!");
            return;
        }
        if (board.dropToken(row,column,getActivePlayer().token)){
            board.printBoard();
        
            const check = board.checkWinner();
            if(check){
                isGameOver = true;
                if (check === "draw"){
                    console.log("Its draw.")
                    result.textContent = "It's Draw";
                }else{
                    console.log(`${getActivePlayer().name} wins !!!`);
                    result.textContent = `${getActivePlayer().name} Wins !!!`;
                }
                return;
            }

            switchPlayer();
            console.log(`Its ${getActivePlayer().name} turn`)
        }
        else {
            console.log("Its already occupied cell! Try again.")
        }


    }
    console.log(`Game Started ! Its ${getActivePlayer().name}'s first turn`)
    board.printBoard();

    return{playRound,getActivePlayer,getboard:board.getboard}
}

const screenController = () => {
    const game = GameController();
    
    const boardDiv = document.querySelector(".board");
    const turnDiv = document.querySelector(".turn-display")
    const updateScreen = () => {
        const activePlayer = game.getActivePlayer();
        boardDiv.textContent = "";
        turnDiv.textContent = `${activePlayer.name}'s turn (${activePlayer.token})`;
        
        const board = game.getboard();

        board.forEach((r,rowIndex )=> {
            r.forEach((cell,colIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = colIndex;
                cellButton.textContent = cell.getValue();
                boardDiv.appendChild(cellButton)
            })
        })
        
    }
    function eventHandler(e){
        const selectedRow = Number(e.target.dataset.row);
        const selectedColumn = Number(e.target.dataset.column);
        console.log(selectedRow,selectedColumn)
        if (isNaN(selectedRow) || isNaN(selectedColumn)) return;
        game.playRound(selectedRow,selectedColumn);
        updateScreen();
    }
    boardDiv.addEventListener('click',eventHandler)
    updateScreen();
}


const dialog = document.querySelector("dialog");
const newGamebtn = document.querySelector("#new-game");
const closebtn = document.querySelector("#close-btn");
const submitbtn = document.querySelector("#submit-btn")
const form = document.querySelector("dialog form");

newGamebtn.addEventListener('click',()=>{
    dialog.showModal();
    document.querySelector("#first-player-name").value = "";
    document.querySelector("#second-player-name").value = "";
    
});
closebtn.addEventListener('click',()=>{
    dialog.close();
})

form.addEventListener('submit',(event)=>{
    event.preventDefault();
    screenController();
    dialog.close();
    document.querySelector(".result").textContent = "";
    document.querySelector(".turn-display").textContent = "";
})

const threeRounds = () => {
    let playerOneCount = 0;
    let playerTwoCount = 0;

}