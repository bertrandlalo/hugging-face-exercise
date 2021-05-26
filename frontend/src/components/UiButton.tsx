import React from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import "@fontsource/roboto";

type UiButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
};

export const UiButton = ({
  onClick,
  children,
  disabled,
  isLoading,
}: UiButtonProps) => (
  <div style={{ paddingBlock: 10 }}>
    <Button
      onClick={onClick}
      disabled={disabled ?? isLoading}
      color="primary"
      variant="contained"
      endIcon={isLoading && <CircularProgress color="inherit" size={20} />}
    >
      {children}
    </Button>
  </div>
);
