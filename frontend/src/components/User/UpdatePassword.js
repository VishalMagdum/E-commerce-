import React, { useState, useEffect } from 'react'
import Loader from "../layout/Loader/Loader"
import "./UpdatePassword.css"
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux"
import { clearErrors, updatePassword } from "../../actions/userAction"
import LockOpenIcon from "@material-ui/icons/LockOpen"
import LockIcon from "@material-ui/icons/Lock"
import VpnKeyIcon from "@material-ui/icons/VpnKey"
import { useAlert } from 'react-alert'
import { UPDATE_PASSWORD_RESET } from '../../constants/userConstants'
import MetaData from '../layout/Metadata'

function UpdatePassword() {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const alert = useAlert();

    const { error, loading, isUpdated } = useSelector(
        (state) => state.profile
    );

    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")


    const updatePasswordSubmit = (e) => {
        e.preventDefault();

        const myForm = new FormData();

        myForm.set("oldPassword", oldPassword);
        myForm.set("newPassword", newPassword);
        myForm.set("confirmPassword", confirmPassword);

        dispatch(updatePassword(myForm))


    };



    useEffect(() => {

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        if (isUpdated) {
            alert.success("Profile Updated Successfully")

            navigate("/account")
            dispatch({
                type: UPDATE_PASSWORD_RESET,

            })
        }


    }, [dispatch, error, alert, navigate, isUpdated]);
    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <MetaData title="Change Password" />
                    <div className="updatePasswordContainer">
                        <div className="updatePasswordBox">
                            <h2 className="updatePasswordHeading">Update Profile</h2>

                            <form
                                className="updatePasswordForm"
                                encType="multipart/form-data"
                                onSubmit={updatePasswordSubmit}
                            >
                                <div className="loginPassword">
                                    <VpnKeyIcon />
                                    <input
                                        type="password"
                                        placeholder="Old Password"
                                        required
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                    />
                                </div>
                                <div className="loginPassword">
                                    <LockOpenIcon />
                                    <input
                                        type="password"
                                        placeholder="New Password"
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>
                                <div className="loginPassword">
                                    <LockIcon />
                                    <input
                                        type="password"
                                        placeholder="Confirm Password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>



                                <input
                                    type="submit"
                                    value="Change"
                                    className="updatePasswordBtn"
                                />
                            </form>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default UpdatePassword