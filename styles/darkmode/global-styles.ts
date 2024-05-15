// global-styles.ts
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  :root {
    --background-light: #ffffff;
    --background-dark: #333333;
    --text-light: #000000;
    --text-dark: #ffffff;
  }

  [data-theme='light'] {
    background-color: var(--background-light);
    color: var(--text-light);
  }

  [data-theme='dark'] {
    background-color: var(--background-dark);
    color: var(--text-dark);
  }

  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    transition: background-color 0.3s, color 0.3s;
  }
`;

export default GlobalStyle;
