import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { fetchWishlistCateogory, fetchWishList } from "../../app/reducer/wishlist-reducer"
import WishlistModel from '../WishlistModel';

const Wishlist = () => {
	const [selectedList, setSelectedList] = useState([]);
	const [showWishlist, setShowWishlist] = useState(false);
	const wishlistCategory = useSelector((state)=>{
		console.log('current state = ', state);
		return state.wishlist && state.wishlist.wishlistCategory
	});
	const wishlist = useSelector((state)=>state.wishlist && state.wishlist.wishlist);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchWishlistCateogory());
	}, []);

	console.log('wishlist ', wishlist);
	return (
		<div className="p-5">
			<div className="row">
				{
					wishlistCategory && wishlistCategory.map((item, index)=>(
						<Card key={index} className="p-4 mt-2" onClick={()=>{
							//setSelectedList(item.listcontents);
							console.log('on item', item);
							dispatch(fetchWishList({lid:item.lid}));
							setShowWishlist(true);
						}}>
							<h3>{item.lname}</h3>
						</Card>
					))
				}
			</div>
			<WishlistModel open={showWishlist} hide={()=>setShowWishlist(false)} productList={wishlist} />
		</div>
	);
}

export default Wishlist;
