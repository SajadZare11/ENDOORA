type Props = {
  question: string;
  options: string[];
  selected?: string;
  onSelect: (value: string) => void;
};

export default function PlacementQuestionCard({
  question,
  options,
  selected,
  onSelect,
}: Props) {
  return (
    <section aria-label="placement-question">
      <h2>{question}</h2>
      <div>
        {options.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={selected === option}
            onClick={() => onSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </section>
  );
}
