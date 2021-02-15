import { connect } from "react-redux";
import { DEFAULT_LANGUAGE } from "../../utils/constants";

const mapStateToProps = state => {
  return {
    translations: state.translations,
    lang: state.navigation.currentLang,
  };
};


const Translation = ({ translations, lang, id, defaultText }) => {
  if (!translations[id] && defaultText) return defaultText;
  if (!translations[id]) return "No translation available";

  const translatedString = translations[id][lang] ? translations[id][lang] : translations[id][DEFAULT_LANGUAGE]
  return translatedString;
}


export default connect(mapStateToProps, null)(Translation);
