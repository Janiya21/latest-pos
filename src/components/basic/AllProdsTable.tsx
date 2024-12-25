import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

type Product = {
    id: string;
    name: string;
    unit_purchase_price: number;
    unit_sell_price: number;
    market_value: number;
    purchase_quantity: number;
    remaining_quantity: number;
};


const AllProductTable = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const fetchProducts = async (page: number, search = '') => {
        setLoading(true);
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
            const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/api/product/${updatedProduct.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedProduct),
            });
            if (!response.ok) {
                throw new Error('Failed to update product');
            }
            toast({
                description: 'Product added Successful!',
                variant: 'default',
              });
            fetchProducts(currentPage, searchTerm);
        } catch (error) {
            console.error('Error updating product:', error);
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
    );
};

export default AllProductTable;
