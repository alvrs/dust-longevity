import { Hex } from "viem";
import { identity, number, useSqlQuery } from "./useSqlQuery";
import { decodePlayer, encodePlayer } from "@dust/world/internal";
import { usePlayerMetrics } from "./usePlayerMetrics";

type LongestAlive = {
  player: Hex;
  deaths: number;
  aliveDays: number;
  lastUpdated: number | undefined;
};

export function useLongestAlive(): LongestAlive[] | undefined {
  // TODO: infer type from the format param
  const rebornQueryResult = useSqlQuery<
    {
      player: Hex;
      deaths: number;
      lastDiedAt: number;
      lastUpdatedTime: number;
      energy: number;
    }[][]
  >({
    sqlQuery:
      'SELECT "player", "deaths", "lastDiedAt", "lastUpdatedTime", "energy" FROM "Death", "Energy" WHERE "player" = "entityId" ORDER BY "lastDiedAt";',
    format: {
      player: (value) => decodePlayer(value as Hex),
      deaths: number,
      lastDiedAt: number,
      lastUpdatedTime: number,
      energy: number,
    },
  });

  const allPlayers = usePlayerMetrics();

  const playersDiedOnceOrMore = new Set(
    rebornQueryResult.data?.[0]?.map((row) => row.player) ?? []
  );
  const rebornPlayers = (rebornQueryResult.data?.[0] ?? []).filter(
    (p) => p.energy > 0
  );

  const neverDiedPlayers =
    allPlayers.data
      ?.filter((player) => !playersDiedOnceOrMore.has(player.address))
      .sort((a, b) => a.firstSeenAt - b.firstSeenAt) ?? [];

  const lastUpdatedQuery =
    neverDiedPlayers.length > 0
      ? [
          `SELECT "entityId", "lastUpdatedTime" FROM "Energy" WHERE ${neverDiedPlayers.map((p) => `"entityId" = '${encodePlayer(p.address)}'`).join(" OR ")};`,
        ]
      : [];
  const neverDiedPlayersLastUpdated = useSqlQuery<
    {
      entityId: Hex;
      lastUpdatedTime: number;
    }[][]
  >({
    sqlQuery: lastUpdatedQuery,
    format: {
      entityId: identity,
      lastUpdatedTime: number,
    },
  });

  const neverDiedPlayersLastUpdatedByAccount = new Map(
    neverDiedPlayersLastUpdated.data?.[0]?.map((row) => [
      decodePlayer(row.entityId),
      row.lastUpdatedTime,
    ]) ?? []
  );

  const alivePlayers: LongestAlive[] = [
    ...neverDiedPlayers.map((p) => ({
      player: p.address,
      deaths: 0,
      aliveDays: Math.floor(
        (Date.now() / 1000 - p.firstSeenAt) / (60 * 60 * 24)
      ),
      lastUpdated: neverDiedPlayersLastUpdatedByAccount.get(p.address),
    })),
    ...rebornPlayers.map((p) => ({
      player: p.player,
      deaths: p.deaths,
      aliveDays: Math.floor(
        (Date.now() / 1000 - p.lastDiedAt) / (60 * 60 * 24)
      ),
      lastUpdated: p.lastUpdatedTime,
    })),
  ].sort((a, b) => b.aliveDays - a.aliveDays);

  if (
    rebornQueryResult.isLoading ||
    allPlayers.isLoading ||
    neverDiedPlayersLastUpdated.isLoading
  ) {
    return;
  }

  return alivePlayers;
}
