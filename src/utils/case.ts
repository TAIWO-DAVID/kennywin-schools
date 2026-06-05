// Change to camel case
export function toCamelCase(obj: Record<string, any>) {
  const newObj: Record<string, any> = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelKey = key.replace(/_([a-z])/g, (_, char) => char.toUpperCase())
      newObj[camelKey] = obj[key]
    }
  }
  return newObj
}