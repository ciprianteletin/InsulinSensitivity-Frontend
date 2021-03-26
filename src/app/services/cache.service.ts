import {Injectable} from '@angular/core';

/**
 * Class responsible for managing caching operations, where as cache we use the localStorage.
 * Each method is generic, so that this cache is not bounded to any data type.
 */
@Injectable({providedIn: 'root'})
export class CacheService {
  private usedKeys = new Set<string>();

  public saveItem<T>(key: string, item: T): void {
    localStorage.setItem(key, JSON.stringify(item));
    this.usedKeys.add(key);
  }

  public checkIfPresent(key: string): boolean {
    return this.usedKeys.has(key);
  }

  public getItem<T>(key: string): T {
    return JSON.parse(localStorage.getItem(key));
  }

  public removeItem(key: string): void {
    localStorage.removeItem(key);
    this.usedKeys.delete(key);
  }

  /**
   * As the local storage contains other data than just the one from the cache,
   * we want to delete only data inserted via this service.
   */
  public clearCache(): void {
    this.usedKeys.forEach((key => {
      localStorage.removeItem(key);
    }));
    this.usedKeys.clear();
  }
}
