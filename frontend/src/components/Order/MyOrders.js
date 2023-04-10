import React, { useEffect } from 'react'
import { DataGrid } from "@material-ui/data-grid"
import './MyOrders.css'
import { clearErrors, myOrders } from '../../actions/orderAction'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import Loader from '../layout/Loader/Loader'
import { Typography } from '@material-ui/core'
import LaunchIcon from '@material-ui/icons/Launch'
import Metadata from '../layout/Metadata'
import { useAlert } from 'react-alert'


function MyOrders() {
    const dispatch = useDispatch()
    const alert = useAlert()
    const { loading, error, orders } = useSelector((state) => state.myOrders)
    const { user } = useSelector((state) => state.user)

    const columns = [{
        field: 'id',
        headerName: "Order Id",
        minWidth: 300,
        flex: 0.7,
    },
    {
        field: 'status',
        headerName: "Status",
        minWidth: 150,
        flex: 0.4,
        cellClassName: (params) => {
            return params.getValue(params.id, "status") === "Delivered" ? "greenColor" : "redColor"
        }
    },
    {
        field: 'itemsQty',
        headerName: "Items Qty",
        type: "number",
        minWidth: 150,
        flex: 0.3,
    },
    {
        field: 'amount',
        headerName: "Amount",
        type: "number",
        minWidth: 270,
        flex: 0.5,
    },
    {
        field: 'actions',
        headerName: "Actions",
        type: "number",
        minWidth: 150,
        flex: 0.3,
        sortable: false,
        renderCell: (params) => {
            return <Link to={`/order/${params.getValue(params.id, 'id')}`}>
                <LaunchIcon />
            </Link>
        }
    },
    ]
    const rows = []
    orders && orders.forEach((item, index) => {
        rows.push({
            itemsQty: item.orderProducts.length,
            id: item._id,
            status: item.orderStatus,
            amount: item.totalPrice,


        })
    });
    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }
        dispatch(myOrders())
    }, [dispatch, alert, error])
    return (
        <>
            <Metadata title={`${user.name}`} />
            {loading ? (<Loader />) : (
                <div className='myOrdersPage'>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        disableSelectionOnClick
                        className='myOrdersTable'
                        autoHeight />
                    <Typography id="myOrdersHeading">{user.name}'s Orders</Typography>
                </div>
            )}

        </>
    )
}

export default MyOrders