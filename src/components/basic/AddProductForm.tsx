'use client';
import { useState } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import '../../../public/styles/page-loader.css';
import { useToast } from '@/hooks/use-toast';

interface ProductProps {
  closeModal: () => void;
  fetchData: () => void;
}

const AddProductForm: React.FC<ProductProps> = ({fetchData, closeModal}) => {
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    unit_type: '',
    market_value: '',
    purchase_quantity: '',
    unit_purchase_price: '',
    unit_sell_price: '',
  });

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();

    const data = {
      ...formData,
      remaining_quantity: parseInt(formData.purchase_quantity || "0"),
      unit_sell_price: parseFloat(formData.unit_sell_price || "0"),
      unit_purchase_price: parseFloat(formData.unit_purchase_price || "0"),
      purchase_quantity: parseInt(formData.purchase_quantity || "0"),
      market_value: parseFloat(formData.market_value || "0"),
    };

    NProgress.start();

    try {
      const response = await fetch('/api/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        setFormData({
          name: '',
          unit_type: '',
          market_value: '',
          purchase_quantity: '',
          unit_purchase_price: '',
          unit_sell_price: '',
        });

        toast({
          description: 'Product added successfully!',
          variant: 'default',
        });
        
      } else {
        const errorDetails = await response.json();
        console.error('Error adding product:', errorDetails.error);
        toast({
          description: 'Failed to add Product. Please check the details.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        description: 'Something went wrong. Try again later.',
        variant: 'destructive',
      });
    } finally {
      NProgress.done();
      closeModal();
      fetchData();
    }
  };

  return (
    <div className="max-w-2xl w-full mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            placeholder="Product Name"
            aria-label="Product Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 py-2 block w-full rounded-md shadow-sm focus:border-gray-200 focus:ring-gray-200"
            required
          />
        </div>
        <div>
          <select
            name="unit_type"
            value={formData.unit_type}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md py-2 text-gray-400 border-gray-300 shadow-sm focus:border-gray-200 focus:ring-gray-200"
            required
          >
            <option value="" disabled>
              Select Unit Type
            </option>
            <option value="kg">kg</option>
            <option value="liter">liter</option>
            <option value="item">item</option>
          </select>
        </div>
        <div>
          <input
            placeholder="Market Value"
            type="number"
            step="0.01"
            name="market_value"
            value={formData.market_value}
            onChange={handleChange}
            className="mt-1 block w-full py-2 rounded-md border-gray-300 shadow-sm focus:border-gray-200 focus:ring-gray-200"
            required
          />
        </div>
        <div>
          <input
            placeholder="Purchase Quantity"
            type="number"
            name="purchase_quantity"
            value={formData.purchase_quantity}
            onChange={handleChange}
            className="mt-1 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-200 focus:ring-gray-200"
            required
          />
        </div>
        <div>
          <input
            placeholder="Unit Purchase Price"
            type="number"
            step="0.01"
            name="unit_purchase_price"
            value={formData.unit_purchase_price}
            onChange={handleChange}
            className="mt-1 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-200 focus:ring-gray-200"
            required
          />
        </div>
        <div>
          <input
            placeholder="Unit Sell Price"
            type="number"
            step="0.01"
            name="unit_sell_price"
            value={formData.unit_sell_price}
            onChange={handleChange}
            className="mt-1 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-200 focus:ring-gray-200"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gray-600 text-white py-2 px-4 rounded-md shadow hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}

export default AddProductForm;