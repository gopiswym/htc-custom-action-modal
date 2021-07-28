import React, { useState, useEffect } from "react";
import {Form, Modal, Button, Card } from "react-bootstrap";
import "./style.css";

const WishlistModel = (props) => {
    
    let { open, hide, productList } = props;
    console.log('on open ', productList);
    const [ selected, setSelected ] = useState([]);

    useEffect(()=>{
        setSelected(productList);
    },[productList.length])
    
    return (
        <Modal size="lg" show={open} onHide={hide}>
            <Modal.Header closeButton>
                <Modal.Title>Make a draft order</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>Products</div>
                <div>
                    { productList && productList.map((item, index)=>{
                        let selectedList = [...selected];
                        let checkedIndex = selected && selected.findIndex(selectedItem=>selectedItem.id==item.id);

                        return (
                            <Card key={index} className="row m-2 p-3" as="a" href={item.du} style={{ textDecoration: 'none' }} >
                                <div className="row">
                                    <div  className="col-sm-12 col-md-3 col-lg-3 p-2 d-flex" >
                                        <Form.Check type="checkbox" label="" checked={(checkedIndex>-1)} onChange={(checkedItem)=>{
                                            console.log('on checked change', checkedItem.target.checked);
                                            if(checkedItem.target.checked){
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
                                        <h4>{item.dt}</h4>
                                        <h5>${item.pr}</h5>
                                    </div>
                                </div>
                            </Card>
					    )
                    })}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={hide}>
                    Close
                </Button>
                <Button variant="primary" disabled={selected.length==0} onClick={()=>{
                    console.log('on Submit, Selected Products',selected);
                }}>
                    Submit
                </Button>
            </Modal.Footer>
        </Modal>
    )
};

export default WishlistModel;