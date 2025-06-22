import type { Hex } from "viem";
import { TruncatedHex } from "./TruncatedHex";
import { useENS } from "./useENS";
import { useKeymakerUser } from "./useKeymakerUser";

export type Props = {
  address: Hex;
};

export function AccountName({ address }: Props) {
  const { data: user } = useKeymakerUser(address);
  const { data: ens } = useENS(address);
  return <>{user?.username ?? ens?.name ?? <TruncatedHex hex={address} />}</>;
}
