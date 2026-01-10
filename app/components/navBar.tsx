import { Link } from 'react-router'
import { Sun, Moon, Search, Menu } from './icons'

export default function NavBar({
    className,
    siteName,
}: {
    className: string | undefined
    siteName: string | undefined
}) {
    const listItems = [
        ['Home', '/'],
        ['Posts', '/posts'],
        ['About', '/about'],
        ['___temp___', '/___temp___'],
        ['Tags', '/tags'],
        ['Comments', '/comments'],
    ].map((item) => (
        <li key={item[0]}>
            <Link to={item[1]}>{item[0]}</Link>
        </li>
    ))

    return (
        <div className={className}>
            <nav className="navbar bg-base-100 rounded shadow-sm">
                <div className="navbar-center">
                    <Link to="/" className="btn btn-ghost text-xl">
                        <p className="first-letter:capitalize">
                            {siteName || 'Blog'}
                        </p>
                    </Link>
                </div>
                <div className="navbar-start">
                    <div className="dropdown dropdown-center">
                        <div
                            tabIndex={0}
                            role="button"
                            className="btn btn-ghost btn-circle"
                        >
                            <Menu
                                className="h-5 w-5"
                                stroke="currentColor"
                                fill="none"
                            />
                        </div>
                        <ul
                            tabIndex={-1}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
                        >
                            {listItems}
                        </ul>
                    </div>
                </div>
                <div className="navbar-end">
                    <button className="btn btn-ghost btn-circle">
                        <Search
                            stroke="currentColor"
                            fill="none"
                            className="h-5 w-5"
                        />
                    </button>

                    <label className="swap swap-rotate">
                        {/* this hidden checkbox controls the state */}
                        <input
                            type="checkbox"
                            className="theme-controller"
                            value="synthwave"
                        />

                        {/* sun icon */}
                        <Sun className="swap-off" />

                        {/* moon icon */}
                        <Moon className="swap-on" />
                    </label>
                </div>
            </nav>
        </div>
    )
}
