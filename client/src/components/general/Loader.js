import React from "react";
import style from "./Loader.module.css";

const Loader = () => {
  return (
    <main className={style.spinnerExamples}>
      <span className={style.spinner} />
    </main>
  );
};

export default Loader;
