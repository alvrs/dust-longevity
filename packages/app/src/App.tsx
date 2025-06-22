import { AccountName } from "./AccountName";
import { getActivateLink, getDeathLink, getEnergyLink } from "./links";
import { useLongestAlive } from "./useLongestAlive";
import { twMerge } from "tailwind-merge";
import TimeAgo from "react-timeago";
import { useQuery } from "@tanstack/react-query";
import { connectDustClient } from "dustkit/internal";

export function App() {
  const longestAlive = useLongestAlive();

  const dustClient = useQuery({
    queryKey: ["dust-client"],
    queryFn: connectDustClient,
  });

  function getDeathsColor(deaths: number) {
    if (deaths === 0) return "text-green-800";
    if (deaths < 2) return "text-green-500";
    if (deaths < 5) return "text-yellow-500";
    if (deaths < 20) return "text-orange-500";
    return "text-red-800";
  }

  function getDeathsText(deaths: number) {
    if (deaths === 0) return "never died";
    if (deaths === 1) return "died once";
    return `died ${deaths} times`;
  }

  function getAliveDaysColor(aliveDays: number) {
    const max = longestAlive?.[0]?.aliveDays ?? 0;
    const min = longestAlive?.[longestAlive.length - 1]?.aliveDays ?? 0;
    const range = max - min + 1;
    const percentage = (aliveDays - min) / range;
    const bucket = Math.floor(percentage * 10);
    const buckets = [
      "text-red-800",
      "text-red-700",
      "text-red-600",
      "text-red-500",
      "text-orange-500",
      "text-yellow-500",
      "text-green-500",
      "text-green-600",
      "text-green-700",
      "text-green-800",
    ];
    return buckets[bucket];
  }

  return (
    <div className="p-4 font-mono text-sm">
      <h1 className="text-2xl font-bold uppercase mb-4">Longevity</h1>
      {longestAlive ? (
        <ol className="list-decimal pl-10">
          {longestAlive.map((row, i) => (
            <li
              className={twMerge(
                i === 2 || i === 9 ? "mb-6" : "",
                dustClient.data?.appContext.userAddress === row.player
                  ? "bg-indigo-100"
                  : ""
              )}
              key={row.player}
            >
              <AccountName address={row.player} />{" "}
              <span className="text-gray-500">is alive for</span>{" "}
              <span
                className={twMerge(
                  "font-bold",
                  getAliveDaysColor(row.aliveDays)
                )}
              >
                {row.aliveDays}
              </span>{" "}
              <span className="text-gray-500">days and has</span>{" "}
              <a
                className={getDeathsColor(row.deaths)}
                href={getDeathLink(row.player)}
                target="_blank"
                rel="noreferrer"
              >
                {getDeathsText(row.deaths)}
              </a>{" "}
              <br />
              <span className="text-gray-500 text-xs">
                {" "}
                (
                <a
                  href={getEnergyLink(row.player)}
                  target="_blank"
                  rel="noreferrer"
                >
                  {row.lastUpdated ? (
                    <>
                      last updated <TimeAgo date={row.lastUpdated * 1000} />
                    </>
                  ) : (
                    "never updated"
                  )}
                </a>
                ;{" "}
                <a
                  className="underline"
                  href={getActivateLink(row.player)}
                  target="_blank"
                  rel="noreferrer"
                >
                  update now
                </a>
              </span>
              )
            </li>
          ))}
        </ol>
      ) : (
        <div>Talking to the gods...</div>
      )}
    </div>
  );
}
