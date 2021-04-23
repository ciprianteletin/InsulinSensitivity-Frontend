/**
 * Implementation which represents a pair of two items, using the power of generics to accomplish
 * the reusability of this class at maximum.
 */
export class Pair<T, V> {
  public first: T;
  public second: V;

  constructor(first: T, second: V) {
    this.first = first;
    this.second = second;
  }
}
