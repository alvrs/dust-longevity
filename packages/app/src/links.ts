import { encodePlayer } from "@dust/world/internal";
import { Hex } from "viem";

export function getActivateLink(player: string) {
  return `https://explorer.mud.dev/redstone/worlds/0x253eb85B3C953bFE3827CC14a151262482E7189C/interact?expanded=root%2C0x73790000000000000000000000000000416374697661746553797374656d0000&filter=activate&args=%5B%22${player}%22%5D#0x73790000000000000000000000000000416374697661746553797374656d0000-0xed05304adc3080dd9dda9811787be1f2aa5deb71547cde10966856aaf77c70f7`;
}

export function getEnergyLink(player: Hex) {
  return `https://explorer.mud.dev/redstone/worlds/0x253eb85B3C953bFE3827CC14a151262482E7189C/explore?tableId=0x74620000000000000000000000000000456e6572677900000000000000000000&query=SELECT%2520%2522entityId%2522%252C%2520%2522lastUpdatedTime%2522%252C%2520%2522energy%2522%252C%2520%2522drainRate%2522%2520FROM%2520%2522Energy%2522%2520WHERE%2520%2522entityId%2522%2520%253D%2520%27${encodePlayer(player)}%27%253B&page=0&pageSize=10`;
}

export function getDeathLink(player: Hex) {
  return `https://explorer.mud.dev/redstone/worlds/0x253eb85B3C953bFE3827CC14a151262482E7189C/explore?tableId=0x7462000000000000000000000000000044656174680000000000000000000000&query=SELECT%2520%2522player%2522%252C%2520%2522deaths%2522%252C%2520%2522lastDiedAt%2522%2520FROM%2520%2522Death%2522%2520WHERE%2520%2522player%2522%2520%253D%2520%27${encodePlayer(player)}%27%253B&page=0&pageSize=10`;
}
