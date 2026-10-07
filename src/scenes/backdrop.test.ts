import { describe, it, expect } from "vitest";
import { sceneMedia, sceneMediaBase, sceneMediaOrigin } from "./backdrop";
import { getScene } from "./index";

describe("sceneMediaBase", () => {
  it("is null when unset, empty or not a URL", () => {
    expect(sceneMediaBase("")).toBeNull();
    expect(sceneMediaBase("not a url")).toBeNull();
  });

  it("only accepts https", () => {
    expect(sceneMediaBase("http://cdn.example.com/scenes")).toBeNull();
    expect(sceneMediaBase("javascript:alert(1)")).toBeNull();
    expect(sceneMediaBase("data:text/html,hi")).toBeNull();
    expect(sceneMediaBase("https://cdn.example.com/scenes")?.origin).toBe("https://cdn.example.com");
  });
});

describe("sceneMediaOrigin", () => {
  it("returns just the origin for the CSP", () => {
    expect(sceneMediaOrigin("https://cdn.example.com/a/b/c")).toBe("https://cdn.example.com");
    expect(sceneMediaOrigin("https://cdn.example.com:8443/x")).toBe("https://cdn.example.com:8443");
    expect(sceneMediaOrigin("http://cdn.example.com")).toBeNull();
    expect(sceneMediaOrigin("")).toBeNull();
  });
});

describe("sceneMedia", () => {
  const pirate = getScene("pirate");

  it("resolves the video and poster against the base, with or without a trailing slash", () => {
    for (const base of ["https://cdn.example.com/scenes", "https://cdn.example.com/scenes/"]) {
      expect(sceneMedia(pirate, base)).toEqual({
        video: "https://cdn.example.com/scenes/pirate.mp4",
        poster: "https://cdn.example.com/scenes/pirate.jpg",
        opacity: pirate.backdrop?.opacity,
      });
    }
  });

  it("is null without a usable base, so nothing is requested", () => {
    expect(sceneMedia(pirate, "")).toBeNull();
    expect(sceneMedia(pirate, "http://cdn.example.com/scenes")).toBeNull();
  });

  it("is null for a scene without a backdrop", () => {
    expect(sceneMedia(getScene("office"), "https://cdn.example.com/scenes")).toBeNull();
    expect(sceneMedia(getScene("classic"), "https://cdn.example.com/scenes")).toBeNull();
  });

  it("makes no request in a default install", () => {
    // NEXT_PUBLIC_SCENE_MEDIA_BASE is not set in the test environment.
    for (const id of ["pirate", "bard", "surf", "vader", "yoda", "spiderman"] as const) {
      expect(sceneMedia(getScene(id))).toBeNull();
    }
  });
});
