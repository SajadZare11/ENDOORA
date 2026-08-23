import styles from './placement.module.css';
import EndooraButton from '@/components/design/EndooraButton';

type PlacementQuestionData = {
  id?: number;
  question: string;
  options: string[];
};

type Props = {
  question: PlacementQuestionData;
  index: number;
  total: number;
  selected: string;
  setSelected: (v: string) => void;
  next: () => void;
};

export default function PlacementQuestion({
  question,
  index,
  total,
  selected,
  setSelected,
  next,
}: Props) {
  return (
    <div className={styles.questionCard}>
      <div className={styles.counter}>
        سوال {index + 1} از {total}
      </div>

      <h3 className={styles.english} dir="ltr">
        {question.question}
      </h3>

      <div className={styles.options}>
        {question.options.map((option) => (
          <button
            key={option}
            onClick={() => setSelected(option)}
            className={`${styles.option} ${
              selected === option ? styles.active : ''
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <EndooraButton disabled={!selected} onClick={next}>
        {index === total - 1 ? 'پایان آزمون' : 'سوال بعدی'}
      </EndooraButton>
    </div>
  );
}
