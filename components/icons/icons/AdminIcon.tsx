const AdminIcon = ({
  className,
  fill,
}: {
  className?: string;
  fill?: string;
}) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 48 60"
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M24 0.5C17.7 6.4 9.3 10 0 10V41.2C4.054 51.324 13.603 57.03 24 60C34.399 57.029 43.947 51.323 48 41.2V10C38.7 10 30.3 6.4 24 0.5ZM24 55.8C21.081 54.983 13.402 53.328 7.3 45.7C10 40.9 14.7 37.4 20.3 36.3C16.1 34.9 13 30.8 13 26C13 19.9 17.9 15 24 15C30.1 15 35 19.9 35 26C35 30.8 31.9 34.9 27.7 36.4C33.3 37.5 38 41 40.7 45.799C35.89 51.65 30.575 54.223 24 55.8Z"
      fill={fill}
    />
  </svg>
);

export default AdminIcon;
