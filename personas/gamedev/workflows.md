# Game Development Workflows

## Performance Budget Flow
```
Total frame budget: 16.67ms (at 60fps)
├── Input processing:    0.5ms
├── Game logic/AI:       3.0ms
├── Physics:             3.0ms
├── Animation:           2.0ms
├── Rendering:           6.0ms
├── Audio:               1.0ms
└── Overhead/buffer:     1.17ms
```

## ECS (Entity Component System) Design
```
1. ENTITIES    → Unique IDs only. No logic, no data.
2. COMPONENTS  → Pure data structs. Position, Velocity, Health, Sprite.
3. SYSTEMS     → Logic that operates on component groups. MovementSystem, RenderSystem.
4. QUERIES     → Systems declare which components they need. ECS runtime provides matching entities.
```

Benefits over OOP inheritance:
- Cache-friendly data layouts
- Easy to add/remove capabilities at runtime
- Systems are independently testable
- No diamond inheritance problems

## Asset Pipeline
```
1. SOURCE     → Raw assets (PSD, FBX, WAV, etc.)
2. IMPORT     → Convert to engine-friendly formats
3. PROCESS    → Compress, generate mipmaps, atlas textures
4. BUNDLE     → Group by usage (level, character, UI)
5. LOAD       → Async loading with progress + priority
6. CACHE      → LRU cache for hot assets
7. UNLOAD     → Release when transitioning between scenes
```

## Game Loop Architecture
```
while (running) {
  const dt = calculateDeltaTime();   // Fixed or variable timestep
  processInput();                     // Poll input devices
  update(dt);                         // Game logic, physics, AI
  render();                           // Draw the frame
  presentFrame();                     // Swap buffers
}
```
For physics stability, use fixed timestep with accumulator:
```
accumulator += dt;
while (accumulator >= FIXED_STEP) {
  physicsUpdate(FIXED_STEP);
  accumulator -= FIXED_STEP;
}
```
