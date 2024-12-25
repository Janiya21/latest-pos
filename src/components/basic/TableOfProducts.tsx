import React from 'react';

const ProductTable = ({ products }:{products:any}) => {
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
            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 border-b">Purchase Date</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product:any, index:any) => (
            <tr key={index} className="border-b">
              <td className="py-2 px-4 text-sm text-gray-700">{product.name}</td>
              <td className="py-2 px-4 text-sm text-gray-700">{product.unit_type}</td>
              <td className="py-2 px-4 text-sm text-gray-700">{product.unit_purchase_price}</td>
              <td className="py-2 px-4 text-sm text-gray-700">{product.unit_sell_price}</td>
              <td className="py-2 px-4 text-sm text-gray-700">{product.market_value}</td>
              <td className="py-2 px-4 text-sm text-gray-700">{product.purchase_quantity}</td>
              <td className="py-2 px-4 text-sm text-gray-700">{product.purchase_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
