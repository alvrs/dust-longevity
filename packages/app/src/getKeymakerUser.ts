import { getAddress, type Hex } from "viem";
import { env } from "./env";

export async function getKeymakerUser(userAddress: Hex): Promise<{
  username: string | null;
  isWhitelisted: boolean;
}> {
  return await fetch(env.VITE_NAME_SERVICE_URL, {
    method: "POST",
    body: JSON.stringify({
      ethereumAddress: getAddress(userAddress),
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.VITE_NAME_SERVICE_BEARER}`,
    },
  }).then((res) => res.json());
}
