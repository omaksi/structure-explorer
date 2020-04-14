export const setConstants = (value) => ({
  type: 'SET_CONSTANTS',
  value
});

export const setPredicates = (value) => ({
  type: 'SET_PREDICATES',
  value
});

export const setFunctions = (value) => ({
  type: 'SET_FUNCTIONS',
  value
});

export const setDomain = (value) => ({
  type: 'SET_DOMAIN',
  value
});

export const renameDomainNode = (oldName,newName) => ({
  type: 'RENAME_DOMAIN_NODE',
  oldName,
  newName
});

export const renameConstantNode = (oldName,newName) => ({
  type: 'RENAME_CONSTANT_NODE',
  oldName,
  newName
});

export const setConstantValueFromLink = (constantNodeName,domainNodeName) => ({
  type: 'SET_CONSTANT_VALUE_FROM_LINK',
  constantNodeName,
  domainNodeName
});

export const syncMathState = () => ({
  type: 'SYNC_MATH_STATE'
});

export const syncDiagram = (value) => ({
  type: 'SYNC_DIAGRAM',
  value
});

export const getPredicates = (set,arity) =>({
  type:'GET_PREDICATES',
  set,
  arity
});

export const removeConstantNode = (nodeName) => ({
  type: 'REMOVE_CONSTANT_NODE',
  nodeName
});

export const removeDomainNode = (nodeName) => ({
  type: 'REMOVE_DOMAIN_NODE',
  nodeName
});

export const addConstantNode = (nodeName,nodeObject) => ({
  type: 'ADD_CONSTANT_NODE',
  nodeName,
  nodeObject
});

export const addDomainNode = (nodeName,nodeObject) => ({
  type: 'ADD_DOMAIN_NODE',
  nodeName,
  nodeObject
});

export const addUnaryPredicate = (predicateName,nodeName) => ({
  type: 'ADD_UNARY_PREDICATE',
  predicateName,
  nodeName
});

export const removeUnaryPredicate = (predicateName,nodeName) => ({
  type: 'REMOVE_UNARY_PREDICATE',
  predicateName,
  nodeName
});

export const addBinaryPredicate = (predicateName,nodeName) => ({
  type: 'ADD_BINARY_PREDICATE',
  predicateName,
  nodeName
});

export const removeBinaryPredicate = (predicateName,sourceNodeName,targetNodeName,direction) => ({
  type: 'REMOVE_BINARY_PREDICATE',
  predicateName,
  sourceNodeName,
  targetNodeName,
  direction
});

export const checkBadName = (newName,oldName,nodeBadNameSetState,nodeType) => ({
  type: 'CHECK_BAD_NAME',
  newName,
  oldName,
  nodeBadNameSetState,
  nodeType
});

export const setConstantValue = (value, constantName) => ({
  type: 'SET_CONSTANT_VALUE',
  constantName,
  value,
});

export const setPredicateValueText = (value, predicateName) => ({
  type: 'SET_PREDICATE_VALUE_TEXT',
  value,
  predicateName
});

export const setPredicateValueTable = (value, predicateName, checked) => ({
  type: 'SET_PREDICATE_VALUE_TABLE',
  value,
  predicateName,
  checked
});

export const setFunctionValueText = (value, functionName) => ({
  type: 'SET_FUNCTION_VALUE_TEXT',
  value,
  functionName
});

export const setDiagramModel = (model) => ({
  type: 'SET_MODEL',
  model
});

export const setFunctionValueTable = (value, functionName) => ({
  type: 'SET_FUNCTION_VALUE_TABLE',
  value,
  functionName
});

export const checkExpressionSyntax = (value, index, expressionType) => ({
  type: 'CHECK_SYNTAX',
  value,
  index,
  expressionType
});

export const addExpression = (expressionType) => ({
  type: 'ADD_EXPRESSION',
  expressionType
});

export const resetDiagramState = () => ({
  type: 'RESET_DIAGRAM_STATE'
});

export const removeExpression = (expressionType, index) => ({
  type: 'REMOVE_EXPRESSION',
  expressionType,
  index
});

export const setExpressionAnswer = (expressionType, answer, index) => ({
  type: 'SET_EXPRESSION_ANSWER',
  expressionType,
  answer,
  index
});

export const lockExpressionValue = (expressionType, expressionIndex) => ({
  type: 'LOCK_EXPRESSION_VALUE',
  expressionType,
  expressionIndex
});

export const lockExpressionAnswer = (expressionType, expressionIndex) => ({
  type: 'LOCK_EXPRESSION_ANSWER',
  expressionType,
  expressionIndex
});

export const lockConstants = () => ({
  type: 'LOCK_CONSTANTS'
});

export const lockPredicates = () => ({
  type: 'LOCK_PREDICATES'
});

export const lockFunctions = () => ({
  type: 'LOCK_FUNCTIONS'
});

export const lockDomain = () => ({
  type: 'LOCK_DOMAIN'
});

export const lockConstantValue = (constantName) => ({
  type: 'LOCK_CONSTANT_VALUE',
  constantName
});

export const lockPredicateValue = (predicateName) => ({
  type: 'LOCK_PREDICATE_VALUE',
  predicateName
});

export const lockFunctionValue = (functionName) => ({
  type: 'LOCK_FUNCTION_VALUE',
  functionName
});

export const lockVariables = () => ({
  type: 'LOCK_VARIABLES'
});

export const toggleTable = (itemType, name) => ({
  type: 'TOGGLE_EDIT_TABLE',
  itemType,
  name
});

export const toggleDatabase = (itemType, name) => ({
  type: 'TOGGLE_EDIT_DATABASE',
  itemType,
  name
});

export const setVariablesValue = (value) => ({
  type: 'SET_VARIABLES_VALUE',
  value
});

export const toggleTeacherMode = () => ({
  type: 'TOGGLE_TEACHER_MODE'
});

export const importAppState = (content) => ({
  type: 'IMPORT_APP',
  content
});

export const toggleEditableNodes = (value) => ({
  type: 'TOGGLE_EDITABLE_NODES',
  value
});
