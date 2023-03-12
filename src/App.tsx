import update from 'immutability-helper';
import { useCallback, useEffect, useState } from 'react';
import ConfettiExplosion from 'react-confetti-explosion';
import './App.css';
import { LearningCards } from './data';
import Flashcard from './Flashcard';

const NUMBER_OF_CARDS_TO_DEAL = 5;

export type CardVariant = "default" | "correct" | "incorrect";

export interface CardSlot {
  cardId: number;
  variant: CardVariant
}

function App() {
  const [cardId, setCardId] = useState(0);
  const [cards, setCards] = useState<CardSlot[]>([])
  const [isExploding, setIsExploding] = useState(false);

  const showSetDialog = () => {
    const len = LearningCards.length;
    const str = prompt(`Please enter node ID (1-${len+1})`, String(cardId + 1));
    const val = parseInt(str!);
    if (val > 1 && val <= len) {
      setCardId(val - 1);
    }
  }

  const startNewRound = useCallback(() => {
    const length = LearningCards.length;
    const cardIds: number[] = [cardId];
    while (cardIds.length < NUMBER_OF_CARDS_TO_DEAL) {
      var num = Math.floor(Math.random() * length);
      if (num !== cardId && !cardIds.includes(num)) {
        cardIds.push(num);
      }
    }
    const slots: CardSlot[] = cardIds.map(n => {return {cardId: n, variant: "default"}});
    setCards(shuffleArray(slots));
    setIsExploding(false);
  }, [cardId])

  function shuffleArray(arr: any[]): any[] {
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

  const checkAnswer = (index: number) => {
    const selectedSlot = cards[index];
    const answer = cardId;
    console.log({answer, index, selectedSlot})
    if (selectedSlot.cardId === answer) {
      setCards(update(cards, {
        [index]: { $merge: {variant: "correct" }}
      }));
      setIsExploding(!isExploding);
    } else {
      setCards(update(cards, {
        [index]: { $merge: {variant: "incorrect" }}
      }));
    }
  }

  useEffect(() => {
    startNewRound();
  }, [cardId, startNewRound]);

  return (
    <div className="App">
      <div className='settings-pane'>
        <button onClick={showSetDialog}>Set Card ({cardId+1})</button>
        <button onClick={()=>{moveTo(cardId-1)}}>Previous</button>
        <button onClick={()=>{moveTo(cardId+1)}}>Next</button>
      </div>
      <div className='confetti'>
        {isExploding && <ConfettiExplosion height="150vh" />}
      </div>
      <div className='cards-pane'>
        {cards.map((slot, index) => (
          <Flashcard key={slot.cardId} variant={slot.variant} cardId={LearningCards[slot.cardId].cardId} frontText={LearningCards[slot.cardId]?.character} backText={LearningCards[slot.cardId]?.jyutping} onClick={()=>{checkAnswer(index)}} />
        ))};
      </div>
      <div className='control-pane'>
        <button onClick={()=>{startNewRound()}}>Restart Game</button>
      </div>
    </div>
  );
}

export default App;

