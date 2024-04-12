import { describe, expect, test } from "bun:test";
import { Matcher } from "./Matcher";

describe("Matcher", () => {
  test("empty includes", () => {
    const matcher = new Matcher([], ["foo"]);
    expect(matcher.matches("foo")).toBe(false);
    expect(matcher.matches("bar")).toBe(true);
  });
  test("non-empty includes", () => {
    const matcher = new Matcher(["qux"], ["bar"]);
    expect(matcher.matches("foo")).toBe(false);
    expect(matcher.matches("bar")).toBe(false);
    expect(matcher.matches("qux")).toBe(true);
    expect(matcher.matches("qux/bar")).toBe(false);
  });
});
