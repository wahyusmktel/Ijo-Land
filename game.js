document.addEventListener('DOMContentLoaded', () => {
    let board = [];
    let size = 3;
    let moves = 0;
    let timer = null;
    let seconds = 0;
    let gameStarted = false;
    
    const puzzleBoard = document.getElementById('puzzle-board');
    const difficultySelect = document.getElementById('difficulty');
    const startButton = document.getElementById('start-game');
    const showSolutionButton = document.getElementById('show-solution');
    const movesDisplay = document.getElementById('moves');
    const timeDisplay = document.getElementById('time');

    function initializeBoard() {
        board = [];
        moves = 0;
        seconds = 0;
        gameStarted = true;
        movesDisplay.textContent = moves;
        timeDisplay.textContent = '00:00';

        // Create shuffled array of numbers
        const numbers = Array.from({length: size * size - 1}, (_, i) => i + 1);
        numbers.push(0); // 0 represents empty space
        shuffleArray(numbers);

        // Create board grid
        puzzleBoard.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        puzzleBoard.innerHTML = '';

        for (let i = 0; i < size; i++) {
            board[i] = [];
            for (let j = 0; j < size; j++) {
                const value = numbers[i * size + j];
                board[i][j] = value;
                
                const tile = document.createElement('div');
                tile.className = 'puzzle-tile';
                if (value !== 0) {
                    tile.textContent = value;
                    tile.addEventListener('click', () => moveTile(i, j));
                } else {
                    tile.classList.add('empty');
                }
                puzzleBoard.appendChild(tile);
            }
        }

        // Start timer
        if (timer) clearInterval(timer);
        timer = setInterval(updateTimer, 1000);
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        // Ensure puzzle is solvable
        if (!isSolvable(array)) {
            // Swap last two numbers if puzzle is not solvable
            [array[array.length - 2], array[array.length - 3]] = 
            [array[array.length - 3], array[array.length - 2]];
        }
    }

    function isSolvable(puzzle) {
        let inversions = 0;
        const puzzleSize = size * size;
        
        // Count inversions
        for (let i = 0; i < puzzleSize - 1; i++) {
            if (puzzle[i] === 0) continue;
            for (let j = i + 1; j < puzzleSize; j++) {
                if (puzzle[j] === 0) continue;
                if (puzzle[i] > puzzle[j]) inversions++;
            }
        }

        // For odd-sized grids, number of inversions must be even
        if (size % 2 === 1) return inversions % 2 === 0;

        // For even-sized grids, sum of inversions and row of empty tile from bottom must be odd
        const emptyTileRow = Math.floor(puzzle.indexOf(0) / size);
        return (inversions + (size - emptyTileRow)) % 2 === 1;
    }

    function updateTimer() {
        seconds++;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        timeDisplay.textContent = 
            `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    function findEmpty() {
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (board[i][j] === 0) return {row: i, col: j};
            }
        }
    }

    function moveTile(row, col) {
        if (!gameStarted) return;

        const empty = findEmpty();
        const isAdjacent = 
            (Math.abs(row - empty.row) === 1 && col === empty.col) ||
            (Math.abs(col - empty.col) === 1 && row === empty.row);

        if (isAdjacent) {
            // Swap tiles
            [board[row][col], board[empty.row][empty.col]] = 
            [board[empty.row][empty.col], board[row][col]];

            // Update UI
            updateBoardUI();
            moves++;
            movesDisplay.textContent = moves;

            // Check if puzzle is solved
            if (isComplete()) {
                gameStarted = false;
                clearInterval(timer);
                setTimeout(() => {
                    alert(`Congratulations! You solved the puzzle in ${moves} moves and ${seconds} seconds!`);
                }, 100);
            }
        }
    }

    function updateBoardUI() {
        const tiles = puzzleBoard.children;
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const value = board[i][j];
                const tile = tiles[i * size + j];
                tile.textContent = value || '';
                tile.className = `puzzle-tile${value === 0 ? ' empty' : ''}`;
            }
        }
    }

    function isComplete() {
        let value = 1;
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (i === size - 1 && j === size - 1) {
                    if (board[i][j] !== 0) return false;
                } else if (board[i][j] !== value++) {
                    return false;
                }
            }
        }
        return true;
    }

    function showSolution() {
        if (!gameStarted) return;
        
        const solution = document.createElement('div');
        solution.className = 'solution-overlay';
        solution.innerHTML = `
            <div class="solution-content">
                <img src="https://placehold.co/400" alt="Complete Puzzle" />
                <button class="btn close-solution">Close</button>
            </div>
        `;
        
        document.body.appendChild(solution);
        
        const closeButton = solution.querySelector('.close-solution');
        closeButton.addEventListener('click', () => {
            document.body.removeChild(solution);
        });
    }

    // Event Listeners
    difficultySelect.addEventListener('change', (e) => {
        size = parseInt(e.target.value);
    });

    startButton.addEventListener('click', initializeBoard);
    showSolutionButton.addEventListener('click', showSolution);

    // Initialize game with default settings
    initializeBoard();
});