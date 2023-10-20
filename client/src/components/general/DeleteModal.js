import { Box, Button, Modal, Typography } from "@mui/material";
import style from "./DeleteModal.module.css";

const DeleteModal = ({ isOpen, setIsOpen, handleDelete }) => {
  return (
    <Modal open={isOpen} onClose={() => setIsOpen(false)}>
      <Box className={style.deleteModal}>
        <Typography variant="h6" component="h2">
          Are You Sure?
        </Typography>
        <div className={style.deleteModalBtns}>
          <Button
            variant="contained"
            style={{ background: "rgb(209, 46, 100)" }}
            onClick={handleDelete}
          >
            Yes
          </Button>
          <Button
            variant="contained"
            style={{ background: "rgb(19, 137, 137)" }}
            onClick={() => setIsOpen(false)}
          >
            No
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default DeleteModal;
