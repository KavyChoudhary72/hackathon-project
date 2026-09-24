# FrameSequence Assets & Manifest Specification

Place frame sequences in these directories:
- `/public/sequence/desktop/`: 1920x1080 WebP frames (`frame_0001.webp`, etc.)
- `/public/sequence/mobile/`: 720x1280 or 1080x1920 WebP frames for mobile devices

## Manifest Format (`manifest.json`)
```json
{
  "frameCount": 120,
  "width": 1920,
  "height": 1080,
  "pattern": "frame_{0000}.webp",
  "fps": 30,
  "chapters": [
    { "id": "c1", "start": 0.0, "end": 0.12, "title": "Hero" },
    { "id": "c2", "start": 0.12, "end": 0.25, "title": "The Problem" },
    { "id": "c3", "start": 0.25, "end": 0.40, "title": "The Match" },
    { "id": "c4", "start": 0.40, "end": 0.55, "title": "The Move" },
    { "id": "c5", "start": 0.55, "end": 0.70, "title": "No Waste Cascade" },
    { "id": "c6", "start": 0.70, "end": 0.82, "title": "Proof of Impact" },
    { "id": "c7", "start": 0.82, "end": 0.92, "title": "Rewards & CSR" },
    { "id": "c8", "start": 0.92, "end": 1.00, "title": "Join Movement" }
  ]
}
```

When no manifest is found, `<FrameSequence>` gracefully runs in **Placeholder Mode**, rendering an animated gradient mesh and scroll HUD.
