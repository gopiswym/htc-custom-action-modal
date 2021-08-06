import React, { useState, useEffect } from "react";
import {Form, Modal, Button, Card, Alert } from "react-bootstrap";
import "./style.css";
import * as _ from "lodash";
import { useDispatch } from 'react-redux';
import { fetchWishlistCateogory } from "../../app/reducer/wishlist-reducer"
import ProgressBar from "@ramonak/react-progress-bar";
import { Clipboard } from 'react-bootstrap-icons';
import { CopyToClipboard } from "react-copy-to-clipboard";

const Counter = (props) => {
    let { count, setCount } = props;
    const [quantity, setQuantity] = useState(0);
    
    useEffect(()=>{
        setQuantity(count?count:0);
    },[count]);

    return (
        <div className="row">
            <div className="col-6 h5 d-flex">
                <div className="m-2 text-secondary">Quantity</div>
                <div className="m-2">{quantity}</div>
            </div>
            <div className="col-6 d-flex">
                <div>
                    <Button className="m-1" onClick={()=>{
                        setQuantity(quantity+1);
                        setCount(quantity+1);
                    }}>+</Button>
                </div>
                <div>
                    <Button className="m-1" onClick={()=>{
                        if(quantity>0){
                            setQuantity(quantity-1);
                            setCount(quantity-1);
                        }
                    }}>-</Button>
                </div>
            </div>
        </div>
    )
}

const TotalDetails = (props) => {
    let { selectedList } = props;
    
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(()=>{
        console.log('on calculate total quantity');
        let totalQuantity = 0;
        let price = 0;
        selectedList.map(item=>{
            totalQuantity += item.qty?item.qty:0;
            price += (item.pr*(item.qty?item.qty:0));
        });
        setTotalQuantity(totalQuantity);
        setTotalPrice(price.toFixed(2));
    })

    return (
        <div className="row h5 m-3">
            <div className="p-2"><span className="text-secondary">Total Quantity</span> <sapn className="pl-2">{totalQuantity}</sapn></div>
            <div className="p-2"><span className="text-secondary">Total Price</span> <sapn className="pl-2 text-primary">{totalPrice}</sapn></div>
        </div>
    )
}

const WishlistModel = (props) => {
    
    let { open, hide, productList, userInfo } = props;
    console.log('on open ', productList);
    const dispatch = useDispatch();
    const [ allProducts, setAllProducts ] = useState([]);
    const [ selected, setSelected ] = useState([]);
    const [showAddList, setShowAddList] = useState(false);
    const [newListName, setNewListName] = useState('');
    const [progress, setProgress] = useState(0);
    const [ startLimit, setStartLimit] = useState(0);
    const [ endLimit, setEndLimit] = useState(10);
    const [ permalink, setPermalink] = useState(null);

    const createNewWishlist = ( ) => {
        window._swat.createList({lname: newListName}, ({lid})=>{
            // successfully created list
            console.log("New list created with listid", {lid, selected});
            setNewListName(null);
            dispatch(fetchWishlistCateogory());
            let newList = selected.map((item)=>{
                let { epi, empi, du, qty, note, cprops } = item;
                return { epi, empi, du, qty, note, cprops };
            });
            for(let i=0;i<(Math.ceil(newList.length/10));i++){
                let startIndex = i*10;
                let productlist = newList.slice(startIndex, (startIndex+10));
                console.log('adding dublicate items', { startIndex, productlist})
                window._swat.addProductsToList(lid, productlist, (newListItem)=>{
                    // successfully added list item
                    console.log('on new list added',newListItem);
                    if(i==Math.round(newList.length/10)){
                        dispatch(fetchWishlistCateogory());
                    }
                }, (xhrObj) => {
                    // something went wrong
                    console.log('error add products list',xhrObj);
                });
            }
          }, (xhrObject)=>{
            // something went wrong
            console.log('error = ',xhrObject);
          });
    }

    useEffect(()=>{
        let selectedItems = productList.map((item)=>{
            return {
                ...item,
                qty:item.qty?item.qty:1
            }
        })
        setProgress(0);
        setSelected(selectedItems);
        setAllProducts(selectedItems);
        //setAllProducts(_.cloneDeep(productList));
    },[productList.length])
    
    return (
        <Modal size="lg" className="wishlist-model" show={open} onHide={hide}>
            <Modal.Header closeButton>
                <Modal.Title>Make a draft order</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex">
                    <Form.Check type="checkbox" label="" checked={(selected && selected.length == productList.length)} 
                        onChange={(checkedItem)=>{
                            console.log('on checked change', checkedItem.target.checked);
                            if(checkedItem.target.checked){
                                setSelected(productList);
                            }else{
                                setSelected([]);
                            }
                        }} 
                    className="m-2 p-2" />    
                    <span className="p-2 h5 my-auto">{selected.length} Products Selected</span>
                </div>

                <div className="wishlist-items">
                    { allProducts && allProducts.map((item, index)=>{
                        console.log('product list changed', allProducts);
                        let selectedList = [...selected];
                        let checkedIndex = selected && selected.findIndex(selectedItem=>selectedItem.id==item.id);
                        return (
                            <Card key={index} className="row m-2 p-3" style={{ textDecoration: 'none' }} >
                                <div className="row">
                                    <div  className="justify-content-center col-sm-12 col-md-3 col-lg-3 p-2 d-flex" >
                                        <Form.Check type="checkbox" label="" checked={(checkedIndex>-1)} onChange={(checkedItem)=>{
                                            console.log('on checked change', checkedItem.target.checked);                    if(checkedItem.target.checked){
                                                selectedList.push(item);
                                                setSelected(selectedList);
                                            }else{
                                                selectedList.splice(checkedIndex,1);
                                                setSelected(selectedList);
                                            }
                                        }} className="m-2 p-2" />
                                        <img alt="" height="100" src={item.iu} />
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-8 p-2">
                                        <div className="row">
                                            <div className="col-6 mt-2">
                                                <h4>{item.dt}</h4>
                                                <h2 className="text-primary mt-2">${item.pr.toFixed(2)}</h2>
                                            </div>
                                            <div className="col-6 row">
                                                <Counter count={item.qty?item.qty:1} setCount={(count)=>{
                                                    item.qty = count;
                                                    selectedList[checkedIndex].qty = count;
                                                    setSelected([...selected]);
                                                }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
					    )
                    })}
                </div>
                <div>
                    <TotalDetails selectedList={selected} />
                </div>
                <div className="col-10 m-2">
                    {progress>0 && <ProgressBar variant="success" completed={progress} />}
                </div>
                {permalink && 
                <div>
                    <h5>
                        Generated Permalink
                        <CopyToClipboard text={permalink}>
                            <Button size="md" variant="outline-secondary" className="m-2">
                                <Clipboard />
                            </Button>
                        </CopyToClipboard>
                    </h5> 
                    <Alert variant="secondary" onClose={() => setPermalink(null)} dismissible>
                        <div className="break">
                            <h6>{permalink}</h6>
                            {/* <Alert.Link href={permalink}>
                                
                            </Alert.Link> */}
                        </div>
                    </Alert>
                </div>}
                <Modal size="lg" show={showAddList} onHide={()=>setShowAddList(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create New List</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Wishlist new name</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={newListName}
                                onChange={(event)=>{
                                    setNewListName(event.target.value);
                                }}
                                placeholder="name" />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" disabled={selected.length==0} onClick={()=>{
                            console.log('on Submit, Selected Products',selected);
                            setShowAddList(false);
                            hide();
                            createNewWishlist();
                        }}>
                            Create List
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" className="h5" onClick={hide}>
                    Close
                </Button>
                <Button variant="outline-primary" className="h5" disabled={selected.length==0} onClick={()=>{
                    let { em, fname, lname } = userInfo;
                    console.log('on Submit, Selected Products',selected);
                    let link = `https://swym105.myshopify.com/cart/`;
                    selected.map((item, index)=>{
                        let { epi, qty } = item;
                        link += `${index>0?',':''}${epi}:${qty?qty:1}`; 
                        /* return {
                            id:epi,
                            quantity:qty?qty:1
                        } */
                    });
                    link += `?checkout[email]=${em}&checkout[shipping_address][first_name]=${fname}&checkout[shipping_address][last_name]=${lname}`;
                    setPermalink(link);
                    console.log('on link generated',link);
                }}>
                    Generate PermaLink
                </Button>
                <Button variant="outline-primary" className="h5" disabled={selected.length==0} onClick={()=>{
                    console.log('on Submit, Selected Products',selected);
                    let newList = selected.map((item)=>{
                        let { epi, qty } = item;
                        return {
                            id:epi,
                            quantity:qty?qty:1
                        }
                    })

                    let totalPercent = progress;
                    for(let i=0;i<(Math.ceil(newList.length/10));i++){
                        let startIndex = i*10;
                        let productlist = newList.slice(startIndex, (startIndex+10));
                        console.log('adding dublicate items', { startIndex, productlist});
                        window.fetch('/cart/add.js', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ items:productlist })
                          })
                          .then((response) => {
                                let { status } = response;
                                if(status == 200){
                                    /* let limit = (endLimit+10)<=selected.length?(endLimit+10):selected.length;
                                    setStartLimit(endLimit);
                                    setEndLimit(limit); */
                                    let percent = Math.round((productlist.length/newList.length)*100);
                                    console.log('calculated percent', percent);
                                    totalPercent += percent; 
                                    setProgress(totalPercent);
                                    if(totalPercent>=100){
                                        setTimeout(()=>{
                                            hide();
                                        },4000);
                                    }
                                }else{
                                    alert('Error adding to cart');
                                }
                          },(error)=>{
                              console.log('on error = ', error);
                          });
                    }
                    //newList = newList.slice(startLimit, endLimit);
                    //console.log('new list to add', newList);
                    
                }}>
                    Creat Cart
                </Button>
                <Button 
                    variant="outline-primary" 
                    className="h5"
                    disabled={selected.length==0} 
                    onClick={()=>{
                        console.log('on Submit, Selected Products',selected);
                        setShowAddList(true);
                    }}
                >
                    Duplicate List
                </Button>
            </Modal.Footer>
        </Modal>
    )
};

export default WishlistModel;