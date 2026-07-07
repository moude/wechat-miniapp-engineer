# Component Rules

Use this when creating or changing custom components, component contracts, slots, behaviors, relations, or shared UI.

## Contract

- Define `properties` with explicit types and defaults. Treat all external data as optional until validated.
- Keep internal mutable state in `data`; do not mutate `properties` directly.
- Emit events with stable names and documented payload shapes. Use `triggerEvent` options deliberately for bubbling/composed behavior.
- Keep parent-child contracts narrow. Prefer events and properties over reaching into component instances.

## Data And Rendering

- Use stable keys in `wx:for`. Avoid index keys for reorderable or editable lists.
- Avoid large computed objects in WXML. Precompute display fields before `setData`.
- Avoid `hidden` for very large inactive DOM trees when `wx:if` is more appropriate; avoid `wx:if` thrashing for simple toggles.
- Keep slot fallback content intentional. Empty slots should not collapse layout unexpectedly.

## Behaviors And Relations

- Use `behaviors` for shared component behavior only when there is real reuse. Keep behavior data/method names collision-safe.
- Use `relations` for tightly coupled component families, not casual parent lookup.
- Keep relation callbacks tolerant of creation order and detached nodes.

## Styling

- Prefer component-scoped styles. Use `styleIsolation` consciously when overriding third-party or global styles.
- Do not rely on page-level styles leaking into components unless the project explicitly uses that style model.
- Preserve design tokens or CSS variables already used by the project.

## Testing

- For pure component logic, prefer `miniprogram-simulate`.
- For interaction and layout behavior, validate through DevTools/automator screenshots.
- For framework components, test source-level behavior and generated miniapp behavior when the output differs materially.

## Red Flags

- Direct property mutation.
- Unbounded observer loops.
- Components that require parent instance mutation to work.
- Missing `detached` cleanup.
- Layout that depends on a single device width.
- Events whose payload shape changes per call path.
