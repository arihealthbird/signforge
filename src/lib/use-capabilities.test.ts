import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { capabilitiesStore } from "./use-capabilities";

const answer = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

function stubFetch(...responses: Array<Response | Error>) {
  const queue = [...responses];
  const fetchMock = vi.fn<typeof fetch>(async () => {
    const next = queue.length > 1 ? queue.shift()! : queue[0];
    if (next instanceof Error) throw next;
    return next.clone();
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

beforeEach(() => capabilitiesStore.reset());

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("capabilitiesStore", () => {
  it("is unknown until the server answers, so nothing optional is offered", () => {
    expect(capabilitiesStore.get()).toBeNull();
  });

  it("asks once, shares the answer and tells subscribers", async () => {
    const fetchMock = stubFetch(answer({ voice: true, images: false }));
    const listener = vi.fn();
    capabilitiesStore.subscribe(listener);

    await Promise.all([capabilitiesStore.load(), capabilitiesStore.load()]);
    await capabilitiesStore.load();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe("/api/capabilities");
    expect(fetchMock.mock.calls[0][1]).toMatchObject({ cache: "no-store" });
    expect(capabilitiesStore.get()).toEqual({ voice: true, images: false });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("turns on only what the server says is exactly true", async () => {
    stubFetch(answer({ voice: "yes", images: 1 }));
    await capabilitiesStore.load();
    expect(capabilitiesStore.get()).toEqual({ voice: false, images: false });
  });

  it("stops telling a subscriber who has left", async () => {
    stubFetch(answer({ voice: true, images: true }));
    const listener = vi.fn();
    capabilitiesStore.subscribe(listener)();
    await capabilitiesStore.load();
    expect(listener).not.toHaveBeenCalled();
  });

  it("stays unknown after a failed answer, and the next caller tries again", async () => {
    const fetchMock = stubFetch(answer({}, 500), answer({ voice: true, images: true }));

    await capabilitiesStore.load();
    expect(capabilitiesStore.get()).toBeNull();

    await capabilitiesStore.load();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(capabilitiesStore.get()).toEqual({ voice: true, images: true });
  });

  it("stays unknown when the network fails", async () => {
    stubFetch(new TypeError("fetch failed"));
    await capabilitiesStore.load();
    expect(capabilitiesStore.get()).toBeNull();
  });
});
