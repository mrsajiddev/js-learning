import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import { CircleX } from "lucide-react";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 730,
  maxHeight: "70vh",
  overflowY: "auto",
  bgcolor: 'background.paper',
  border: '1px solid #e2e2e2ff',
  borderRadius: "20px",
  boxShadow: 24,
  p: 4,
};

export default function TransitionsModal({isOpen, onClose, pWidth, popupData, isChat }) {
    if(!isOpen) return null;
  return (
    <div>
      <Modal
        open={isOpen}
        onClose={onClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={isOpen}>
          <Box sx={{...style, width: pWidth  ? pWidth + "px" : "730px"}} >
            <CircleX onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 duration-200 cursor-pointer" size={24}/>
            <div className={`mt-5 flex ${isChat ? "flex-col" : ""} gap-2`}>
                {popupData}
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}