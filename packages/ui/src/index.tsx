export * from "./components";
export { tokens, themeDataAttributes, themeNames, textDirections } from "./theme";
export type { EndooraTheme, TextDirection } from "./theme";

export type EndooraWordmarkProps = {
  compact?: boolean;
};

export function EndooraWordmark({ compact = false }: EndooraWordmarkProps) {
  return (
    <div className="endoora-wordmark" aria-label="Endoora — A new door to your English">
      <img
        className="endoora-wordmark__icon"
        src="/images/endoora-mark.png"
        alt=""
        aria-hidden="true"
      />
      <div className="endoora-wordmark__text">
        <span className="endoora-wordmark__name">Endoora</span>
        {!compact && <span className="endoora-wordmark__motto">A new door to your English</span>}
      </div>
    </div>
  );
}
