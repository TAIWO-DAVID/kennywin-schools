/**
 * Assignment Rules Engine
 * 
 * Centralized business logic for all assignment operations.
 * Provides:
 * - Validation before operations
 * - Diff-based updates (not delete + insert)
 * - Safe cascading deletes
 * - Consistent payload building
 */

export interface AssignmentDiff {
  toAdd: string[] // subject IDs to add
  toRemove: string[] // subject IDs to remove
  toKeep: string[] // subject IDs to keep
}

export interface AssignmentPayload {
  teacher_id: string
  class_id: number
  subject_id: string
  session_id: string
}

export interface TeacherRemovalCascade {
  classesToClear: number[] // class IDs where teacher was class_teacher_id
  assignmentsToDelete: {
    teacher_id: string
    class_id?: number
  }
}

/**
 * Assignment Rules - Centralized business logic layer
 */
export const assignmentRules = {
  /**
   * Validate assignment before creating
   */
  validateAssignment(
    teacherId: string,
    classId: number,
    subjectId: string
  ): { valid: boolean; error?: string } {
    if (!teacherId || teacherId.trim() === '') {
      return { valid: false, error: 'Teacher ID is required' }
    }
    if (!classId || classId <= 0) {
      return { valid: false, error: 'Valid class ID is required' }
    }
    if (!subjectId || subjectId.trim() === '') {
      return { valid: false, error: 'Subject ID is required' }
    }
    return { valid: true }
  },

  /**
   * Validate class teacher before assignment
   */
  validateClassTeacher(
    classId: number,
    teacherId: string
  ): { valid: boolean; error?: string } {
    if (!classId || classId <= 0) {
      return { valid: false, error: 'Valid class ID is required' }
    }
    if (!teacherId || teacherId.trim() === '') {
      return { valid: false, error: 'Teacher ID is required' }
    }
    return { valid: true }
  },

  /**
   * Core diff engine - computes what needs to be added/removed/kept
   * This is the key to problem #1: proper diffing instead of delete + insert
   */
  diffAssignments(
    existingSubjectIds: string[],
    requestedSubjectIds: string[]
  ): AssignmentDiff {
    const toAdd = requestedSubjectIds.filter(
      (id) => !existingSubjectIds.includes(id)
    )

    const toRemove = existingSubjectIds.filter(
      (id) => !requestedSubjectIds.includes(id)
    )

    const toKeep = existingSubjectIds.filter(
      (id) => requestedSubjectIds.includes(id)
    )

    return { toAdd, toRemove, toKeep }
  },

  /**
   * Build safe assignment payload for insert
   */
  buildAssignmentPayload(
    teacherId: string,
    classId: number,
    subjectId: string,
    sessionId: string
  ): AssignmentPayload {
    return {
      teacher_id: teacherId,
      class_id: classId,
      subject_id: subjectId,
      session_id: sessionId,
    }
  },

  /**
   * Get cascading delete operations when a teacher is removed
   * This is the key to problem #2: ensuring referential integrity
   */
  getTeacherRemovalCascade(
    teacherId: string,
    classesWithTeacher: number[]
  ): TeacherRemovalCascade {
    return {
      classesToClear: classesWithTeacher,
      assignmentsToDelete: {
        teacher_id: teacherId,
      },
    }
  },

  /**
   * Check if an assignment would create a duplicate
   */
  isDuplicate(
    teacherId: string,
    classId: number,
    subjectId: string,
    existingAssignments: Array<{
      teacher_id: string
      class_id: number
      subject_id: string
    }>
  ): boolean {
    return existingAssignments.some(
      (a) =>
        a.teacher_id === teacherId &&
        a.class_id === classId &&
        a.subject_id === subjectId
    )
  },

  /**
   * Safe update - returns what actually changed
   */
  computeUpdateSummary(diff: AssignmentDiff) {
    return {
      added: diff.toAdd.length,
      removed: diff.toRemove.length,
      unchanged: diff.toKeep.length,
      totalChanged: diff.toAdd.length + diff.toRemove.length,
    }
  },
}
