window.addEventListener('DOMContentLoaded', function(){
    const tiles = Array.from(document.querySelectorAll('.tile'));
    const playerDisplay = document.querySelector('.display-player');
    const resetButton = document.querySelector('#reset');
    const announcer = document.querySelector('.announcer');
    const container = document.querySelector('.container');
    const turnLine = document.querySelector('.display');
    const multi_mode = document.querySelector('#multi-mode');
    const single_mode = document.querySelector('#single-mode');

    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let isGameActive = false;
    let mode;

    const PLAYERX_WON = 'PLAYERX_WON';
    const PLAYERO_WON = 'PLAYERO_WON';
    const TIE = 'TIE';

    /* will use this ^^ to announce winning game state */

    const WinningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    function checkWinner (player) { // player is bool, true is 'O', false is 'X'
        let roundWon = false;
        for (let i = 0; i <= 7; i++) {
            const winCondition = WinningConditions[i];
            const a = board[winCondition[0]];
            const b = board[winCondition[1]];
            const c = board[winCondition[2]];
            if ( a === '' || b === '' || c === '') {
                continue;
            }
            if ( a===b && b===c ) {
                roundWon = true;
                break;
            }
        }
        
        if(roundWon) {
            if(player) {
                return 1;
            } else {
                return -1;
            }
        }

        if(!board.includes('')) {
            return 0;
        }

        return null;
    }

    function handleResultValidation () {
        let roundWon = false;
        for (let i = 0; i <= 7; i++) {
            const winCondition = WinningConditions[i];
            const a = board[winCondition[0]];
            const b = board[winCondition[1]];
            const c = board[winCondition[2]];
            if ( a === '' || b === '' || c === '') {
                continue;
            }
            if ( a===b && b===c ) {
                roundWon = true;
                break;
            }
        }
        
        if(roundWon) {
            announce( (currentPlayer === 'X'? PLAYERX_WON: PLAYERO_WON));
            isGameActive = false;
            return;
        }

        if(!board.includes('')) {
            announce(TIE);
            isGameActive = false;
        }
    }

    function announce(type) {
        switch (type) {
            case PLAYERO_WON:
                announcer.innerHTML = 'Player <span class="playerO">O</span> Won';
                console.log(currentPlayer);//
                break;
            case PLAYERX_WON:
                announcer.innerHTML = 'Player <span class="playerX">X</span> Won';
                console.log(currentPlayer);//
                break;
            case TIE:
                announcer.innerText = 'Tie';
        }   
        announcer.classList.remove('hide');
    }

    function isValid(tile) {
        if ( tile.innerText === 'X' || tile.innerText === 'O') {
            return false;
        }
        return true;
    }

    function updateBoard(index) {
        board[index] = currentPlayer;
    }

   
    function changePlayer() {
        playerDisplay.classList.remove(`player${currentPlayer}`); /* carefully see how its ` not ' */
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        playerDisplay.innerText = currentPlayer;
        playerDisplay.classList.add(`player${currentPlayer}`);
    }

    let scores = {
        X: -1,
        O: 1,
        tie: 0
    };

    function minimax(board, isMaximizer) {
        let winner = checkWinner(!isMaximizer); /* i think the problem is here */
        if (winner !== null) { // terminal condition: someone won, it's not null now
            return winner;
        }
        if(isMaximizer) { // the computer, O, maximiser
            let bestScore = -Infinity;
            for ( let i = 0; i < 9; i++) {
                if(board[i] === '') { // if it's available
                    board[i] = 'O'; // the computer
                    let score = minimax(board, false);
                    board[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        }
        else { // the human, X, minimiser
            let bestScore = Infinity;
            for ( let i = 0; i < 9; i++) {
                if(board[i] === '') { // if it's available
                    board[i] = 'X'; // the human
                    let score = minimax(board, true);
                    board[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
        //return 1; //checking if this works
    }

    function ComputerAction() {

        if(!isGameActive) {
            return;
        }

        let bestScore = -Infinity;
        let bestMove;
        for(let i=0; i<9; i++) {
            if(board[i] === '') {
                board[i] = currentPlayer; //which rn is O, the computer
                let score = minimax(board, false); //we called minimax, gonna make it later
                // ^^ here we see what will happen after we made the move and its the other's turn [minimizer, human]
                board[i] = ''; // we undid the move, cuz we don't wanna change the board ekdum final final just yet
                if ( score > bestScore ) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }

        console.log(`best score: ${bestScore} \nbest move:  ${bestMove}`);

        tiles[bestMove].innerText = currentPlayer;
        tiles[bestMove].classList.add(`player${currentPlayer}`);
        updateBoard(bestMove);
        handleResultValidation();
        changePlayer();

        console.log(`our board for O is ${board}`); //

    }

    function userAction(tile, index) {
        if (isValid(tile) && isGameActive) {
            tile.innerText = currentPlayer;
            tile.classList.add(`player${currentPlayer}`); 
            updateBoard(index);
            handleResultValidation(true);
            changePlayer();


            console.log(`our board for X is ${board}`); //
            if(!mode) {
            ComputerAction(); /* my baby */
            }
        }
    }

    function resetBoard() {
        board = ['', '', '', '', '', '', '', '', ''];
        isGameActive = true;
        announcer.classList.add('hide');
        container.classList.add('hide');
        turnLine.classList.add('hide');
        resetButton.classList.add('hide');   
        multi_mode.classList.remove('hide');
        single_mode.classList.remove('hide');     

        if (currentPlayer === 'O') {
            changePlayer();
        }

        tiles.forEach( (function (tile) {
            tile.innerText = '';
            tile.classList.remove('playerX');
            tile.classList.remove('playerO');
        }));
    }

    tiles.forEach( function (tile, index) {
            tile.addEventListener('click', function () {
                    return userAction(tile, index);
                });
        });

    resetButton.addEventListener('click', resetBoard);

    function startGame(player) {
        isGameActive = true;
        container.classList.remove('hide');
        resetButton.classList.remove('hide');
        multi_mode.classList.add('hide');
        single_mode.classList.add('hide');

        if(player) {
        turnLine.classList.remove('hide');
        mode = true;
        } else {
            mode = false;
        }
    }

    multi_mode.addEventListener('click', startGame(true));
    single_mode.addEventListener('click', startGame(false));
} );
