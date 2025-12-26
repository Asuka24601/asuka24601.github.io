/* eslint-disable react-refresh/only-export-components */
import { isRouteErrorResponse,data } from "react-router";
import ReactMarkdown from "react-markdown";
import type { Route } from "./+types/postContent";
import fetchData from "../lib/fetchData";

// provides `loaderData` to the component
export async function clientLoader({ params }: Route.ClientLoaderArgs): Promise<string> {
  
  const title = params.title;
  const filePath = "/contents/" + title + '.md';

  const loaderData = await fetchData(filePath,"text");
  if (loaderData === null) {
    throw data("load markdown file fail",404);
  }
  
  return loaderData;
}

export default function PostContent({ loaderData }: { loaderData: string }) {
  
  const markdownContent = <ReactMarkdown>{loaderData}</ReactMarkdown>;

  
  return (
    <>
      <h1>postContent</h1>
      {markdownContent}
    </>
  );
}

// error boundary
export function ErrorBoundary({
  error,
}: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error)) {
    return (
      <>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
