import { CardVariant } from './App';
import './Flashcard.css';

interface FlashCardProps {
  frontText: string,
  backText?: string,
  cardId: number,
  isFront: boolean;
  variant: CardVariant,
  onClick?: any
}

const Flashcard = (props: FlashCardProps) => {
  let {frontText = "Front", backText = "Back", cardId: nodeId = 0, isFront = true, variant = "default", onClick} = props;
  const setIsFront = (val: boolean) => {
    isFront = val;
  }
  return (
    <div className={["flashcard", variant].join(" ")} onClick={onClick}>
      <div className={`flashcard-inner ${isFront?"":"flipped"}`}>
        <div className="flashcard-front">
          <button className="control" onClick={()=>{setIsFront(false)}}>flip</button>
          <div>{frontText}</div>
        </div>
        <div className="flashcard-back">
          <button className="control" onClick={()=>{setIsFront(true)}}>close</button>
          <div>{backText}</div>
          <div className="id-tag">#{nodeId}</div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;