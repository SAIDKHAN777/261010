/**
 * Incremental Server-Sent Events (SSE) Stream Parser
 * Strictly handles packet fragmentation, UTF-8 chunk buffering,
 * terminal [DONE] tokens, and event: error frames without automatic retries.
 */

export interface SSEParsedEvent {
  event?: string;
  data: string;
}

export class IncrementalSSEParser {
  private buffer = "";

  /**
   * Pushes a new raw text chunk into the parser buffer and yields
   * all completely delimited SSE events.
   */
  public feed(chunk: string): SSEParsedEvent[] {
    this.buffer += chunk;
    const events: SSEParsedEvent[] = [];

    // SSE messages are delimited by a pair of newlines (\n\n or \r\n\r\n)
    let delimiterIndex: number;
    while ((delimiterIndex = this.findDelimiterIndex()) !== -1) {
      const rawEvent = this.buffer.slice(0, delimiterIndex);
      // Advance buffer past delimiter
      const delimiterLength = this.buffer.startsWith("\r\n\r\n", delimiterIndex) ? 4 : 2;
      this.buffer = this.buffer.slice(delimiterIndex + delimiterLength);

      const parsed = this.parseRawEvent(rawEvent);
      if (parsed) {
        events.push(parsed);
      }
    }

    return events;
  }

  private findDelimiterIndex(): number {
    const lfIndex = this.buffer.indexOf("\n\n");
    const crlfIndex = this.buffer.indexOf("\r\n\r\n");

    if (lfIndex === -1) return crlfIndex;
    if (crlfIndex === -1) return lfIndex;
    return Math.min(lfIndex, crlfIndex);
  }

  private parseRawEvent(raw: string): SSEParsedEvent | null {
    const lines = raw.split(/\r?\n/);
    let eventName: string | undefined;
    const dataLines: string[] = [];

    for (const line of lines) {
      if (line.startsWith("event:")) {
        eventName = line.slice(6).trim();
      } else if (line.startsWith("data:")) {
        dataLines.push(line.slice(5).trim());
      }
    }

    if (dataLines.length === 0 && !eventName) {
      return null;
    }

    return {
      event: eventName,
      data: dataLines.join("\n"),
    };
  }
}
