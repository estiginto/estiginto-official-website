export function createInitialSearchState() {
  return {
    query: "",
    status: "idle",
    results: [],
    activeIndex: -1,
    selectedPlace: null,
    errorMessage: "",
  };
}

export function moveHighlight(current, direction, resultCount) {
  if (resultCount <= 0) return -1;
  if (direction > 0) return current < 0 ? 0 : (current + 1) % resultCount;
  if (direction < 0) return current <= 0 ? resultCount - 1 : current - 1;
  return current;
}

export function createRequestGate() {
  let current = 0;
  return {
    next() {
      current += 1;
      return current;
    },
    isCurrent(id) {
      return id === current;
    },
  };
}

export function searchReducer(state, action) {
  switch (action.type) {
    case "queryChanged":
      return {
        ...state,
        query: action.query,
        status: "idle",
        results: [],
        activeIndex: -1,
        errorMessage: "",
      };
    case "searchStarted":
      return { ...state, status: "searching", activeIndex: -1, errorMessage: "" };
    case "searchSucceeded":
      return {
        ...state,
        status: "success",
        results: action.results,
        activeIndex: action.results.length ? 0 : -1,
        errorMessage: "",
      };
    case "searchEmpty":
      return { ...state, status: "empty", results: [], activeIndex: -1, errorMessage: "" };
    case "searchFailed":
      return {
        ...state,
        status: "error",
        results: [],
        activeIndex: -1,
        errorMessage: action.message,
      };
    case "highlightMoved":
      return {
        ...state,
        activeIndex: moveHighlight(state.activeIndex, action.direction, state.results.length),
      };
    case "resultSelected":
      return {
        ...state,
        query: action.result.name,
        selectedPlace: action.result,
        activeIndex: -1,
      };
    case "resultsClosed":
      return { ...state, status: "idle", results: [], activeIndex: -1 };
    default:
      return state;
  }
}
