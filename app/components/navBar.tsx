import {Link} from "react-router";

export default function NavBar() {
    return (
        <nav className="bg-black text-white p-5">
            <div>
                <h1>MyBlog</h1>
            </div>
            <ul className="flex mt-1 flex-row gap-2">
                <li>
                    <Link to='/'>Home</Link>
                </li>
                <li>
                    <Link to='/post'>Post</Link>
                </li>
                <li>
                    <Link to='/about'>About</Link>
                </li>
                <li>
                    <Link to='/__temp__'>___temp___</Link>
                </li>
            </ul>
        </nav>
    )
}
