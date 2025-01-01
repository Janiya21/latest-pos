"use client";
import { useToast } from '@/hooks/use-toast';
import { Card, CardBody, Tab, Tabs } from "@nextui-org/react";
import React, { useEffect, useState } from 'react';
import AddProductForm from './AddProductForm';
import Cart from './Purchase';
import Transactions from './Transaction';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import '../../../public/styles/page-loader.css';

type Product = {
    id: string;
    name: string;
    unit_purchase_price: number;
    unit_sell_price: number;
    market_value: number;
    purchase_quantity: number;
    remaining_quantity: number;
};

const MainPage = () => {
    const [modelActive, setModelActive] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const fetchProducts = async (page: number, search = '') => {
        setLoading(true);
        NProgress.start();
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/api/prods-by-page?page=${page}&search=${search}`);
            const data = await response.json();
            setProducts(data.products); // Type is correctly inferred now
            setTotalPages(data.totalPages);
        } catch (error) {
            toast({
                description: 'Product added Failed!',
                variant: 'destructive',
            });
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
            NProgress.done();
        }
    };

    useEffect(() => {
        fetchProducts(currentPage, searchTerm);
    }, [currentPage, searchTerm]);

    const handleInputChange = (index: number, field: keyof Product, value: any) => {
        const updatedProducts = [...products];
        updatedProducts[index] = { ...updatedProducts[index], [field]: value };
        setProducts(updatedProducts);
    };

    const handleSave = async (index: number) => {
        const updatedProduct = products[index];
        try {
            NProgress.start();
            const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/api/product/${updatedProduct.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedProduct),
            });
            if (!response.ok) {
                throw new Error('Failed to update product');
            }
            toast({
                description: 'Product Updated Successful!',
                variant: 'default',
            });
            fetchProducts(currentPage, searchTerm);
        } catch (error) {
            console.error('Error updating product:', error);
        } finally {
            NProgress.done();
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to the first page when searching
    };

    const renderPagination = () => (
        <div className="flex justify-center items-center space-x-2 mt-4">
            <button
                className="px-3 py-1 bg-gray-300 rounded-md hover:bg-gray-400"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
            >
                Previous
            </button>
            <span>
                Page {currentPage} of {totalPages}
            </span>
            <button
                className="px-3 py-1 bg-gray-300 rounded-md hover:bg-gray-400"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        </div>
    );

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
                                            <div>
                                                <div className="mb-4">
                                                    <input
                                                        type="text"
                                                        placeholder="Search products"
                                                        value={searchTerm}
                                                        onChange={handleSearchChange}
                                                        className="border rounded-md p-2 w-full"
                                                    />
                                                </div>

                                                <div className="overflow-x-auto">
                                                    <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                                                        <thead className="bg-gray-100">
                                                            <tr>
                                                                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 border-b">Name</th>
                                                                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 border-b">Unit Purchase Price</th>
                                                                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 border-b">Unit Sell Price</th>
                                                                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 border-b">Market Value</th>
                                                                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 border-b">Purchase Quantity</th>
                                                                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 border-b">Remaining Quantity</th>
                                                                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 border-b">Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {loading ? (
                                                                <tr>
                                                                    <td colSpan={7} className="py-4 text-center text-gray-500">
                                                                        Loading...
                                                                    </td>
                                                                </tr>
                                                            ) : (
                                                                products.map((product: any, index: number) => (
                                                                    <tr key={product.id} className="border-b">
                                                                        <td className="py-2 px-4 text-sm text-gray-700">
                                                                            <input
                                                                                type="text"
                                                                                value={product.name}
                                                                                onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                                                                                className="border rounded-md px-2 py-1 w-full"
                                                                            />
                                                                        </td>
                                                                        <td className="py-2 px-4 text-sm text-gray-700">
                                                                            <input
                                                                                type="number"
                                                                                value={product.unit_purchase_price}
                                                                                onChange={(e) => handleInputChange(index, 'unit_purchase_price', parseFloat(e.target.value))}
                                                                                className="border rounded-md px-2 py-1 w-full"
                                                                            />
                                                                        </td>
                                                                        <td className="py-2 px-4 text-sm text-gray-700">
                                                                            <input
                                                                                type="number"
                                                                                value={product.unit_sell_price}
                                                                                onChange={(e) => handleInputChange(index, 'unit_sell_price', parseFloat(e.target.value))}
                                                                                className="border rounded-md px-2 py-1 w-full"
                                                                            />
                                                                        </td>
                                                                        <td className="py-2 px-4 text-sm text-gray-700">
                                                                            <input
                                                                                type="number"
                                                                                value={product.market_value}
                                                                                onChange={(e) => handleInputChange(index, 'market_value', parseFloat(e.target.value))}
                                                                                className="border rounded-md px-2 py-1 w-full"
                                                                            />
                                                                        </td>
                                                                        <td className="py-2 px-4 text-sm text-gray-700">
                                                                            <input
                                                                                type="number"
                                                                                value={product.purchase_quantity}
                                                                                onChange={(e) => handleInputChange(index, 'purchase_quantity', parseInt(e.target.value, 10))}
                                                                                className="border rounded-md px-2 py-1 w-full"
                                                                            />
                                                                        </td>
                                                                        <td className="py-2 px-4 text-sm text-gray-700">
                                                                            <input
                                                                                type="number"
                                                                                value={product.remaining_quantity}
                                                                                onChange={(e) => handleInputChange(index, 'remaining_quantity', parseInt(e.target.value, 10))}
                                                                                className="border rounded-md px-2 py-1 w-full"
                                                                            />
                                                                        </td>
                                                                        <td className="py-2 px-4 text-sm text-gray-700">
                                                                            <button
                                                                                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-800"
                                                                                onClick={() => handleSave(index)}
                                                                            >
                                                                                Save
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>

                                                {renderPagination()}
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Tab>
                            <Tab key="purchase" title="Purchase">
                                <Card>
                                    <CardBody>
                                        <div className='w-full'>
                                            <Cart />
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
                            <AddProductForm fetchData={fetchProducts} closeModal={() => { setModelActive(false) }} />
                        </div>
                    </div>
                </div>)}
        </div>
    )
}

export default MainPage;