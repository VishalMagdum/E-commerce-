import React from 'react'
import { Link } from 'react-router-dom'
import { Rating } from '@material-ui/lab';

function ProductCard({ product }) {
    const options = {
        value: product.ratings,
        readOnly: true,
        precision: 0.5,
    }
    return (
        <Link className='productCard' to={`product/${product._id}`}>
            <div>
                <img src={product.image[0].url} alt={product.name} />
            </div>
            <p>{product.name}</p>
            <div>
                <Rating {...options} /><span className="productCardSpan">({product.reviews.length} Reviews)</span>

            </div>
            <span>{`₹${product.price}`}</span>
        </Link>
    );
}

export default ProductCard