export const STUDENT_MODE = 'STUDENT';

export const FUNCTION = 'FUNCTION';
export const PREDICATE = 'PREDICATE';


export const FORMULA = 'FORMULA';
export const TERM = 'TERM';

export const EXPRESSION_LABEL = {
  FORMULA: '𝝋',
  TERM: '𝝉'
};

export const defaultInputData = () => ({value: '', locked: false, errorMessage: '', parsed: []});
export const defaultExpressionData = () => ({
  value: '',
  expressionValue: null,
  answerValue: '',
  errorMessage: '',
  inputLocked: false,
  answerLocked: false,
  gameEnabled: false,
  gameHistory: [],
  gameValue: []
});

export const DEFAULT_FILE_NAME = 'struktura';