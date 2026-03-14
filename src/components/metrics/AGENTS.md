# Metrics & Loading Patterns

## Progressive Loading
Instead of using Skeletons for numeric metrics, we use **Progressive Loading**:
1. **Component**: Use Client Components with tRPC hooks.
2. **Initial State**: Default values should be `0`.
3. **Animation**: Use `number-flow` to animate the transition from `0` to the actual value.
4. **UX Goal**: Avoid layout shifts and provide a sense of "live" data loading.

## Example
```tsx
const { data } = api.getMetrics.useQuery();
const value = data?.value ?? 0;
return <NumberFlow value={value} />;
```
