import { Class } from "@/types/class"

export const LEVEL_ORDER = [
  "Creche",
  "KG",
  "Nursery",
  "Primary",
  "JSS",
  "SSS",
]

export type ClassLike = {
  level?: string | null
  grade?: number | null
  stream?: string | null
}

export const getClassName = (cls?: Class | null): string => {
  if (!cls) return "N/A";

  const { level, grade, stream } = cls;

  if (!level && !grade) return "N/A";

  const base = [level, grade].filter(Boolean).join(" ");

  return stream ? `${base} ${stream}` : base;
};

export const sortClasses = (classes: any[]) => {
  return classes.sort((a, b) => {
    const levelA = LEVEL_ORDER.indexOf(a.level)
    const levelB = LEVEL_ORDER.indexOf(b.level)

    if (levelA !== levelB) return levelA - levelB
    if ((a.grade ?? 0) !== (b.grade ?? 0))
      return (a.grade ?? 0) - (b.grade ?? 0)

    return (a.stream ?? "").localeCompare(b.stream ?? "")
  })
}