import React, { useEffect } from 'react'
import SideBar from './SideBar.js'
import './Dashboard.css'
import { Typography } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { Line, Doughnut } from 'react-chartjs-2'
import { useDispatch, useSelector } from 'react-redux'
import { getAdminProduct } from '../../actions/productAction.js'
import { getAllOrders } from '../../actions/orderAction.js'
import { getAllUsers } from '../../actions/userAction.js'

function Dashboard() {
    const dispatch = useDispatch()
    let OutOfStock = 0
    const { products } = useSelector((state) => state.products);

    const { orders } = useSelector((state) => state.allOrders);
    const { users } = useSelector((state) => state.allUsers);


    useEffect(() => {

        dispatch(getAdminProduct())
        dispatch(getAllOrders())
        dispatch(getAllUsers)

    }, [dispatch])

    products && products.forEach((item) => {
        if (item.stock === 0) {
            OutOfStock += 1;
        }
    })
    const lineState = {
        labels: ["Initial Amount", "Amount Earned"],
        datasets: [
            {
                label: "TOTAL AMOUNT",
                backgroundColor: ["tomato"],
                hoverBackgroundColor: ["rgb(197,72,49)"],
                data: [0, 4000],

            },
        ],
    };

    const doughnutState = {
        labels: ["Out Of Stock", "InStock"],
        datasets: [
            {
                backgroundColor: ["#00A6B4", "#6800B4"],
                hoverBackgroundColor: ["#4B5000", "#35014F"],
                data: [OutOfStock, (products && products.length - OutOfStock)],

            }
        ]
    }

    return (
        <div className='dashboard'>
            <SideBar />
            <div className='dashboardContainer'>
                <Typography component="h1">Dashboard</Typography>
                <div className='dashboardSummary'>
                    <div>
                        <p>Total Amount <br />₹40000</p>
                    </div>
                    <div className='dashboardSummaryBox2'>
                        <Link to="/admin/products">
                            <p>Product</p>
                            <p>{products && products.length}</p>
                        </Link>
                        <Link to="/admin/orders">
                            <p>Orders</p>
                            <p>{orders && orders.length}</p>
                        </Link>
                        <Link to="/admin/users">
                            <p>Users</p>
                            <p>{users && users.length}</p>
                        </Link>
                    </div>
                </div>
                <div className='lineChart'>
                    <Line data={lineState} />
                </div>
                <div className='doughnutChart'>
                    <Doughnut data={doughnutState} />
                </div>

            </div>
        </div>
    )
}

export default Dashboard