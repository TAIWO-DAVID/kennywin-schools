/**
 * Optimistic Update Utility
 * 
 * Handles immediate local state updates while async operations are in flight.
 * Automatically reverts on error.
 * 
 * Fixes problem #4: No optimistic consistency for class teacher updates
 */

import { useCallback } from 'react'

export interface OptimisticUpdateOptions<T> {
  onSuccess?: (result: T) => void
  onError?: (error: Error) => void
  onBeforeRevert?: () => void
}

/**
 * Hook for optimistic updates with auto-rollback
 */
export function useOptimisticUpdate() {
  /**
   * Execute an async operation with optimistic UI update
   * 
   * @param operation - Async function to execute
   * @param onOptimisticUpdate - Function to update UI immediately
   * @param onRevert - Function to revert UI on error
   * @param options - Callbacks for success/error
   */
  const applyOptimistic = useCallback(
    async <T,>(
      operation: () => Promise<T>,
      onOptimisticUpdate: () => void,
      onRevert: () => void,
      options?: OptimisticUpdateOptions<T>
    ): Promise<{ success: boolean; data?: T; error?: Error }> => {
      try {
        // 1. Update UI immediately (optimistic)
        onOptimisticUpdate()

        // 2. Execute the async operation
        const result = await operation()

        // 3. Success - keep the optimistic update
        options?.onSuccess?.(result)
        return { success: true, data: result }
      } catch (error) {
        // 4. Error - revert to previous state
        const err = error instanceof Error ? error : new Error(String(error))

        options?.onBeforeRevert?.()
        onRevert()
        options?.onError?.(err)

        return { success: false, error: err }
      }
    },
    []
  )

  return { applyOptimistic }
}

/**
 * Simpler variant for boolean toggles (common UI pattern)
 */
export function useOptimisticToggle(
  currentValue: boolean,
  onToggle: (newValue: boolean) => Promise<void>
) {
  const { applyOptimistic } = useOptimisticUpdate()

  const toggle = useCallback(
    async (onUpdateUI: (newValue: boolean) => void) => {
      const newValue = !currentValue

      return applyOptimistic(
        () => onToggle(newValue),
        () => onUpdateUI(newValue),
        () => onUpdateUI(currentValue)
      )
    },
    [currentValue, onToggle, applyOptimistic]
  )

  return { toggle }
}
