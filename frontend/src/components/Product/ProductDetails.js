import React, { useEffect, useState } from 'react'
import Carousel from 'react-material-ui-carousel'

import './ProductDetails.css'
import { useSelector, useDispatch } from 'react-redux'
import { clearErrors, getProductDetails, newReview } from '../../actions/productAction'
import { useParams } from 'react-router-dom'
import ReviewCard from './ReviewCard'
import Loader from '../layout/Loader/Loader'
import { useAlert } from 'react-alert'
import Metadata from '../layout/Metadata'
import { addItemsToCart } from '../../actions/cartAction'
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@material-ui/core'
import { Rating } from '@material-ui/lab'
import { NEW_REVIEW_RESET } from '../../constants/productConstants'
function ProductDetails() {

    const dispatch = useDispatch();
    const alert = useAlert()
    const { id } = useParams();
    const { product, loading, error } = useSelector(
        (state) => state.productDetails);
    const { success, error: reviewError } = useSelector(
        (state) => state.newReview
    );
    const increaseQuantity = () => {
        if (product.stock <= quantity) return;
        const qty = quantity + 1
        setQuantity(qty)
    }
    const decreaseQuantity = () => {
        if (1 >= quantity) return;
        const qty = quantity - 1
        setQuantity(qty)
    }

    const [quantity, setQuantity] = useState(1)
    const [open, setOpen] = useState(false)
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const addItemsToCartHandler = () => {
        dispatch(addItemsToCart(id, quantity));
        alert.success("Item Added To Cart")
    }

    const submitReviewToggle = () => {
        open ? setOpen(false) : setOpen(true)
    }
    const reviewSubmitHandler = () => {
        const myForm = new FormData();

        myForm.set("rating", rating);
        myForm.set("comment", comment);
        myForm.set("productId", id);

        dispatch(newReview(myForm));

        setOpen(false);
    };
    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }
        if (reviewError) {
            alert.error(reviewError)
            dispatch(clearErrors())
        }
        if (success) {
            alert.success("Review Submitted Successfully");
            dispatch({ type: NEW_REVIEW_RESET });
        }
        dispatch(getProductDetails(id))
    }, [dispatch, id, error, alert, reviewError, success]);
    const noOfReviews = product.reviews && product.reviews.length
    const options = {

        value: product.ratings,
        size: "large",
        readOnly: true,
        precision: 0.5,
    }

    return (
        <>
            {loading ? (<Loader />) : (<>
                <Metadata title={`${product.name} -- ECOMMERCE`} />
                <div className='ProductDetails'>
                    <div className='image'>
                        <Carousel>
                            {
                                product.image && product.image.map((item, i) => (
                                    <img
                                        className='CarouselImage'
                                        key={item.url}
                                        src={item.url}
                                        alt={`${i} Slide`} />
                                ))
                            }
                        </Carousel>
                    </div>

                    <div>
                        <div className='detailsBlock-1'>
                            <h2>{product.name}</h2>
                            <p>Product # {product._id}</p>

                        </div>
                        <div className='detailsBlock-2'>
                            <Rating {...options} />
                            <span className="detailsBlock-2-span">({noOfReviews} Reviews)</span>
                        </div>
                        <div className='detailsBlock-3'>
                            <h1>{`₹${product.price}`}</h1>
                            <div className='detailsBlock-3-1'>
                                <div className='detailsBlock-3-1-1'>
                                    <button onClick={decreaseQuantity}>-</button>
                                    <input readOnly value={quantity} type="number" />
                                    <button onClick={increaseQuantity}>+</button>
                                </div>
                                <button disabled={product.stock < 1 ? true : false} className='cart' onClick={addItemsToCartHandler}>Add to Cart</button>
                            </div>
                            <p className='p'>
                                Status:
                                <b className={product.stock < 1 ? "redColor" : "greenColor"}>
                                    {product.stock < 1 ? "OutOfStock" : "InStock"}
                                </b>
                            </p>
                        </div>
                        <div className='detailsBlock-4'>
                            Description : <p>{product.description}</p>

                        </div>
                        <button className='submitReview' onClick={submitReviewToggle}>Submit Review</button>
                    </div>
                </div>
                <h3 className='reviewsHeading'>REVIEWS </h3>
                <Dialog
                    aria-labelledby="simple-dialog-title"
                    open={open}
                    onClose={submitReviewToggle}
                >
                    <DialogTitle>Submit Review</DialogTitle>
                    <DialogContent className="submitDialog">
                        <Rating
                            onChange={(e) => setRating(e.target.value)}
                            value={rating}
                            size="large"
                        />

                        <textarea
                            className="submitDialogTextArea"
                            cols="30"
                            rows="5"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        ></textarea>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={submitReviewToggle} color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={reviewSubmitHandler} color="primary">
                            Submit
                        </Button>
                    </DialogActions>
                </Dialog>
                {product.reviews && product.reviews[0] ? (
                    <div className='reviews'>
                        {product.reviews &&
                            product.reviews.map((review) =>
                                <ReviewCard review={review} />)}
                    </div>
                ) : (<p className='noReviews'>No Reviews Yet</p>)}

            </>)}
        </>
    )
}

export default ProductDetails