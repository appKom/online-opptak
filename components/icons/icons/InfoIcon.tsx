const InfoIcon = ({ className, fill }: { className: string; fill: string }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 32 32"
    fill={fill}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 0C7.2 0 0 7.2 0 16C0 24.8 7.2 32 16 32C24.8 32 32 24.8 32 16C32 7.2 24.8 0 16 0ZM16 29C8.8 29 3 23.2 3 16C3 8.8 8.8 3 16 3C23.2 3 29 8.8 29 16C29 23.2 23.2 29 16 29Z"
      fill={fill}
    />
    <path d="M18 14H14V24H18V14Z" fill={fill} />
    <path
      d="M16 12C17.1046 12 18 11.1046 18 10C18 8.89543 17.1046 8 16 8C14.8954 8 14 8.89543 14 10C14 11.1046 14.8954 12 16 12Z"
      fill={fill}
    />
  </svg>
);

export default InfoIcon;
