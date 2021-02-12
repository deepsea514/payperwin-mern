import React from "react";
import {CircularProgress} from "@material-ui/core";

export function SplashScreen() {
  return (
    <>
      <div className="splash-screen">
        <img
          src={"/media/logos/logo-mini-md.png"}
          alt="Metronic logo"
        />
        <CircularProgress className="splash-screen-spinner" />
      </div>
    </>
  );
}
