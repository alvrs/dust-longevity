import {
  type UseQueryOptions,
  type UseQueryResult,
  useQuery,
} from "@tanstack/react-query";
import { type Hex, stringify } from "viem";
import { indexerUrl, worldAddress } from "./common";

type SqlResponse = {
  block_height: number;
  result: Array<Array<Array<string | number | boolean>>>;
};

type SqlQueryParams<TData, TSelectData = TData> = {
  sqlQuery: string | string[];
  refetchInterval?: number;
  select?: (data: TSelectData) => TData;
  fields?: Record<string, string>;
  format?: Record<string, (value: string) => unknown>;
  enabled?: boolean;
};

export function useSqlQuery<
  TData = unknown,
  TSelectData = [TData],
  TError = unknown,
>(
  {
    sqlQuery,
    refetchInterval = 10_000,
    select,
    fields,
    format,
    enabled = true,
  }: SqlQueryParams<TData, TSelectData>,
  options?: Omit<
    UseQueryOptions<SqlResponse, TError, TData>,
    "queryKey" | "queryFn" | "select"
  >
): UseQueryResult<TData, TError> {
  return useQuery({
    queryKey: ["sql-query", sqlQuery],
    queryFn: async () => {
      const body = Array.isArray(sqlQuery)
        ? sqlQuery.map((query) => ({
            address: worldAddress as Hex,
            query,
          }))
        : [
            {
              address: worldAddress as Hex,
              query: sqlQuery,
            },
          ];

      const response = await fetch(indexerUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: stringify(body),
      });

      return response.json() as Promise<SqlResponse>;
    },
    select: (data) => {
      if (!data.result || data.result.length === 0) {
        return [] as TData;
      }

      const result = data.result.map((resultArray) => {
        const columns = resultArray[0] as string[];
        const rows = resultArray.slice(1) as Array<
          Array<string | number | boolean>
        >;

        return rows.map((row) => {
          const mappedRow: Record<string, unknown> = {};
          columns.forEach((column, index) => {
            const value = row[index];
            const newKey = fields?.[column] ?? column;
            const castFn = format?.[column];
            mappedRow[newKey] = castFn ? castFn(value as string) : value;
          });
          return mappedRow;
        });
      }) as TSelectData;

      return select ? select(result) : (result as unknown as TData);
    },
    refetchInterval,
    enabled,
    ...options,
  });
}

export function identity<T>(value: T) {
  return value;
}

export function number(value: string) {
  return Number(value);
}
