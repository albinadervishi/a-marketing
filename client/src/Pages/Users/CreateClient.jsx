import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { createClient } from "../../redux/action/user";
import { checkEmail, checkUsername } from "../../redux/api";
import {
  Divider,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  DialogActions,
  TextField,
} from "@mui/material";
import { PiNotepad, PiXLight } from "react-icons/pi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName:  z.string().min(1, "Last name is required"),
  username:  z.string().min(3, "Username must be at least 3 characters"),
  email:     z.string().email("Invalid email address"),
  phone:     z.string().min(7, "Phone number is required"),
  city:      z.string().optional(),
  CNIC:      z.string().optional(),
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const CreateClient = ({ open, setOpen, scroll }) => {
  const { isFetching } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { firstName: "", lastName: "", username: "", email: "", phone: "", city: "", CNIC: "" },
  });

  const onSubmit = async (data) => {
    try {
      const { data: emailCheck } = await checkEmail(data.email);
      if (emailCheck.exists) { toast.error("Email already in use"); return; }
    } catch (_) {}
    try {
      const { data: usernameCheck } = await checkUsername(data.username);
      if (usernameCheck.exists) { toast.error("Username already in use"); return; }
    } catch (_) {}
    dispatch(createClient(data, setOpen));
    reset();
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  return (
    <div>
      <Dialog
        scroll={scroll}
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        fullWidth="sm"
        maxWidth="sm"
        aria-describedby="alert-dialog-slide-description">
        <DialogTitle className="flex items-center justify-between">
          <div className="text-sky-400 font-primary">Add New Client</div>
          <div className="cursor-pointer" onClick={handleClose}>
            <PiXLight className="text-[25px]" />
          </div>
        </DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-2 p-3 text-gray-500 font-primary">
            <div className="text-xl flex justify-start items-center gap-2 font-normal">
              <PiNotepad size={23} />
              <span>Client Details</span>
            </div>
            <Divider />
            <table className="mt-4">
              <tbody>
                <tr>
                  <td className="pb-4 text-lg">First Name</td>
                  <td className="pb-4">
                    <TextField size="small" fullWidth {...register("firstName")} error={!!errors.firstName} helperText={errors.firstName?.message} />
                  </td>
                </tr>
                <tr>
                  <td className="pb-4 text-lg">Last Name</td>
                  <td className="pb-4">
                    <TextField size="small" fullWidth {...register("lastName")} error={!!errors.lastName} helperText={errors.lastName?.message} />
                  </td>
                </tr>
                <tr>
                  <td className="pb-4 text-lg">User Name</td>
                  <td className="pb-4">
                    <TextField size="small" fullWidth {...register("username")} error={!!errors.username} helperText={errors.username?.message} />
                  </td>
                </tr>
                <tr>
                  <td className="pb-4 text-lg">Email</td>
                  <td className="pb-4">
                    <TextField size="small" fullWidth {...register("email")} error={!!errors.email} helperText={errors.email?.message} />
                  </td>
                </tr>
                <tr>
                  <td className="flex items-start pt-2 text-lg">Phone</td>
                  <td className="pb-4">
                    <TextField size="small" fullWidth {...register("phone")} error={!!errors.phone} helperText={errors.phone?.message} />
                  </td>
                </tr>
                <tr>
                  <td className="pb-4 text-lg">City</td>
                  <td className="pb-4">
                    <TextField size="small" fullWidth placeholder="Optional" {...register("city")} />
                  </td>
                </tr>
                <tr>
                  <td className="pb-4 text-lg">CNIC</td>
                  <td className="pb-4">
                    <TextField size="small" fullWidth placeholder="Optional" {...register("CNIC")} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </DialogContent>
        <DialogActions>
          <button
            onClick={handleClose}
            type="reset"
            className="bg-[#d7d7d7] px-4 py-2 rounded-lg text-gray-500 mt-4 hover:text-white hover:bg-[#6c757d] border-[2px] border-[#efeeee] hover:border-[#d7d7d7] font-thin transition-all">
            Cancel
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            className="bg-primary-red px-4 py-2 rounded-lg text-white mt-4 hover:bg-red-400 font-thin">
            {isFetching ? "Submitting..." : "Submit"}
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreateClient;
