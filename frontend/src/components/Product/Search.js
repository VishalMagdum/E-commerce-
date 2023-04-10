import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import "./Search.css"
import Metadata from '../layout/Metadata';
function Search() {

    const navigate = useNavigate()
    const [keyword, setkeyword] = useState("")
    const searchSubmitHandler = (e) => {
        e.preventDefault();
        navigate(keyword.trim() ? `/products/${keyword}` : "/products");
    };

    return <>
        <Metadata title="Serach --ECOMMERCE" />
        <form className='searchBox' onSubmit={searchSubmitHandler}>
            <input type="text"
                placeholder='Search a Product ...'
                onChange={(e) => setkeyword(e.target.value)} />
            <input type="submit" value="Search" />
        </form>
    </>
}

export default Search