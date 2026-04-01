# Game Development Quality Gates & Checklists

## Frame Performance Checklist
- [ ] Frame time stays under 16.67ms (60fps) in typical scenes
- [ ] No frame time spikes above 33ms (no dropped frames below 30fps)
- [ ] Memory allocations during gameplay are zero (object pooling)
- [ ] Garbage collection pauses are under 2ms
- [ ] Draw calls are batched where possible
- [ ] Only visible objects are processed (frustum culling, spatial partitioning)

## Memory Management Checklist
- [ ] Total memory budget is defined and tracked
- [ ] Asset loading is async and doesn't block the game loop
- [ ] Object pools are used for bullets, particles, enemies, etc.
- [ ] Textures use appropriate compression and mipmaps
- [ ] Memory leaks are checked (objects properly returned to pools)
- [ ] Scene transitions clean up all scene-specific resources

## Input Handling Checklist
- [ ] Input is polled once per frame (not per-object)
- [ ] Input buffering prevents missed inputs during lag spikes
- [ ] Dead zones are configured for analog sticks
- [ ] Key rebinding is supported
- [ ] Input works across all target platforms

## Multiplayer Considerations (if applicable)
- [ ] Client-server architecture (not peer-to-peer for competitive)
- [ ] Server is authoritative for game state
- [ ] Client-side prediction with server reconciliation
- [ ] Network messages are compact (bitpacking, delta compression)
- [ ] Lag compensation (interpolation, extrapolation)
