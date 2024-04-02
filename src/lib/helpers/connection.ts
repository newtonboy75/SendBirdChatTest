import { ConnectionArgs } from "../types/types";

export async function doFetch<T>(args: ConnectionArgs) : Promise<T>{
  console.log(args)
    let result: any = {}
    const response = await fetch(args.url, args.params);
    console.log(response)
    result = await response.json() || {};
    return result
}