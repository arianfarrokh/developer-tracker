export const getMutationErrorMessage = (
    errors:
        | Array<{ message?: string | null } | null | undefined>
        | null
        | undefined,
): string | null => {
    if (!errors?.length) return null;
    const parts = errors
        .map((e) => e?.message?.trim())
        .filter((m): m is string => Boolean(m));
    return parts.length ? parts.join("، ") : null;
};