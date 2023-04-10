import { DataGrid } from '@material-ui/data-grid'
import React, { useEffect } from 'react'
import './ProductList.css'
import { clearErrors, getAdminProduct, deleteProduct } from '../../actions/productAction'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { useAlert } from 'react-alert'
import { Button } from '@material-ui/core'
import Metadata from '../layout/Metadata'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import SideBar from './SideBar'
import { DELETE_PRODUCT_RESET } from '../../constants/productConstants'
function ProductList() {
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const alert = useAlert();

    const { error, products } = useSelector((state) => state.products);

    const { error: deleteError, isDeleted } = useSelector((state) => state.product)

    const deleteProductHandler = (id) => {
        // console.log(id)
        dispatch(deleteProduct(id))
    }

    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }
        if (deleteError) {
            alert.error(deleteError)
            dispatch(clearErrors())
        }
        if (isDeleted) {
            alert.success("Deleted Successfully")
            navigate("/admin/dashboard")
            dispatch({ type: DELETE_PRODUCT_RESET })

        }
        dispatch(getAdminProduct())

    }, [dispatch, error, alert, deleteError, navigate, isDeleted])

    const columns = [
        { field: "id", headerName: "Product ID", minWidth: 200, flex: 0.5 },

        {
            field: "name",
            headerName: "Name",
            minWidth: 350,
            flex: 1,
        },
        {
            field: "stock",
            headerName: "Stock",
            type: "number",
            minWidth: 150,
            flex: 0.3,
        },

        {
            field: "price",
            headerName: "Price",
            type: "number",
            minWidth: 270,
            flex: 0.5,
        },

        {
            field: "actions",
            flex: 0.3,
            headerName: "Actions",
            minWidth: 150,
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <>
                        <Link to={`/admin/product/${params.getValue(params.id, "id")}`}>
                            <EditIcon />
                        </Link>

                        <Button
                            onClick={() => { deleteProductHandler(params.getValue(params.id, "id")) }}
                        >
                            <DeleteIcon />
                        </Button>
                    </>
                );
            },
        },
    ];

    const rows = [];

    products &&
        products.forEach((item) => {
            rows.push({
                id: item._id,
                stock: item.stock,
                price: item.price,
                name: item.name,
            });
        });

    return (
        <>
            <Metadata title={`ALL PRODUCTS - Admin`} />

            <div className="dashboard">
                <SideBar />
                <div className="productListContainer">
                    <h1 id="productListHeading">ALL PRODUCTS</h1>

                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        disableSelectionOnClick
                        className="productListTable"
                        autoHeight
                    />
                </div>
            </div>
        </>
    )
}

export default ProductList