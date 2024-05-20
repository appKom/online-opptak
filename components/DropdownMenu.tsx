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
    <div className="absolute right-0 w-48 py-2 mt-2 bg-white border-t border-gray-200 rounded-lg shadow-xl dark:bg-online-darkBlue dark:border-gray-600 text-gray-700 cursor-pointer dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 text-sm">
      {!props.session ? (
        <div>
          <ThemeToggle />
          <a onClick={props.handleLogin} className="block px-4 py-2">
            Logg inn
          </a>
        </div>
      ) : (
        <>
          <div className="px-4 py-2">
            Logget inn som{" "}
            <span className="font-medium">{props.session.user?.name}</span>
          </div>
          {props.session.user?.role === "admin" && (
            <a
              onClick={() => {
                props.router.push("/admin");
                props.toggleDropdown();
              }}
              className="block px-4 py-2"
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
              className="block px-4 py-2 "
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
            className="block px-4 py-2"
          >
            Logg ut
          </a>
        </>
      )}
    </div>
  );
};

export default DropdownMenu;
