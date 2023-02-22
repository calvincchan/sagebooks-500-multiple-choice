import { useState } from 'react';
import './Flashcard.css';

function Flashcard(props: {frontText: string, backText?: string}) {
  const {frontText = "Front", backText = "Back"} = props;
  const [isFront, setIsFront] = useState(true);
  return (
    <div className="flashcard">
      <div className={`flashcard-inner ${isFront?"":"flipped"}`}>
        <div className="flashcard-front">
          <button className="control" onClick={()=>{setIsFront(false)}}>flip</button>
          <h1>{frontText}</h1>
        </div>
        <div className="flashcard-back">
          <button className="control" onClick={()=>{setIsFront(true)}}>close</button>
          <h3>{backText}</h3>
        </div>
      </div>
    </div>
  );
}

export default Flashcard;