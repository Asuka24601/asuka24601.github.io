import { NavLink } from "react-router";
import type { PostListInterface } from "../interfaces/post";
import type { Route } from "./+types/postIndex";
import fetchData from "../lib/fetchData";

// import type { Route } from "./+types/postIndex";

// eslint-disable-next-line react-refresh/only-export-components
export async function clientLoader(): Promise<PostListInterface> {
    const  filePath = "/data/post.json";
    const loaderData = await fetchData(filePath,"json");
    return loaderData;
}

export default function PostIndex({loaderData}:Route.ComponentProps) {
    // console.log(loaderData);
    const {creationDate, lastUpdateDate, posts} = loaderData;
    const items = posts.map(item => <li key={item.title}>
        <NavLink to={item.title}>{item.title}</NavLink> 
    </li>)

    return (
        <>
        <h1>postIndex</h1>
        <p>{creationDate}</p>
        <p>{lastUpdateDate}</p>
        <ul>
            {...items}
            <li>
                <NavLink to="test">Test</NavLink> 
            </li>
        </ul>
        </>
    )
}