import { useState } from 'react';
import { CardVariant } from './App';
import './Flashcard.css';

function Flashcard(props: {frontText: string, backText?: string, cardId: number, variant: CardVariant, onClick?: any}) {
  const {frontText = "Front", backText = "Back", cardId: nodeId = 0, variant = "default", onClick} = props;
  const [isFront, setIsFront] = useState(true);
  return (
    <div className={["flashcard", variant].join(" ")} onClick={onClick}>
      <div className={`flashcard-inner ${isFront?"":"flipped"}`}>
        <div className="flashcard-front">
          <button className="control" onClick={()=>{setIsFront(false)}}>flip</button>
          <h1>{frontText}</h1>
        </div>
        <div className="flashcard-back">
          <button className="control" onClick={()=>{setIsFront(true)}}>close</button>
          <div>{backText}</div>
          <div className="id-tag">#{nodeId}</div>
        </div>
      </div>
    </div>
  );
}

export default Flashcard;