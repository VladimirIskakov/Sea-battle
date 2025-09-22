import { useTranslation } from "react-i18next";
import styles from "./language-selector.module.scss";
import type { FC } from "react";
import { useState, useEffect, useRef } from "react";

export const LanguageSelector: FC = () => {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: "ru", label: "Русский", emoji: "🇷🇺" },
    { code: "en", label: "English", emoji: "🇬🇧" },
  ];

  const changeLanguage = (lang: "ru" | "en") => {
    i18n.changeLanguage(lang);
    setOpen(false);
  };

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles["language-selector"]} ref={dropdownRef}>
      <div className={styles["language-selector__dropdown"]}>
        <button
          className={styles["language-selector__current"]}
          onClick={() => setOpen(prev => !prev)}
        >
          <span className={styles["language-selector__emoji"]}>{currentLang.emoji}</span>
          {currentLang.label}
        </button>
        {open && (
          <div className={styles["language-selector__menu"]}>
            {languages.map(lang => (
              <button
                key={lang.code}
                className={styles["language-selector__item"]}
                onClick={() => changeLanguage(lang.code as "ru" | "en")}
              >
                <span className={styles["language-selector__emoji"]}>{lang.emoji}</span>
                {lang.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
