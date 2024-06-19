/**
 * Assigns a property from one object to another object based on the provided key.
 *
 * @param target - The target object where the property will be assigned.
 * @param src - The source object from which the property will be retrieved.
 * @param key - The key of the property to be assigned.
 * @returns void
 */
export function assignProp<T>(target: T, src: T, key: keyof T) {
  target[key] = src[key]
}
