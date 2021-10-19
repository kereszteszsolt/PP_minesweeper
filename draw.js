let boardSize = 10
let numberOfMines = 10
let boardElement
let minesLeftText
let messageText
let board

window.onload = () => {
    document.getElementById('new-game').addEventListener('click', newGame);
    document.getElementById('new-game').hidden = true;
    document.getElementById('start-game').addEventListener('click', startGame);
    document.getElementById('size').value = boardSize;
    document.getElementById('mines').value = numberOfMines;
}

function newGame() {
    location.reload()
}

function startGame() {
    document.getElementById('new-game').hidden = false;
    document.getElementById('start-game').hidden = true;
    boardSize = document.getElementById('size').value;
    numberOfMines = document.getElementById('mines').value;
    board = createBoard(boardSize, numberOfMines)
    boardElement = document.querySelector('.board')
    minesLeftText = document.querySelector('[data-mine-count]')
    messageText = document.querySelector('.subtext')

    board.forEach(row => {
        row.forEach(tile => {
            boardElement.append(tile.element)
            tile.element.addEventListener('click', () => {
                revealTile(board, tile)
                checkGameEnd()
            })
            tile.element.addEventListener('contextmenu', e => {
                e.preventDefault()
                markTile(tile)
                listMinesLeft()
            })
        })
    })
    boardElement.style.setProperty('--size', boardSize.toString())
    minesLeftText.textContent = numberOfMines.toString()
}

function listMinesLeft() {
    const markedTilesCount = board.reduce((count, row) => {
        return (
            count + row.filter(tile => tile.status === TILE_STATUSES.FLAGGED).length
        )
    }, 0)

    minesLeftText.textContent = numberOfMines - markedTilesCount
}

function checkGameEnd() {
    const win = checkWin(board)
    const lose = checkLose(board)

    if (win || lose) {
        boardElement.addEventListener('click', stopProp, {capture: true})
        boardElement.addEventListener('contextmenu', stopProp, {capture: true})
    }

    if (win) {
        messageText.textContent = 'You Win'
    }
    if (lose) {
        messageText.textContent = 'You Lose'
        board.forEach(row => {
            row.forEach(tile => {
                if (tile.status === TILE_STATUSES.FLAGGED) markTile(tile)
                if (tile.mine) revealTile(board, tile)
            })
        })
    }
}

function stopProp(e) {
    e.stopImmediatePropagation()
}
