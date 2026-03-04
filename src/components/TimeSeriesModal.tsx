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
import { useTreeStore } from "../store/useTreeStore";


const MotionBox = motion.create(Box);


type Inputs = {
  id: string,
  name : string,
  timeSeries: Date[]
}

export function TimeSeriesModal({
  node,
  setData,
  nodeData,
  onClose
}:{
  node: TreeNodeData,
  onClose: ()=>void
}){
  const [visible, setVisible] = useState(false);
  const { 
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<Inputs>();
  const addChild = useTreeStore((state) => state.addChild);
  const deleteNode = useTreeStore((state) => state.deleteNode);
  const onSubmit: SubmitHandler<Inputs> = (formData) =>{ 
    const newChild: TreeNodeData = {
      id: formData.id,
      name: formData.name,
      timeSeries: formData.timeSeries.map(d => ({
        date: d.toISOString().split('T')[0],
        value: Math.floor(Math.random() * 100)
      })),
      children: []
    };
    addChild(node.id, newChild);
  setVisible(false);
  onClose();
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
            <div className="gap-2 flex flex-row">
            <Button label="add child" icon="pi pi-external-link" className="p-1 space-x-1 border rounded-2xl bg-green-500" onClick={() => setVisible(true)}/>
            <Button label="Delete Node" icon="pi pi-trash" className="p-1 space-x-1 border rounded-2xl bg-red-500" onClick={() => deleteNode(node.id)}/>
            </div>
            <Dialog header={`Add child to ${node.name}`} position="bottom" visible={visible} className="pl-1 font-bold flex flex-col w-170 h-80
            "  onHide={() => {if (!visible) return; setVisible(false); }} appendTo="self">
              <form className="font-medium pl-1 pr-2 align-middle flex flex-col gap-2 mt-1" onSubmit={handleSubmit(onSubmit)}>
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
                <Button label="add child" icon="pi pi-external-link" className="pl-2 rounded-2xl" style={{ backgroundColor: "#64b5f6"}} type="submit"/>              
              </form>
            </Dialog>
          </Box>
          </MotionBox>

      </Modal>
  )
}