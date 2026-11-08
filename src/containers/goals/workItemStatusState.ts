export function workItemStatusStateKey(
  goalId: string,
  workItemId: string,
): string {
  return `${goalId}::${workItemId}`;
}
