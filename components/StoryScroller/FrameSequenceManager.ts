import { FRAME_SEQUENCE, FrameData, TOTAL_FRAMES } from "@/lib/frameSequence";

export class FrameSequenceManager {
  private frames: FrameData[];
  private images: (HTMLImageElement | null)[];
  private loadedCount: number = 0;
  private isInitialReady: boolean = false;
  private isAllReady: boolean = false;
  private lastDrawnIndex: number = -1;
  private lastCanvasWidth: number = 0;
  private lastCanvasHeight: number = 0;
  private abortController: AbortController | null = null;
  private onProgressCallbacks: Set<(progress: number, count: number) => void> = new Set();
  private onInitialReadyCallbacks: Set<() => void> = new Set();
  private onAllReadyCallbacks: Set<() => void> = new Set();

  constructor() {
    this.frames = FRAME_SEQUENCE;
    this.images = new Array(this.frames.length).fill(null);
  }

  public getFrameCount(): number {
    return this.frames.length;
  }

  public getLoadedCount(): number {
    return this.loadedCount;
  }

  public isReady(): boolean {
    return this.isInitialReady;
  }

  public isFullyLoaded(): boolean {
    return this.isAllReady;
  }

  public onProgress(cb: (progress: number, count: number) => void): () => void {
    this.onProgressCallbacks.add(cb);
    return () => this.onProgressCallbacks.delete(cb);
  }

  public onInitialReady(cb: () => void): () => void {
    if (this.isInitialReady) {
      cb();
    } else {
      this.onInitialReadyCallbacks.add(cb);
    }
    return () => this.onInitialReadyCallbacks.delete(cb);
  }

  public onAllReady(cb: () => void): () => void {
    if (this.isAllReady) {
      cb();
    } else {
      this.onAllReadyCallbacks.add(cb);
    }
    return () => this.onAllReadyCallbacks.delete(cb);
  }

  /**
   * Preload strategy:
   * 1. Prioritize initial 20 frames so first frame renders immediately without waiting.
   * 2. Concurrently stream remaining frames with limited concurrency pool to saturate network without choking.
   */
  public async preloadFrames(): Promise<void> {
    if (typeof window === "undefined") return;
    this.abortController = new AbortController();

    const initialBatchSize = Math.min(24, this.frames.length);

    // Phase 1: High-priority immediate initial frames
    const initialPromises: Promise<void>[] = [];
    for (let i = 0; i < initialBatchSize; i++) {
      initialPromises.push(this.loadImage(i));
    }

    await Promise.race([
      Promise.all(initialPromises),
      new Promise<void>((resolve) => {
        // Fallback: If 8 frames are ready, declare initial ready
        const check = () => {
          if (this.loadedCount >= 8) resolve();
          else setTimeout(check, 50);
        };
        check();
      }),
    ]);

    this.isInitialReady = true;
    this.onInitialReadyCallbacks.forEach((cb) => cb());

    // Phase 2: Background concurrent stream of all remaining frames
    this.loadRemainingFrames(initialBatchSize);
  }

  private async loadRemainingFrames(startIndex: number): Promise<void> {
    const concurrency = 6;
    let nextIndex = startIndex;

    const worker = async () => {
      while (nextIndex < this.frames.length) {
        if (this.abortController?.signal.aborted) break;
        const indexToLoad = nextIndex++;
        await this.loadImage(indexToLoad);
      }
    };

    const pool = Array.from({ length: concurrency }, () => worker());
    await Promise.all(pool);

    this.isAllReady = true;
    this.onAllReadyCallbacks.forEach((cb) => cb());
  }

  private loadImage(index: number): Promise<void> {
    if (this.images[index]) return Promise.resolve();

    return new Promise<void>((resolve) => {
      const img = new Image();
      img.src = this.frames[index].url;

      const finish = () => {
        this.images[index] = img;
        this.loadedCount++;
        const percent = Math.round((this.loadedCount / this.frames.length) * 100);
        this.onProgressCallbacks.forEach((cb) => cb(percent, this.loadedCount));
        resolve();
      };

      if (img.decode) {
        img
          .decode()
          .then(finish)
          .catch(() => {
            img.onload = finish;
            img.onerror = () => {
              // Silently resolve so loading sequence is never blocked by a transient asset error
              resolve();
            };
          });
      } else {
        img.onload = finish;
        img.onerror = () => resolve();
      }
    });
  }

  /**
   * Find nearest loaded frame if current frame is still streaming in,
   * guaranteeing ZERO white flash or blank screen ever.
   */
  public getFrame(index: number): HTMLImageElement | null {
    if (index < 0 || index >= this.frames.length) return null;
    if (this.images[index]) return this.images[index];

    // Search outwards for nearest loaded frame
    let offset = 1;
    while (offset < this.frames.length) {
      if (index - offset >= 0 && this.images[index - offset]) {
        return this.images[index - offset];
      }
      if (index + offset < this.frames.length && this.images[index + offset]) {
        return this.images[index + offset];
      }
      offset++;
    }

    return null;
  }

  /**
   * Hardware-accelerated canvas draw with aspect-ratio cover crop.
   * Avoids redraw if same frame index and dimensions.
   */
  public drawFrame(
    canvas: HTMLCanvasElement,
    frameIndex: number,
    forced: boolean = false
  ): boolean {
    if (!canvas) return false;

    const clampedIndex = Math.max(0, Math.min(this.frames.length - 1, frameIndex));

    if (
      !forced &&
      clampedIndex === this.lastDrawnIndex &&
      canvas.width === this.lastCanvasWidth &&
      canvas.height === this.lastCanvasHeight
    ) {
      return false; // Skip redundant draw
    }

    const img = this.getFrame(clampedIndex);
    if (!img || !img.naturalWidth) return false;

    const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
    if (!ctx) return false;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    // Cover math
    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) * 0.5;
    const dy = (ch - dh) * 0.5;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, dx, dy, dw, dh);

    this.lastDrawnIndex = clampedIndex;
    this.lastCanvasWidth = cw;
    this.lastCanvasHeight = ch;

    return true;
  }

  public destroy(): void {
    if (this.abortController) {
      this.abortController.abort();
    }
    this.onProgressCallbacks.clear();
    this.onInitialReadyCallbacks.clear();
    this.onAllReadyCallbacks.clear();
    this.images = [];
  }
}
