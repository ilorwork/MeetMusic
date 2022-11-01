import { Modal } from "@mui/material";
import React from "react";
import style from "./Loader.module.css";

const Loader = ({ loading = false }) => {
  return (
    <Modal open={loading}>
      <main className={style.spinnerExamples}>
        <span className={style.spinner} />
      </main>
    </Modal>
  );
};

export default Loader;
