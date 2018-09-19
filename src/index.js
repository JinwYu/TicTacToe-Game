import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

  /*
  class Square extends React.Component {
    render() {
      return (
        <button 
        className="square" 
        onClick={() => this.props.onClick()}
        >
          {this.props.value}
        </button>
      );
    }
  }
  */

  // Re-written the Square class to a "functional component"
  /*
    In React, functional components are a simpler way to write 
    components that only contain a render method and don’t have 
    their own state.
  */
  function Square(props) {
    return (
      <button className="square" 
      onClick={props.onClick}
      >
        {props.value}
      </button>
    );
  } 

  class Board extends React.Component {

    renderSquare(i) {
      return (
        <Square 
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
        />
      );
    }
  
    render() {
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
        }],
        stepNumber: 0,
        xIsNext: true,
        /*
        Each time a player moves, xIsNext (a boolean) 
        will be flipped to determine which player goes 
        next and the game’s state will be saved. We’ll 
        update the Board’s handleClick function to flip 
        the value of xIsNext:
      */
      };
    }

    handleClick(i) {
      // This ensures that if we “go back in time” and then
      // make a new move from that point, we throw away all
      // the “future” history that would now become incorrect.
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      
      const current = history[history.length - 1];
      const squares = current.squares.slice();

      // Return early by ignoring a click if someone has won 
      // the game or if a Square is already filled.
      if(calculateWinner(squares) || squares[i]){
        return;
      } 

      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        // concat() method doesn’t mutate the original array,
        // unlike the array push() method.
        history: history.concat([{
          squares: squares,
        }]),
        // After we make a new move, we need to update 
        // stepNumber by adding stepNumber: history.length
        // as part of the this.setState argument. This ensures
        // we don’t get stuck showing the same move after a
        // new one has been made.
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext, // Flips the turn.
      });
    }

    jumpTo(step){
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber]; //Rendering the currently selected move according to stepNumber.
      const winner = calculateWinner(current.squares);

      /*
        const numbers = [1, 2, 3];
        const doubled = numbers.map(x => x * 2); // [2, 4, 6]
        Using the map method, we can map our history of moves to
        React elements representing buttons on the screen, and 
        display a list of buttons to “jump” to past moves.
      */
      const moves = history.map((step, move) => {
        const desc = move ? 
        'Go to move #' + move : 
        'Go to game start';

        /*
          For each move in the tic-tac-toes’s game’s history,
          we create a list item <li> which contains a button
          <button>. The button has a onClick handler which calls
          a method called this.jumpTo().
        */
        return(
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>
              {desc}
            </button>
          </li>
        )
      })
  
      let status;
      if (winner) {
        status = 'Winner: ' + winner;
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
  
      return (
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
            />
  
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  
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

    for(let i = 0; i < lines.length; i++){
      const [a, b, c] = lines[i];
      if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

  