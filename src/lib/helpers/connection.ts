import { ConnectionArgs } from "../types/types";

export async function doFetch<T>(args: ConnectionArgs): Promise<T> {

  let result: any = {};
  const response = await fetch(args.url, args.params);

  result = (await response.json()) || {};
  return result;
}
