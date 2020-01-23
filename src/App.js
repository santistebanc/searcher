import React from "react";
import { ThemeProvider } from "emotion-theming";
import { Global, css } from "@emotion/core";
import theme from "./theme";
import Homepage from "./Homepage";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Global
        styles={css`
          body {
            font-family: ${theme.fonts.body};
          }
          input,
          select,
          textarea,
          button {
            font-family: inherit;
          }
        `}
      />
      <Homepage />
    </ThemeProvider>
  );
}

export default App;
