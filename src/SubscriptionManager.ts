
export default class SubscriptionManager {
  itemToSubscriptionMap: Map<string, (() => void)[]>;
  constructor() {
    this.itemToSubscriptionMap = new Map();
  }
  subscribe(item: string, fn: () => void) {
    this.unsubscribe(item, fn);
    let fns = this.itemToSubscriptionMap.get(item);
    if (!fns) {
      fns = [];
      this.itemToSubscriptionMap.set(item, fns);
    }
    fns.push(fn);
  }
  unsubscribe(item: string, fn: () => void): void {
    const fns = this.itemToSubscriptionMap.get(item);
    if (fns) {
      const ndx = fns.indexOf(fn);
      if (ndx >= 0) {
        fns.splice(ndx, 1);
        if (fns.length === 0) {
          this.itemToSubscriptionMap.delete(item);
        }
      }
    }
  }
  notify(item: string): void {
    const fns = this.itemToSubscriptionMap.get(item);
    if (fns) {
      for (const fn of fns.slice()) {
        fn();
      }
    }
  }
}