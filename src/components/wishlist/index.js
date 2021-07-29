import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
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

	let productList = _.cloneDeep(wishlist);

	console.log('wishlist ', wishlist);
	return (
		<div className="p-5">
			<div className="row">
				{
					wishlistCategory && wishlistCategory.map((item, index)=>(
						<Card key={index} className="p-4 mt-2" 
						>
							<div className="row">
								<div className="col-10">
									<h3>{item.lname}</h3>
								</div>
								<div className="col-2">
									<Button 
										variant="danger"
										onClick={(event)=>{
										event.preventDefault();
										window._swat.deleteList(item.lid, (deletedListObj)=>{
											// successfully deleted list
											console.log("Deleted list with listid", deletedListObj.lid);
											dispatch(fetchWishlistCateogory());
										  }, (xhrObject)=>{
											// something went wrong
										  });
									}}>Delete</Button>
									<Button 
										className="m-1"
										onClick={()=>{
											//setSelectedList(item.listcontents);
											console.log('on item', item);
											dispatch(fetchWishList({lid:item.lid}));
											setShowWishlist(true);
										}}
									>View</Button>
								</div>
							</div>
						</Card>
					))
				}
			</div>
			<WishlistModel open={showWishlist} hide={()=>setShowWishlist(false)} productList={productList} />
		</div>
	);
}

export default Wishlist;
