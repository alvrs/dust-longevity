import { redstone } from "@latticexyz/common/chains";
import worlds from "@dust/world/worlds.json";
import { env } from "./env";
import { getAddress } from "viem";

const chainId = Number(env.VITE_CHAIN_ID);
const chains = [redstone];
export const chain = chains.find((c) => c.id === chainId)!;

if (!chain) {
  throw new Error(`Chain ${chainId} not configured`);
}

export const indexerUrl = new URL("/q", chain.indexerUrl);
export const worldAddress = getAddress(worlds[env.VITE_CHAIN_ID].address);
