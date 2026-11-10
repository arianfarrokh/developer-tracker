/** Index-scoped key so rows never share state when API ids are missing or duplicated. */
export function workItemStatusStateKey(
  goalId: string,
  workItemIndex: number,
): string {
  return `${goalId}::${workItemIndex}`;
}
