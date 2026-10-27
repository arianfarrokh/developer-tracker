"use client"

import { Progress, ProgressValue } from "@/components/ui/progress"

export function CustomProgress({ value }: { value: number }) {
    return (
        <Progress
            value={value}
            className="flex w-full flex-nowrap items-center gap-2 **:data-[slot=progress-track]:h-2 **:data-[slot=progress-track]:min-w-0 **:data-[slot=progress-track]:flex-1 **:data-[slot=progress-value]:ms-0 **:data-[slot=progress-value]:shrink-0 **:data-[slot=progress-value]:text-xs **:data-[slot=progress-value]:text-muted-foreground"
        >
            <ProgressValue />
        </Progress>
    )
}
