"use client";
import React, { useState } from 'react';

const ProductTable = ({ products }: { products: any[] }) => {
  const [editableProducts, setEditableProducts] = useState(products);

  const handleInputChange = (index: number, field: string, value: any) => {
    const updatedProducts = [...editableProducts];
    updatedProducts[index][field] = value;
    setEditableProducts(updatedProducts);
  };

  const handleSave = (index: number) => {
    const updatedProduct = editableProducts[index];
    console.log('Updated Product:', updatedProduct);
    // Call an API to save the updated product
    // fetch('/api/update-product', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(updatedProduct),
    // });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 border-b">Name</th>
            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 border-b">Unit Type</th>
            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 border-b">Unit Purchase Price</th>
            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 border-b">Unit Sell Price</th>
            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 border-b">Market Value</th>
            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 border-b">Purchase Quantity</th>
            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 border-b">Remaining Quantity</th>
            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 border-b">Purchase Date</th>
            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {editableProducts.map((product, index) => (
            <tr key={index} className="border-b">
              <td className="py-2 px-4 text-sm text-gray-700">
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                  className="w-full border border-gray-300 rounded p-1"
                />
              </td>
              <td className="py-2 px-4 text-sm text-gray-700">{product.unit_type}</td>
              <td className="py-2 px-4 text-sm text-gray-700">
                <input
                  type="number"
                  value={product.unit_purchase_price}
                  onChange={(e) => handleInputChange(index, 'unit_purchase_price', parseFloat(e.target.value))}
                  className="w-full border border-gray-300 rounded p-1"
                />
              </td>
              <td className="py-2 px-4 text-sm text-gray-700">
                <input
                  type="number"
                  value={product.unit_sell_price}
                  onChange={(e) => handleInputChange(index, 'unit_sell_price', parseFloat(e.target.value))}
                  className="w-full border border-gray-300 rounded p-1"
                />
              </td>
              <td className="py-2 px-4 text-sm text-gray-700">
                <input
                  type="number"
                  value={product.market_value}
                  onChange={(e) => handleInputChange(index, 'market_value', parseFloat(e.target.value))}
                  className="w-full border border-gray-300 rounded p-1"
                />
              </td>
              <td className="py-2 px-4 text-sm text-gray-700">
                <input
                  type="number"
                  value={product.purchase_quantity}
                  onChange={(e) => handleInputChange(index, 'purchase_quantity', parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded p-1"
                />
              </td>
              <td className="py-2 px-4 text-sm text-gray-700">
                <input
                  type="number"
                  value={product.remaining_quantity}
                  onChange={(e) => handleInputChange(index, 'remaining_quantity', parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded p-1"
                />
              </td>
              <td className="py-2 px-4 text-sm text-gray-700">{product.created_at}</td>
              <td className="py-2 px-4 text-sm text-gray-700">
                <button
                  onClick={() => handleSave(index)}
                  className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
