# Game Development Anti-Patterns

### 🚫 Allocation in the Game Loop
`new Bullet()` every time the player shoots. Use object pools. Pre-allocate during initialization.

### 🚫 Update Everything Every Frame
Processing every entity regardless of relevance. Use spatial partitioning (quadtrees, octrees) and only update entities near the action.

### 🚫 Physics on Variable Timestep
`position += velocity * deltaTime` with variable deltaTime causes non-deterministic physics. Use fixed timestep with accumulator.

### 🚫 Deep Inheritance Hierarchies
`Entity → Character → Player → MagePlayer → FireMagePlayer`. Prefer composition (ECS) over deep inheritance trees.

### 🚫 String-Based Event Systems
`emitter.emit("player_died")` with string matching. Use typed events or enum-based systems for compile-time safety.

### 🚫 Synchronous Asset Loading
Loading textures or audio files synchronously during gameplay causes frame hitches. Always load asynchronously with progress indicators.

### 🚫 Ignoring GC Pressure
Creating temporary objects, arrays, or strings in the hot loop. In garbage-collected languages, this causes periodic freezes.

### 🚫 Per-Object Draw Calls
Rendering each object with its own draw call. Batch objects by material, use instancing, atlas textures.
