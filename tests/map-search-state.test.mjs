import assert from "node:assert/strict";
import test from "node:test";
import {
  createInitialSearchState,
  createRequestGate,
  moveHighlight,
  searchReducer,
} from "../src/map/searchState.js";

test("query change resets stale results before a new search", () => {
  const state = {
    ...createInitialSearchState(),
    query: "台北",
    status: "success",
    results: [{ id: "old" }],
    activeIndex: 0,
  };
  const next = searchReducer(state, { type: "queryChanged", query: "高雄" });
  assert.equal(next.query, "高雄");
  assert.equal(next.status, "idle");
  assert.deepEqual(next.results, []);
  assert.equal(next.activeIndex, -1);
});

test("empty and error states retain the current query", () => {
  const searching = { ...createInitialSearchState(), query: "不存在地點", status: "searching" };
  assert.equal(searchReducer(searching, { type: "searchEmpty" }).status, "empty");
  assert.equal(
    searchReducer(searching, { type: "searchFailed", message: "搜尋服務暫時無法使用" }).query,
    "不存在地點",
  );
});

test("successful results, selection, and closing have deterministic states", () => {
  const result = { id: "poi.101", name: "台北 101" };
  const searching = { ...createInitialSearchState(), query: "台北", status: "searching" };
  const success = searchReducer(searching, { type: "searchSucceeded", results: [result] });
  assert.equal(success.status, "success");
  assert.equal(success.activeIndex, 0);
  const selected = searchReducer(success, { type: "resultSelected", result });
  assert.equal(selected.selectedPlace, result);
  assert.equal(selected.query, "台北 101");
  assert.equal(selected.activeIndex, -1);
  assert.equal(searchReducer(success, { type: "resultsClosed" }).status, "idle");
});

test("highlight movement wraps and tolerates no results", () => {
  assert.equal(moveHighlight(-1, 1, 4), 0);
  assert.equal(moveHighlight(3, 1, 4), 0);
  assert.equal(moveHighlight(0, -1, 4), 3);
  assert.equal(moveHighlight(-1, 1, 0), -1);
});

test("request gate rejects every superseded response", () => {
  const gate = createRequestGate();
  const first = gate.next();
  const second = gate.next();
  assert.equal(gate.isCurrent(first), false);
  assert.equal(gate.isCurrent(second), true);
});

