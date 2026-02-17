import { useTranslation } from 'react-i18next';

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const isKo = i18n.language?.startsWith('ko');

  const handleToggle = () => {
    i18n.changeLanguage(isKo ? 'en' : 'ko');
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="font-pixel text-[10px] text-muted-foreground transition-colors hover:text-primary"
      aria-label="Toggle language"
    >
      {isKo ? 'KO' : 'EN'}
    </button>
  );
}
