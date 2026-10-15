const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const restartBtn = document.getElementById("restart");
const scoreEls = {
  X: document.getElementById("score-x"),
  O: document.getElementById("score-o"),
  draw: document.getElementById("score-draw"),
};

const scores = { X: 0, O: 0, draw: 0 };
let cells = Array(9).fill(null);
let turn = "X";
let locked = false;

function winnerOf(squares) {
  for (const line of LINES) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line };
    }
  }
  return null;
}

function render() {
  boardEl.replaceChildren();
  const result = winnerOf(cells);
  const draw = !result && cells.every(Boolean);

  cells.forEach((mark, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "cell";
    button.setAttribute("aria-label", mark ? `${mark} in square ${index + 1}` : `Empty square ${index + 1}`);
    button.textContent = mark || "";
    if (mark) button.classList.add(mark.toLowerCase());
    if (result && result.line.includes(index)) button.classList.add("win");
    button.disabled = locked || Boolean(mark);
    button.addEventListener("click", () => play(index));
    boardEl.append(button);
  });

  if (result) statusEl.textContent = `${result.player} wins`;
  else if (draw) statusEl.textContent = "Draw";
  else statusEl.textContent = `${turn} goes next`;
}

function play(index) {
  if (locked || cells[index]) return;
  cells[index] = turn;
  const result = winnerOf(cells);
  if (result) {
    scores[result.player] += 1;
    locked = true;
  } else if (cells.every(Boolean)) {
    scores.draw += 1;
    locked = true;
  } else {
    turn = turn === "X" ? "O" : "X";
  }
  scoreEls.X.textContent = scores.X;
  scoreEls.O.textContent = scores.O;
  scoreEls.draw.textContent = scores.draw;
  render();
}

function restart() {
  cells = Array(9).fill(null);
  turn = "X";
  locked = false;
  render();
}

restartBtn.addEventListener("click", restart);
render();
