import React, { useEffect } from 'react'
import { CgMouse } from 'react-icons/all'
import '../Home/Home.css'
import ProductCard from './ProductCard';
import Metadata from '../layout/Metadata';
import { clearErrors, getProduct } from "../../actions/productAction"
import { useSelector, useDispatch } from 'react-redux'
import Loader from '../layout/Loader/Loader';
import { useAlert } from 'react-alert';
// import { keys } from '@material-ui/core/styles/createBreakpoints';
function Home() {
    const alert = useAlert()
    const dispatch = useDispatch();
    const { loading, error, products } = useSelector(state => state.products)
    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }
        dispatch(getProduct());
    }, [dispatch, error, alert])


    return <>
        {loading ? (<Loader />) : (<>
            <Metadata title="E-COMMERCE" />
            <div className='banner'>
                <p>Welcome to Ecommerce</p>
                <h1>Find Amazing Product Below</h1>

                <a href="#container">
                    <button>
                        Scroll <CgMouse />
                    </button>
                </a>
            </div>
            <h2 className='homeHeading'>Featured Products</h2>
            <div className='container' id='container'>
                {products && products.map(product => (

                    <ProductCard
                        key={product._id}
                        product={product} />
                ))}

            </div>
        </>)}
    </>;
}

export default Home