import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
class Square extends React.Component{
  render() {
    let red = this.props.winner ? ' red' : '';
    return (
        <button className={"square" + red } onClick={() => this.props.onClick()}>
          {this.props.value}
        </button>
    );
  }
}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  }
  renderSquare(i, win) {
    return (
        <Square
              key = {i}
              winner = {win}
              value = {this.props.squares[i]}
              onClick = {() => this.props.onClick(i)}
        />
    );
  }
  render() {
    let win = false;
    let board_row = [];
    for(let col = 0; col < 3; col++) {
      let board_col = [];
      for(let row = 0; row < 3; row++) {
        if(this.props.squares.winSquares) {
          win = this.props.squares.winSquares.indexOf(col*3 + row) !== -1 ? true : false;
        }
        board_col.push(this.renderSquare(col*3 + row, win));
      }
      board_row.push(<div className="board-row" key={col}>{board_col}</div>);
    }
    return (<div>{board_row}</div>);
  }
}

class Game extends React.Component {
  constructor(props) {
    super (props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const desc = move ?
          'Go to move #' + move :
          'Go to game start';
      return (
          <li key={move}>
            <button className="ui inverted black button step" onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
      );
    });
    let status;
    let restart;
    let restartClassName;
    let statusClassName;
    if (winner) {
      if(winner === 'draw') {
        status = 'Draw!';
        statusClassName = "ui red message";
        restart = 'Click on the board again to restart';
        restartClassName = "ui info message";
      }
      else {
        status = 'Winner: ' + winner[0];
        statusClassName = "ui green message";
        restart = 'Click on the board again to restart';
        current.squares.winSquares = winner[3];
        restartClassName = "ui info message";
      }
    }
    else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
        <div className="ui container game">
          <div className="ui grid">
            <div className="centered row">
              <div id="game-board" className="game-board">
                <Board
                    squares={current.squares}
                    onClick={(i) => this.handleClick(i)}
                />
              </div>
              <div className="game-info">
                <div className={statusClassName}>{status}</div>
                <div className={restartClassName}>{restart}</div>
                <ol>{moves}</ol>
              </div>
            </div>
          </div>
        </div>
    );
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if(calculateWinner(squares) || squares[i]) {
      if(calculateWinner(squares)) {
        this.jumpTo(0);
      }
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for(let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], squares[b], squares[c], lines[i]];
    }
    else if(!squares.includes(null)){
      return 'draw';
    }
  }
  return null;
}
// ========================================

ReactDOM.render(
<Game />,
    document.getElementById('root')
);

