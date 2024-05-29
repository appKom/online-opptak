import ThemeToggle from "./ThemeToggle";

type Props = {
  session: any;
  handleLogin: () => void;
  handleLogout: () => void;
  router: any;
  toggleDropdown: () => void;
};

const DropdownMenu = (props: Props) => {
  return (
    <div className="absolute right-0 z-10 w-48 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-lg shadow-xl cursor-pointer dark:bg-online-darkBlue dark:border-gray-600 dark:text-whitetext-sm">
      {!props.session ? (
        <div>
          <ThemeToggle />
          <a
            onClick={props.handleLogin}
            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Logg inn
          </a>
        </div>
      ) : (
        <>
          <div className="px-4 py-2 cursor-default">
            Logget inn som{" "}
            <span className="font-medium">{props.session.user?.name}</span>
          </div>
          {props.session.user?.role === "admin" && (
            <a
              onClick={() => {
                props.router.push("/admin");
                props.toggleDropdown();
              }}
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Admin
            </a>
          )}

          {props.session.user?.isCommitee && (
            <a
              onClick={() => {
                props.router.push("/committee");
                props.toggleDropdown();
              }}
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              For komiteer
            </a>
          )}
          <ThemeToggle />
          <a
            onClick={() => {
              props.handleLogout();
              props.toggleDropdown();
            }}
            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Logg ut
          </a>
        </>
      )}
    </div>
  );
};

export default DropdownMenu;
