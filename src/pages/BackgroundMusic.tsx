// Tipos mínimos de la YouTube IFrame API (sin @types/youtube)
interface YTPlayerVars {
  autoplay?: 0 | 1;
  mute?: 0 | 1;
  controls?: 0 | 1;
  loop?: 0 | 1;
  start?: number;
}

interface YTPlayerEvent {
  target: YTPlayer;
}

interface YTPlayerOptions {
  videoId: string;
  playerVars?: YTPlayerVars;
  events?: {
    onReady?: (e: YTPlayerEvent) => void;
    onStateChange?: (e: YTPlayerEvent) => void;
    onError?: (e: YTPlayerEvent) => void;
  };
}

interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  stopVideo(): void;
  destroy(): void;
  unMute(): void;
  mute(): void;
  setVolume(volume: number): void;
  getVolume(): number;
  isMuted(): boolean;
}

interface YTPlayerConstructor {
  new (container: HTMLElement, options: YTPlayerOptions): YTPlayer;
}

interface YTNamespace {
  Player: YTPlayerConstructor;
}

declare global {
  interface Window {
    YT: YTNamespace;
    onYouTubeIframeAPIReady: () => void;
  }
}

// ─────────────────────────────────────────────

const VIDEO_ID = "QrgLPhfjvEk";

function initPlayer(container: HTMLDivElement): YTPlayer {
  return new window.YT.Player(container, {
    videoId: VIDEO_ID,
    playerVars: {
      autoplay: 1,
      mute: 1,
      controls: 0,
      loop: 1,
      start: 137,
    },
    events: {
      onReady: (e: YTPlayerEvent): void => {
        e.target.playVideo();

        setTimeout((): void => {
          e.target.unMute();
          e.target.setVolume(50);
        }, 500);
      },
    },
  });
}

function mountBackgroundMusic(): () => void {
  const container = document.createElement("div");

  container.style.position = "absolute";
  container.style.width = "1px";
  container.style.height = "1px";
  container.style.opacity = "0";
  container.style.pointerEvents = "none";

  document.body.appendChild(container);

  let player: YTPlayer | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;

  function setup(): void {
    timer = setTimeout((): void => {
      player = initPlayer(container);
    }, 0);
  }

  if (window.YT && window.YT.Player) {
    setup();
  } else {
    const prevCallback = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = (): void => {
      prevCallback?.();
      setup();
    };

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);
  }

  return (): void => {
    if (timer !== null) clearTimeout(timer);
    player?.destroy();
    player = null;
    container.remove();
  };
}

export { mountBackgroundMusic };
