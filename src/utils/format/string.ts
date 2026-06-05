//Get initials from a full name
 export function getInitials(name?: string | null): string {
  if (!name || name.trim() === "") return "?"; // fallback placeholder

  const words = name.trim().split(" ");
  if (words.length === 1) {
    return words[0][0].toUpperCase();
  }
  return (
    words[0][0].toUpperCase() + words[words.length - 1][0].toUpperCase()
  );
}

// src/lib/utils.ts
export function getEducationalLevelDisplayName(level: string): string {
  switch (level) {
    case "primary":
      return "Primary School";
    case "secondary":
      return "Secondary School";
    case "tertiary":
      return "Tertiary Institution";
    default:
      return level; // fallback
  }
}

//Map stream codes to display names
export function getStreamDisplayName(stream: string): string {
  switch (stream.toLowerCase()) {
    case "science":
      return "Science";
    case "arts":
      return "Arts";
    case "commerce":
      return "Commerce";
    default:
      return stream;
  }
}
