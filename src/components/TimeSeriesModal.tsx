import type { TreeNodeData } from "../types/tree";
import { TimeSeriesChart } from "./TimeSeriesChart";
import {Modal, Box, Typography, IconButton} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {motion} from 'motion/react';


const MotionBox = motion.create(Box);


export function TimeSeriesModal({
  node, 
  onClose
}:{
  node: TreeNodeData
  onClose: ()=>void
}){
  return(
    <Modal
      open={true}
      onClose={onClose}
      closeAfterTransition
      slotProps={{
        backdrop:{
          timeout: 300,
        },
      }}
      >
        <MotionBox
          initial={{x:500, opacity: 0}}
          animate={{x: 0, opacity: 1}}
          exit={{ x:500, opacity:0}}
          transition={{ type: "tween", duration: 0.7}}
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 500,
            height: '100vh',
            bgcolor: "#517c80",
            boxShadow: 24,
            p: 2,
            display: "flex",
            flexDirection: "column"
          }}
          >
            <Box display='flex' alignItems='center' justifyContent='space-between'>
              <Typography variant="h6">{node.name}</Typography>
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Box>
          <Box flex={1} mt={1}>
            <TimeSeriesChart data={node.timeSeries} />
          </Box>
          </MotionBox>

      </Modal>
  )
}