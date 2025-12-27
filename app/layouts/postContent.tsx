import { Outlet } from "react-router";
// import type { Route } from "./+types/postContent";

export default function PostContent() {
  return(
    <Outlet/>
  )
}

// error boundary
// export function ErrorBoundary({
//   error,
// }: Route.ErrorBoundaryProps) {
//   if (isRouteErrorResponse(error)) {
//     return (
//       <>
//         <h1>
//           {error.status} {error.statusText}
//         </h1>
//         <p>{error.data}</p>
//       </>
//     );
//   } else if (error instanceof Error) {
//     return (
//       <div>
//         <h1>Error</h1>
//         <p>{error.message}</p>
//         <p>The stack trace is:</p>
//         <pre>{error.stack}</pre>
//       </div>
//     );
//   } else {
//     return <h1>Unknown Error</h1>;
//   }
// }
