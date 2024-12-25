"use client";
import React, { useEffect, useState } from 'react'
import AddProductForm from './AddProductForm';
import ProductTable from './TableOfProducts';
import { Tabs, Tab, Card, CardBody, Button } from "@nextui-org/react";
import Cart from './Purchase';
import AllProductTable from './AllProdsTable';
import Transactions from './Transaction';

const MainPage = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [products, setProducts] = useState([]);
    const [modelActive, setModelActive] = useState(false);

    const fetchProducts = async () => {
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/product');
            if (response.ok) {
                const data = await response.json();
                setProducts(data);
            } else {
                console.error('Failed to fetch products');
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div>
            <div className="flex w-full flex-col">
                <div className="w-full">
                    <div className="flex w-full flex-col">
                        <Tabs aria-label="Options">
                            <Tab key="products" title="Products">
                                <Card>
                                    <CardBody className="flex justify-between items-center">
                                        <button
                                            className="px-4 py-2 rounded-xl text-sm ml-auto my-2 bg-gray-600 hover:bg-gray-800 text-white"
                                            onClick={() => {
                                                setModelActive(true);
                                            }}
                                        >
                                            Add Product
                                        </button>
                                        <div className='w-full'>
                                            {/* <ProductTable products={products} /> */}
                                            <AllProductTable />
                                        </div>
                                    </CardBody>
                                </Card>
                            </Tab>
                            <Tab key="purchase" title="Purchase">
                                <Card>
                                    <CardBody>
                                    <div className='w-full'>
                                            <Cart/>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Tab>
                            <Tab key="transactions" title="Transactions">
                                <Card>
                                    <CardBody>
                                        <Transactions />
                                    </CardBody>
                                </Card>
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </div>
            {modelActive && (
                <div>
                    <div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 py-6">
                        <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-4 relative">
                            {/* Close Button */}
                            <button
                                onClick={() => setModelActive(false)}
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                                aria-label="Close"
                            >
                                &times;
                            </button>
                            <AddProductForm fetchData={fetchProducts} closeModal={()=>{setModelActive(false)}} />
                        </div>
                    </div>
                </div>)}
        </div>
    )
}

export default MainPage;