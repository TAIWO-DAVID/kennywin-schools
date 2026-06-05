
//Map stream codes to Tailwind badge colors
 export function getStreamBadgeColor(stream: string): string {
  switch (stream.toLowerCase()) {
    case "science":
      return "bg-green-100 text-green-800";
    case "arts":
      return "bg-purple-100 text-purple-800";
    case "commerce":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

//Map grade letters/numbers to Tailwind colors
 export function getGradeColor(grade: string): string {
  switch (grade.toUpperCase()) {
    case "A":
      return "text-green-600 font-bold";
    case "B":
      return "text-blue-600 font-semibold";
    case "C":
      return "text-yellow-600";
    case "D":
      return "text-orange-600";
    case "F":
      return "text-red-600 font-bold";
    default:
      return "text-gray-600";
  }
}