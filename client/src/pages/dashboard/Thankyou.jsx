import { useReactToPrint } from "react-to-print";

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";


export default function ThankYou() {

    const location = useLocation();
    const navigate = useNavigate();
    const { order_id } = location.state || {};
    const [order, setOrder] = useState(null);
    
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        documentTitle: 'Service Payment',
        contentRef: componentRef,
        
    });

    useEffect(() => {
        const getUserData = async () => {
            if (order_id) {
                const response = await fetch(`${process.env.REACT_APP_HOST_URL}/payment/order/${order_id}`);
                const order = await response.json();
                setOrder(order);
            }
            // else{
            //     navigate("/homepage");
            // }
        }
        getUserData();
    }, []);

    console.log("order", order);
    return (
        // along user and order daata
        // order details table also show
        // show plan details also
        // if user is admin then show admin dashboard button else show go to homepage button
        <div className="min-h-screen w-full  flex flex-col  items-center justify-center bg-gray-100">
            <div ref={componentRef} className="h-auto w-[500px] p-8 rounded-2xl shadow-lg text-semibold text-white flex flex-col  items-center justify-center bg-white">
                <div className="text-green-500 text-4xl mb-4"> <CheckCircle size={40} /> </div>
                <h1 className="text-center text-orange-400 text-3xl font-bold py-4">Payment Succeeded!</h1>
                <p className="text-center text-sm text-gray-700 py-2">Your transaction was completed successfully. Thank you for your purchase!</p>
                {/* Table to show data of user, membership and order */}
                {order && (
                    <Table className="thankyou-table" size="small" aria-label="thank you table">
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-bold text-lg text-white">User Name</TableCell>
                                <TableCell align="right" className="font-bold text-lg text-white">{order.data.user.full_name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-bold text-lg text-white">Email</TableCell>
                                <TableCell align="right" className="font-bold text-lg text-white">{order.data.user.user_email}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-bold text-lg text-white">Membership </TableCell>
                                <TableCell align="right" className="font-bold text-lg text-white">{order.data.membership.title}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-bold text-lg text-white">Plan </TableCell>
                                <TableCell align="right" className="font-bold text-lg text-white">{order.data.plan.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-bold text-lg text-white">Payment Id </TableCell>
                                <TableCell align="right" className="font-bold text-lg text-white">{order.data.stripe_payment_id}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-bold text-lg text-white">Amount </TableCell>
                                <TableCell align="right" className="font-bold text-lg text-white">{order.data.plan.amount}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                )}
                </div>
                <div className="flex justify-between">
                <div className="flex justify-between gap-8 mt-4">
                    <button className="rounded-lg bg-orange-500  px-4 py-2 text-white hover:bg-orange-600">
                        <Link to="#" onClick={handlePrint}>Print</Link>
                    </button>
                    <button className="rounded-lg bg-orange-500 px-4 py-2 text-white hover:bg-orange-600">
                        <Link to="/my-account">Go To Account</Link>
                    </button>
                </div>
            </div>
        </div>
    );
}