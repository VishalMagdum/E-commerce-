import React, { useState } from 'react'
import "./Header.css"
import { SpeedDial, SpeedDialAction } from '@material-ui/lab'
import Profile from '../../../images/Profile.png'
import Backdrop from "@material-ui/core/Backdrop";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PersonIcon from "@material-ui/icons/Person";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ListAltIcon from "@material-ui/icons/ListAlt";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { useNavigate } from 'react-router-dom'
import { useAlert } from 'react-alert';
import { logout } from '../../../actions/userAction'
import { useDispatch, useSelector } from 'react-redux'
function UserOptions({ user }) {

    const { cartItems } = useSelector((state) => state.cart)
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()
    const alert = useAlert()
    const options = [
        { icon: <ListAltIcon />, name: "Orders", fun: orders },
        { icon: <PersonIcon />, name: "Profile", fun: account },
        { icon: <ShoppingCartIcon style={{ color: cartItems.length > 0 ? "tomato" : 'unset' }} />, name: `Cart(${cartItems.length})`, fun: cart },
        { icon: <ExitToAppIcon />, name: "Logout", fun: logoutUser },
    ];

    if (user.role === "admin") {
        options.unshift({
            icon: <DashboardIcon />,
            name: "Dashboard",
            fun: dashboard,
        });
    }
    function dashboard() {
        navigate("/admin/dashboard")
    }
    function orders() {
        navigate("/orders")
    }
    function account() {
        navigate("/account")
    }
    function cart() {
        navigate("/cart")
    }
    function logoutUser() {
        dispatch(logout())
        alert.success("LogOut Successfully")
    }
    return <>
        <Backdrop open={open} style={{ zIndex: "9" }} />
        <SpeedDial
            style={{ zIndex: "11" }}
            className='speedDail'
            ariaLabel="SpeedDial tooltip example"
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            direction="down"
            icon={
                <img
                    className='speedDailIcon'
                    src={user.profile_img.url ? user.profile_img.url : Profile}
                    alt="Profile" />
            }>
            {options.map((e) => (
                <SpeedDialAction
                    key={e.name}
                    icon={e.icon}
                    tooltipTitle={e.name}
                    onClick={e.fun}
                    tooltipOpen={window.innerWidth <= 600 ? true : false} />
            ))}



        </SpeedDial>
    </>
}

export default UserOptions