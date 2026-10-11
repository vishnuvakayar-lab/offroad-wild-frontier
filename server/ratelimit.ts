/** Token bucket: `cap` burst, refilled at `rate` tokens per second. */
export class Bucket {
  private tokens: number; private at = Date.now();
  constructor(public cap: number, public rate: number) { this.tokens = cap; }
  take(n = 1) {
    const now = Date.now(); this.tokens = Math.min(this.cap, this.tokens + ((now - this.at) / 1000) * this.rate); this.at = now;
    if (this.tokens < n) return false; this.tokens -= n; return true;
  }
}
/** One bucket per key (IP), with periodic cleanup. */
export class KeyedBuckets {
  private m = new Map<string, Bucket>();
  constructor(private cap: number, private rate: number) { setInterval(() => { if (this.m.size > 5000) this.m.clear(); }, 60000).unref(); }
  take(key: string, n = 1) { let b = this.m.get(key); if (!b) { b = new Bucket(this.cap, this.rate); this.m.set(key, b); } return b.take(n); }
}
