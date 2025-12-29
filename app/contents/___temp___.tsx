/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MDXModule } from "mdx/types";
import { mdxRender } from "../lib/mdxRender";
import type { Route } from "./+types/___temp___";

export async function clientLoader(): Promise<MDXModule> {
  const md = `
# title

hello
`;

  const Res = await mdxRender(md);

  return Res;
}

export default function Temp({ loaderData }: Route.ComponentProps) {
  const { default: Res } = loaderData;

  return (
    <div>
      <Res />
    </div>
  );
}
