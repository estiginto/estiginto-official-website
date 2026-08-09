import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { createPlaceSearchService } from "./placeSearch.js";
import {
  createInitialSearchState,
  createRequestGate,
  searchReducer,
} from "./searchState.js";

const SEARCH_FAILURE_MESSAGE = "搜尋服務暫時無法使用，請稍後重試。";

export default function usePlaceSearch({
  proximity,
  debounceMs = 300,
}) {
  const [state, dispatch] = useReducer(searchReducer, undefined, createInitialSearchState);
  const [retryVersion, setRetryVersion] = useState(0);
  const gateRef = useRef(createRequestGate());
  const abortRef = useRef(null);
  const service = useMemo(() => createPlaceSearchService(), []);
  const longitude = proximity?.[0];
  const latitude = proximity?.[1];

  useEffect(() => {
    const query = state.query.trim();
    abortRef.current?.abort();
    abortRef.current = null;

    if (query.length < 2) return undefined;

    const timer = window.setTimeout(async () => {
      const requestId = gateRef.current.next();
      const controller = new AbortController();
      abortRef.current = controller;
      dispatch({ type: "searchStarted" });

      try {
        const results = await service.search(query, {
          proximity: Number.isFinite(longitude) && Number.isFinite(latitude)
            ? [longitude, latitude]
            : undefined,
          language: "default",
          signal: controller.signal,
        });

        if (!gateRef.current.isCurrent(requestId)) return;
        dispatch(results.length
          ? { type: "searchSucceeded", results }
          : { type: "searchEmpty" });
      } catch (error) {
        if (error?.name === "AbortError" || !gateRef.current.isCurrent(requestId)) return;
        dispatch({ type: "searchFailed", message: SEARCH_FAILURE_MESSAGE });
      }
    }, debounceMs);

    return () => {
      window.clearTimeout(timer);
      abortRef.current?.abort();
    };
  }, [debounceMs, latitude, longitude, retryVersion, service, state.query]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const setQuery = useCallback((query) => {
    dispatch({ type: "queryChanged", query });
  }, []);

  const moveActive = useCallback((direction) => {
    dispatch({ type: "highlightMoved", direction });
  }, []);

  const selectResult = useCallback((result) => {
    if (result) dispatch({ type: "resultSelected", result });
    return result ?? null;
  }, []);

  const selectActive = useCallback(() => {
    const result = state.results[state.activeIndex];
    if (result) dispatch({ type: "resultSelected", result });
    return result ?? null;
  }, [state.activeIndex, state.results]);

  const closeResults = useCallback(() => {
    dispatch({ type: "resultsClosed" });
  }, []);

  const retry = useCallback(() => {
    setRetryVersion((version) => version + 1);
  }, []);

  return {
    state,
    setQuery,
    moveActive,
    selectActive,
    selectResult,
    closeResults,
    retry,
  };
}
