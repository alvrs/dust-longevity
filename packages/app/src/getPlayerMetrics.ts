import { getAddress, Hex } from "viem";
import { env } from "./env";

type PlayerMetrics = Array<{
  address: Hex;
  firstSeenAt: number;
  lastSeenAt: number;
  actions: number;
}>;

export async function getPlayerMetrics(): Promise<PlayerMetrics> {
  return fetch(env.VITE_METRICS_API_URL + "/metrics/players")
    .then((r) => r.json())
    .then((r) =>
      r.map(
        (row: {
          player_address: Hex;
          actions_count: string;
          first_activity: string;
          last_activity: string;
        }) => ({
          address: getAddress(row.player_address),
          firstSeenAt: Number(row.first_activity),
          lastSeenAt: Number(row.last_activity),
          actions: Number(row.actions_count),
        })
      )
    );
}
