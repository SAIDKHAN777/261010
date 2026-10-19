import { describe, it, expect } from "vitest";
import { IncrementalSSEParser } from "../sse-parser";

describe("IncrementalSSEParser", () => {
  it("parses single complete SSE data frame", () => {
    const parser = new IncrementalSSEParser();
    const events = parser.feed('data: {"text":"hello world"}\n\n');

    expect(events).toHaveLength(1);
    expect(events[0].data).toBe('{"text":"hello world"}');
    expect(events[0].event).toBeUndefined();
  });

  it("handles chunk fragmentation across multiple feeds", () => {
    const parser = new IncrementalSSEParser();

    // Chunk 1: Partial event
    const events1 = parser.feed('data: {"text":"part');
    expect(events1).toHaveLength(0);

    // Chunk 2: Completion of first event and start of terminal token
    const events2 = parser.feed('ial 1"}\n\ndata: [DONE');
    expect(events2).toHaveLength(1);
    expect(events2[0].data).toBe('{"text":"partial 1"}');

    // Chunk 3: Final delimiter
    const events3 = parser.feed("]\n\n");
    expect(events3).toHaveLength(1);
    expect(events3[0].data).toBe("[DONE]");
  });

  it("handles named SSE event frames like event: error", () => {
    const parser = new IncrementalSSEParser();
    const events = parser.feed(
      'event: error\ndata: {"status":503,"detail":"Interrupted"}\n\n'
    );

    expect(events).toHaveLength(1);
    expect(events[0].event).toBe("error");
    expect(JSON.parse(events[0].data)).toEqual({
      status: 503,
      detail: "Interrupted",
    });
  });

  it("handles CRLF line endings cleanly", () => {
    const parser = new IncrementalSSEParser();
    const events = parser.feed('data: {"text":"crlf test"}\r\n\r\n');

    expect(events).toHaveLength(1);
    expect(events[0].data).toBe('{"text":"crlf test"}');
  });
});
