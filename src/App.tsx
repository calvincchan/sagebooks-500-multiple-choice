import update from 'immutability-helper';
import { useCallback, useEffect, useState } from 'react';
import ConfettiExplosion from 'react-confetti-explosion';
import './App.css';
import { LearningCards } from './data/index';
import Flashcard from './Flashcard';

const NUMBER_OF_CARDS_TO_DEAL = 4;
const INIT_CARD_ID = 0;
const cardPool = LearningCards.level1;

export type CardVariant = "default" | "correct" | "incorrect";

export interface CardSlot {
  cardId: number;
  variant: CardVariant;
}

/** Play audio */
const audio = new Audio();
const playSound = (id: number) => {
  let phonic = cardPool[id].jyutping ?? "";
  if (phonic.includes("/")) {
    [phonic] = phonic.split("/");
  }
  const url = `https://humanum.arts.cuhk.edu.hk/Lexis/lexi-can/sound/${phonic}.wav`;
  audio.src = url;
  audio.play();
}

/** Shuffle items in an array. */
const shuffleArray = (arr: any[]): any[] => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function App() {
  const [cardId, setCardId] = useState(() => INIT_CARD_ID);
  const [slots, setSlots] = useState<CardSlot[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [round, setRound] = useState(0);
  const [pickerVisible, setPickerVisible] = useState(false);

  function selectCard(str: string) {
    const val = parseInt(str!);
    if (val >= 1 && val <= cardPool.length) {
      setCardId(val - 1);
      playSound(val - 1);
      setRound(x => x + 1);
      setPickerVisible(false);
    }
}

  useEffect(() => {
    function shuffleSlots(id: number) {
      const length = cardPool.length;
      const picked: number[] = [id];
      while (picked.length < NUMBER_OF_CARDS_TO_DEAL) {
        var num = Math.floor(Math.random() * length);
        if (num !== id && !picked.includes(num)) {
          picked.push(num);
        }
      }
      const slots: CardSlot[] = picked.map(n => { return { cardId: n, variant: "default" }; });
      return shuffleArray(slots);
    }

    if (round > 0) {
      setSlots(shuffleSlots(cardId));
    }
  }, [cardId, round]);

  const startNewRound = useCallback(() => {
    setRound(x => x + 1);
    setIsCorrect(false);
    playSound(cardId);
  }, [cardId]);


  function moveTo(value: number) {
    if (value >= 0 && value < cardPool.length) {
      setCardId(value);
      setRound(x => x + 1);
      setIsCorrect(false);
      playSound(value);
    }
  }

  /** Check if the answer is correct or not, and update visual style. */
  function checkAnswer(selected: number) {
    const selectedSlot = slots[selected];
    const answer = cardId;
    if (selectedSlot.cardId === answer) {
      setSlots(update(slots, {
        [selected]: { $merge: { variant: "correct" } }
      }));
      setIsCorrect(true);
    } else {
      setSlots(update(slots, {
        [selected]: { $merge: { variant: "incorrect" } }
      }));
    }
  }

  /** Auto start new round on correct answer. */
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCorrect) {
      timer = setTimeout(() => {
        startNewRound();
      }, 1600);
    }
    return () => {
      clearTimeout(timer);
    }
  }, [cardId, isCorrect, startNewRound]);

  return (
    <div className="App">
      <div className='settings-pane'>
      <button onClick={()=>{setPickerVisible(!pickerVisible)}}>Set Card ({cardId+1})</button>
      {pickerVisible &&
        <select value={cardId+1} onChange={e => selectCard(e.target.value)}>
          {cardPool.map(it => <option key={it.cardId} value={it.cardId}>{it.cardId}: {it.character}</option>)}
        </select>
      }
      {round > 0 &&
        <>
          <button onClick={()=>{moveTo(cardId-1)}}>Previous</button>
          <button onClick={()=>{moveTo(cardId+1)}}>Next</button>
        </>
      }
      </div>
      <div className='confetti'>
        {isCorrect && <ConfettiExplosion height="150vh" />}
      </div>
      <div className='cards-pane'>
        {slots.map((slot, index) => (
          <Flashcard key={slot.cardId} variant={slot.variant} cardId={cardPool[slot.cardId].cardId} frontText={cardPool[slot.cardId]?.character} backText={cardPool[slot.cardId]?.jyutping} isFront={true} onClick={()=>{checkAnswer(index)}} />
        ))}
      </div>
      <div className='control-pane'>
        <button onClick={()=>{startNewRound()}}>Restart Game</button>
        {round > 0 && <button onClick={()=>{playSound(cardId)}}>Play Sound</button>}
      </div>
    </div>
  );
}

export default App;

