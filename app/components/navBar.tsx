import { Link } from 'react-router'

export default function NavBar() {
    const listItems = [
        ['Home', '/'],
        ['Post', '/post'],
        ['About', '/about'],
        ['___temp___', '/___temp___'],
    ].map((item) => (
        <li key={item[0]}>
            <Link to={item[1]}>{item[0]}</Link>
        </li>
    ))

    return (
        <nav className="m-3 rounded-sm bg-black p-5 text-white shadow-2xs">
            <div>
                <h1>MyBlog</h1>
            </div>
            <ul className="mt-1 flex flex-row gap-2">{listItems}</ul>
        </nav>
    )
}
