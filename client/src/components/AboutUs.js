import { Box, Button, Card, Modal, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./AboutUs.module.css";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  bgcolor: "background.paper",
  border: "1px solid #000",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const AboutUs = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  return (
    <div className={style.aboutUsWrapper}>
      <div className={style.aboutUsTop}>
        <h1 className={style.aboutUsHeader}>ABOUT MEET MUSIC</h1>
      </div>
      <Card className={style.aboutUsCard}>
        <div>
          <Typography variant="h6">WHAT'S THE PURPOSE OF MEET MUSIC</Typography>
          <Typography>
            MeetMusic is a social network for creating connections and
            collaborations between artists,
          </Typography>
          <Typography>
            singers and musicians, and for sharing music between people.
          </Typography>
        </div>
        <div>
          <Typography variant="h6">WHO WE ARE</Typography>
          <Typography>
            We're two FullStack developers - Ilor Shurer and Amitay Gabay.
          </Typography>
          <Typography>
            Both of us have graduated from a FullStack development program at{" "}
            <a href="https://gocode.co.il" target="_blank">
              GoCode
            </a>
          </Typography>
        </div>
        <div className={style.btnsWrapper}>
          <Button
            variant="contained"
            color="success"
            onClick={() => navigate("/login")}
          >
            LogIn
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setIsOpen(true)}
          >
            Contact Us
          </Button>
          <Modal open={isOpen} onClose={() => setIsOpen(false)}>
            <Box sx={modalStyle} className={style.contactUsModal}>
              <Typography>
                <b>Ilor Shurer- </b>
                ilorwork64@gmail.com
              </Typography>
              <Typography>
                <b>Amitay Gabay- </b>
                amitaygabay1@gmail.com
              </Typography>
            </Box>
          </Modal>
        </div>
      </Card>
    </div>
  );
};

export default AboutUs;
