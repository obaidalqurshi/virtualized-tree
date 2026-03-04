import type { TreeNodeData } from "../types/tree";
import { TimeSeriesChart } from "./TimeSeriesChart";
import {Modal, Box, Typography, IconButton} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {motion} from 'motion/react';
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";


const MotionBox = motion.create(Box);


type Inputs = {
  id: string,
  name : string,
  timeSeries: Date[]
}

export function TimeSeriesModal({
  node, 
  onClose
}:{
  node: TreeNodeData
  onClose: ()=>void
}){
  const [visible, setVisible] = useState(false);
  const { 
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = (data) =>{ 
    console.log("node name: ", data.name);
    console.log("node Id: ", data.id);
    console.log("node timeSeries", data.timeSeries.toLocaleString())
    console.log("node parent: ", node.id)
  }
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
            <Button label="add child" icon="pi pi-external-link" onClick={() => setVisible(true)}/>
            <Dialog header={`Add child to ${node.name}`} position="bottom" visible={visible} className="
            bg-white pl-1 font-bold flex flex-col w-170 h-120
            "  onHide={() => {if (!visible) return; setVisible(false); }} appendTo="self">
              <form className="font-medium pl-1 flex flex-col gap-2 mt-1" onSubmit={handleSubmit(onSubmit)}>
                <InputText className="border rounded-2xl p-1" placeholder="Enter a unique id" {...register('id')} />
                <InputText className="border rounded-2xl p-1" placeholder="Enter a node name" {...register('name')} />
                <Controller 
                name="timeSeries"
                control={control}
                render={({field})=>(
                  <Calendar 
                  {...field}
                  selectionMode="multiple"
                  placeholder="Enter timeSeries"
                  dateFormat="dd/mm/yy"
                  value={field.value || []}
                  onChange={(e) => field.onChange(e.value)}
                  />
                )} />
                <Button label="add child" icon="pi pi-external-link" type="submit"/>              
              </form>
            </Dialog>
          </Box>
          </MotionBox>

      </Modal>
  )
}