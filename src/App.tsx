import { useReducer } from 'react';
import './App.css';
import { LearningCards } from './data';
import Flashcard from './Flashcard';

interface State {
  pos: number;
  min: number;
  max: number;
}

type Action = "prev" | "next";

const reducer = function(state: State, action: Action): State {
  console.log({state, action});
  switch(action){
    case "prev":
      return {
        ...state,
        pos: state.pos > state.min ? state.pos - 1 : state.pos
      };
    case "next":
      return {
        ...state,
        pos: state.pos < state.max ? state.pos + 1 : state.pos
      };
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, {pos: 0, min: 0, max: LearningCards.length-1});

  return (
    <div className="App">
      <div>{state.pos}</div>
      <Flashcard frontText={LearningCards[state.pos]?.character} backText={LearningCards[state.pos]?.jyutping} />
      <button onClick={()=>dispatch("prev")}>Prev</button>
      <button onClick={()=>dispatch("next")}>next</button>
    </div>
  );
}

export default App;
