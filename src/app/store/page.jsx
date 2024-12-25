'use client';
import { useState } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import '../../../public/styles/page-loader.css';

export default function AddProductForm() {

  const [formData, setFormData] = useState({
    name: '',
    unit_type: '',
    market_value: '',
    purchase_quantity: '',
    unit_purchase_price: '',
    unit_sell_price: '',
    purchase_date: '',
    remaining_quantity: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      remaining_quantity: parseInt(formData.purchase_quantity),
      unit_sell_price: parseFloat(formData.unit_sell_price),
      unit_purchase_price: parseFloat(formData.unit_purchase_price),
      purchase_quantity: parseInt(formData.purchase_quantity),
      market_value: parseFloat(formData.market_value),
    };
  
    NProgress.start();

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log('Product added successfully:', result);
        setFormData({
          name: '',
          unit_type: '',
          market_value: '',
          purchase_quantity: '',
          unit_purchase_price: '',
          unit_sell_price: '',
          purchase_date: '',
        });
        toast({
          description: "Product added successfully!",
          variant: "default",
        });
      } else {
        console.error('Error adding product:', response.statusText);
        toast({
          description: "Failed to add Product !",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        description: "Failed to add Product !",
        variant: "destructive",
      });
    }finally {
      NProgress.done(); // End the loading bar
    }
    
  };
  

  return (
    <div className="max-w-2xl w-full mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      {/* <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Product</h2> */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Unit Type</label>
          <select
            name="unit_type"
            value={formData.unit_type}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="kg">kg</option>
            <option value="liter">liter</option>
            <option value="item">item</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Market Value</label>
          <input
            type="number"
            step="0.01"
            name="market_value"
            value={formData.market_value}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Purchase Quantity</label>
          <input
            type="number"
            name="purchase_quantity"
            value={formData.purchase_quantity}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Unit Purchase Price</label>
          <input
            type="number"
            step="0.01"
            name="unit_purchase_price"
            value={formData.unit_purchase_price}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Unit Sell Price</label>
          <input
            type="number"
            step="0.01"
            name="unit_sell_price"
            value={formData.unit_sell_price}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Purchase Date</label>
          <input
            type="date"
            name="purchase_date"
            value={formData.purchase_date}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}
