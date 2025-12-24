import { Link, Outlet } from "react-router";

// import {Route} from "../../.react-router/types/app/layouts/+types/base";

export default function BaseLayout() {
  return (
    <>
      <nav >
        <div >
          <Link to="/" >
            MyBlog
          </Link>
          <div >
            <Link to="/" >
              Home
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>

      <footer>
      </footer>
    </>
  );
}
