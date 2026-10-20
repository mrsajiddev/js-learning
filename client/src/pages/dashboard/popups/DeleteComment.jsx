import { useState } from "react";
import Typography from '@mui/material/Typography';


export default function DeleteComment({ commentID, onValueReturn, onSetNotice }){ 
    const [loader, setLoader] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);
        const response = await fetch(`${process.env.REACT_APP_HOST_URL}/admin/comment/delete/${commentID}`,{
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await response.json();
        if(response.ok){
            onSetNotice({type: "success", message: data.message});
            onValueReturn(false);
        }else{
            onSetNotice({type: "error", message: data.message});
        }
        setLoader(false);
    }   

    return (
        <form className="w-full flex flex-col gap-2 p-2 items-center" onSubmit={handleSubmit}>
            <Typography variant="h6" sx={{fontWeight: "bold"}} gutterBottom>
                Delete Comment
            </Typography>
            <Typography variant="body2" gutterBottom>
                Are you sure you want to delete this Comment?
            </Typography>
            <div className="flex justify-end gap-2 mt-4">
                <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md" onClick={() => onValueReturn(false)}>Cancel</button>
                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md" type="submit" disabled={loader}>
                    {loader ? "Deleting..." : "Delete"}
                </button>
            </div>
        </form>
    )
}