/**
 * Illustrative Voise AdServer auction (not live data). Rules follow the 23 May 2026
 * architecture walkthrough: the timeout (TMax) closes the auction, bids under the
 * floor and bids from blocked advertiser domains are rejected, and the highest
 * eligible bid wins. No clearing price is shown: that depends on the pricing model.
 */
export type Unit = { label: string; floor: number; tmax: number };
export type Bid = { name: string; latency: number; cpm: number; blocked: boolean };
export type Outcome = 'timeout' | 'blocked' | 'floor' | 'bid';

export const UNITS: Unit[] = [
  { label: 'RTB · Web display', floor: 1.2, tmax: 300 },
  { label: 'RTB · In-app interstitial', floor: 2.5, tmax: 300 },
  { label: 'VAST · Web video', floor: 4, tmax: 400 },
  { label: 'VAST · CTV pre-roll', floor: 8, tmax: 500 },
];
const PARTNERS = ['A', 'B', 'C', 'D', 'E'].map((l) => `Demand partner ${l}`);

export const OUTCOME_LABEL: Record<Exclude<Outcome, 'bid'>, string> = { timeout: 'Timed out', blocked: 'Blocked domain', floor: 'Below floor' };

export const outcome = (b: Bid, u: Unit): Outcome =>
  b.latency > u.tmax ? 'timeout' : b.blocked ? 'blocked' : b.cpm < u.floor ? 'floor' : 'bid';

export const winner = (bids: Bid[], u: Unit) =>
  bids.filter((b) => outcome(b, u) === 'bid').sort((a, b) => b.cpm - a.cpm)[0];

/** Outcome counts among the bids answered by simulated time t (timeouts surface at the timeout). */
export function tally(bids: Bid[], u: Unit, t = Infinity): Record<Outcome, number> {
  const c: Record<Outcome, number> = { bid: 0, timeout: 0, floor: 0, blocked: 0 };
  for (const b of bids) if (t >= Math.min(b.latency, u.tmax)) c[outcome(b, u)]++;
  return c;
}

/** The auction closes when every partner has answered, or at the timeout. */
export const closesAt = (bids: Bid[], u: Unit) => Math.max(...bids.map((b) => Math.min(b.latency, u.tmax)));

export function makeAuction(rand = Math.random): { unit: Unit; bids: Bid[] } {
  const unit = UNITS[Math.floor(rand() * UNITS.length)];
  const blocked = rand() < 0.6 ? Math.floor(rand() * PARTNERS.length) : -1;
  const bids = PARTNERS.map((name, i) => ({
    name,
    latency: Math.round(30 + rand() * unit.tmax * 1.25),
    cpm: Math.round(unit.floor * (0.55 + rand() * 1.9) * 100) / 100,
    blocked: i === blocked,
  }));
  return { unit, bids };
}

/** Fixed example shown before the script runs (and to visitors without JavaScript). */
export const EXAMPLE: { unit: Unit; bids: Bid[] } = {
  unit: UNITS[2],
  bids: [
    { name: PARTNERS[0], latency: 140, cpm: 5.2, blocked: false },
    { name: PARTNERS[1], latency: 460, cpm: 7.9, blocked: false },
    { name: PARTNERS[2], latency: 210, cpm: 6.4, blocked: true },
    { name: PARTNERS[3], latency: 95, cpm: 3.1, blocked: false },
    { name: PARTNERS[4], latency: 260, cpm: 5.85, blocked: false },
  ],
};
