import styles from "./placement.module.css";

type Props = {
  question: string;
  options: string[];
  selected: string;
  setSelected: (v: string) => void;
  onContinue: () => void;
  isLast: boolean;
};

export default function PlacementQuestionCard({question, options, selected, setSelected, onContinue, isLast}: Props) {
 return (
  <section className={styles.questionCard}>
    <h2 dir="ltr">{question}</h2>
    <div className={styles.options}>
      {options.map(option => (
        <button key={option} className={selected===option ? styles.selected : ""} onClick={()=>setSelected(option)} dir="ltr">
          {option}
        </button>
      ))}
    </div>
    <button className={styles.primary} disabled={!selected} onClick={onContinue}>
      {isLast ? "مشاهده نتیجه" : "ادامه"}
    </button>
  </section>
 );
}
