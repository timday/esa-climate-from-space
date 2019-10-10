import {State} from './index';
import {
  SET_LANGUAGE,
  Language,
  SetLanguageAction
} from '../actions/set-language';
import getBrowserLanguage from '../libs/get-browser-language';

const initialState: Language = getBrowserLanguage() || Language.EN;

function languageReducer(
  state: Language = initialState,
  action: SetLanguageAction
): Language {
  switch (action.type) {
    case SET_LANGUAGE:
      return action.language;
    default:
      return state;
  }
}

export function languageSelector(state: State): Language {
  return state.language;
}

export default languageReducer;
