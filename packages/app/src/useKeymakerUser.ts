import { skipToken, useQuery } from "@tanstack/react-query";
import { getAddress, type Hex } from "viem";
import { getKeymakerUser } from "./getKeymakerUser";

export function useKeymakerUser(rawAddress: Hex | undefined) {
  const address = rawAddress ? getAddress(rawAddress) : undefined;
  return useQuery({
    staleTime: 1000 * 60 * 60,
    queryKey: ["keymaker-user", address],
    queryFn: address ? () => getKeymakerUser(address) : skipToken,
  });
}
