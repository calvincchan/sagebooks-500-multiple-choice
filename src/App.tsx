import { useCallback, useEffect, useState } from 'react';
import './App.css';
import { LearningCards } from './data';
import Flashcard from './Flashcard';

const NUMBER_OF_CARDS_TO_DEAL = 5;

function App() {
  const [cardId, setCardId] = useState(0);
  const [cards, setCards] = useState<number[]>([])

  const showSetDialog = () => {
    const len = LearningCards.length;
    const str = prompt(`Please enter node ID (1-${len+1})`, String(cardId + 1));
    const val = parseInt(str!);
    if (val > 1 && val <= len) {
      setCardId(val - 1);
    }
  }

  const dealCards = useCallback(() => {
    const length = LearningCards.length;
    const cards: number[] = [cardId];
    while (cards.length < NUMBER_OF_CARDS_TO_DEAL) {
      var num = Math.floor(Math.random() * length);
      if (num !== cardId && !cards.includes(num)) {
        cards.push(num);
      }
    }
    console.log(cards)
    setCards(shuffleArray(cards));
  }, [cardId])

  function shuffleArray(arr: number[]): number[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  const moveTo = (newValue: number) => {
    if (newValue >= 0 && newValue < LearningCards.length) {
      setCardId(newValue);
    }
  }

  useEffect(() => {
    dealCards();
  }, [cardId, dealCards]);

  return (
    <div className="App">
      <div className='settings-pane'>
        <button onClick={showSetDialog}>Set Card ({cardId+1})</button>
        <button onClick={()=>{moveTo(cardId-1)}}>Previous</button>
        <button onClick={()=>{moveTo(cardId+1)}}>Next</button>
        <button onClick={()=>{dealCards()}}>Shuffle Cards</button>
      </div>
      <div className='cards-pane'>
        <div></div>
        {cards.map(id => (
          <Flashcard key={id} cardId={LearningCards[id].cardId} frontText={LearningCards[id]?.character} backText={LearningCards[id]?.jyutping} />
        ))};
      </div>
    </div>
  );
}

export default App;

