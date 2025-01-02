"use client";
import { useToast } from '@/hooks/use-toast';
import React, { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface Product {
  id: string;
  name: string;
  unit_type: string;
  unit_sell_price: number;
  unit_purchase_price: number;
  remaining_quantity: number;
}

interface CartItem extends Product {
  quantity: number;
  totalPrice: number;
}

interface CartSummary {
  sub_total: number,
  discount: number,
  discounted_price: number,
  total_after_discount: number,
  profit: number,
  original_profit: number,
  adjusted_profit: number
}


const Cart: React.FC<{}> = ({ }) => {
  const modalRef = useRef<HTMLDivElement | null>(null); 
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState<number>(0); // Discount in percentage
  const [total, setTotal] = useState<number>(0);
  const [profit, setProfit] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [productsForTerm, setProductForTerm] = useState<Product[]>([]);
  const [modelActive, setModelActive] = useState(false);
  const [alertData, setAlertData] = useState<CartSummary>();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    calculateTotals();
  }, [cart, discount]);

  useEffect(() => {
    fetchProducts();
  }, [searchTerm]);

  const addToCart = (product: Product, quantity: number) => {
    if (quantity > product.remaining_quantity) {
      alert(`Only ${product.remaining_quantity} units available for ${product.name}`);
      return;
    }

    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === product.id
            ? {
              ...item,
              quantity: item.quantity + quantity,
              totalPrice: (item.quantity + quantity) * product.unit_sell_price,
            }
            : item
        )
      );
    } else {
      setCart((prevCart) => [
        ...prevCart,
        {
          ...product,
          quantity,
          totalPrice: quantity * product.unit_sell_price,
        },
      ]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/api/find-product?name=${searchTerm}`);
      const data = await res.json();
      setProductForTerm(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
    const discountAmount = subtotal * (discount / 100);
    const discountedTotal = subtotal - discountAmount;

    const originalProfit = cart.reduce(
      (sum, item) =>
        sum + (item.unit_sell_price - item.unit_purchase_price) * item.quantity,
      0
    );
    const adjustedProfit = originalProfit - discountAmount;

    setTotal(discountedTotal);
    setProfit(adjustedProfit);
  };

  const handleCheckout = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
    const discountAmount = subtotal * (discount / 100);
    const discountedTotal = subtotal - discountAmount;

    const originalProfit = cart.reduce(
      (sum, item) =>
        sum + (item.unit_sell_price - item.unit_purchase_price) * item.quantity,
      0
    );
    const adjustedProfit = originalProfit - discountAmount;

    // Log the required data
    console.log("Checkout Summary:");
    console.log("Subtotal:", subtotal.toFixed(2));
    console.log("Discount (%):", discount);
    console.log("Discount Amount:", discountAmount.toFixed(2));
    console.log("Total (after discount):", discountedTotal.toFixed(2));
    console.log("Profit Calculation:", `Original Profit - Discount Amount`);
    console.log(
      `Profit: ${originalProfit.toFixed(2)} - ${discountAmount.toFixed(2)} = ${adjustedProfit.toFixed(2)}`
    );

    let obj = {
      sub_total: Number(subtotal.toFixed(2)),
      discount: Number(discount.toFixed(2)),
      discounted_price: Number(discountAmount.toFixed(2)),
      total_after_discount: Number(discountedTotal.toFixed(2)),
      profit: Number(adjustedProfit.toFixed(2)),
      original_profit: Number(originalProfit.toFixed(2)),
      adjusted_profit: Number(adjustedProfit.toFixed(2)),
    }

    setAlertData(obj);

    // Identify and update only changed items
    const changedItems = cart.map((cartItem) => {
      const product = productsForTerm.find((p) => p.id === cartItem.id);
      if (product && product.remaining_quantity !== product.remaining_quantity - cartItem.quantity) {
        return {
          id: cartItem.id,
          remaining_quantity: product.remaining_quantity - cartItem.quantity,
        };
      }
      return null;
    }).filter(Boolean); // Remove null values

    console.log("Changed Items for DB Update:", changedItems);

    if (changedItems.length > 0) {
      fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/update-prods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(changedItems),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('Database update successful:', data);

          fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/transaction', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(obj),
          })
            .then((res) => res.json())
            .then((data) => {
              toast({
                description: 'Transaction successfully!',
                variant: 'default',
              });

            })
            .catch((error) => {
              console.error('Error updating database:', error);
            });

        })
        .catch((error) => {
          console.error('Error updating database:', error);
        });
    }

    // Reset cart and other states after checkout
    setCart([]);
    setDiscount(0);
    setTotal(0);
    setProfit(0);
    setModelActive(false);
  };

  const handlePrint = async () => {
    if (modalRef.current) {
      const canvas = await html2canvas(modalRef.current);
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("checkout-summary.pdf");
    }
  };


  return (
    <div className="container mx-auto p-6">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search products"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-md p-2 w-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>

          <h2 className="text-xl font-semibold mb-4">Products</h2>

          {loading ? (
            <p>Loading Products...</p>
          ) : (<div className="space-y-4">
            {productsForTerm.map((product) => (
              <div
                key={product.id}
                className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-sm"
              >
                <div>
                  <h3 className="text-lg font-medium">{product.name}</h3>
                  <p className="text-sm text-gray-600">
                    {product.unit_type} | Rs.{product.unit_sell_price.toFixed(2)} |{" "}
                    {product.remaining_quantity} left
                  </p>
                </div>
                <button
                  className="px-4 py-2 rounded-xl text-sm ml-auto my-2 bg-gray-600 hover:bg-gray-800 text-white"
                  onClick={() => addToCart(product, 1)}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>)}

        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Cart</h2>
          <div className="bg-white shadow-md rounded-lg p-4">
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center">Your cart is empty.</p>
            ) : (
              <div>
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center border-b border-gray-200 py-2"
                  >
                    <div>
                      <h3 className="text-md font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        {item.quantity} x Rs. {item.unit_sell_price.toFixed(2)} = Rs. {item.totalPrice.toFixed(2)} | <span className="text-green-400">profit {item.unit_sell_price - item.unit_purchase_price}</span>
                      </p>
                    </div>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <div className="mt-4">
                  <div className="py-4">
                    <label className="block mb-2 text-md">
                      Discount (%):
                      <input
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(Number(e.target.value))}
                        className="border rounded-md px-2 py-1 w-full mt-1"
                      />
                    </label>

                    <p className="text-md mt-2">
                      Subtotal: Rs. {cart.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)}
                    </p>
                    <p className="text-md font-semibold">
                      Total (after discount): Rs. {total.toFixed(2)}
                    </p>
                    <p className="text-md font-semibold text-green-500">
                      Profit: Rs. {profit.toFixed(2)}
                    </p>
                  </div>
                </div>

                <button
                  className="bg-blue-800 text-white text-md px-4 py-2 rounded-md w-full mt-4 hover:bg-blue-900"
                  onClick={() => {
                    setModelActive(true);
                  }}
                >
                  Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {modelActive && (
        <div>
          <div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 py-6">
            <div
              ref={modalRef}
              className="bg-white w-full max-w-md rounded-lg shadow-lg p-4 relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setModelActive(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                aria-label="Close"
              >
                &times;
              </button>
              <div className="mt-8 mb-3">
                <h4 className="text-md font-semibold mb-4">
                  Are you sure you want to checkout these items?
                </h4>
              </div>

              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-b border-gray-200 py-2"
                >
                  <div>
                    <h3 className="text-sm">{item.name}</h3>
                    <p className="text-xs text-gray-600">
                      {item.quantity} x Rs. {item.unit_sell_price.toFixed(2)} = Rs. {item.totalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}

              <div className="mt-4">
                <label className="block mb-2 text-sm">Discount: {discount}%</label>
                <label className="block mb-2  text-sm">
                  Subtotal: Rs. {cart.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)}/=
                </label>
                <label className="block mb-2  text-sm">
                  Profit: Rs. <span className="text-green-500">{profit.toFixed(2)}/=</span>
                </label>
                <label className="block mb-2  text-sm font-bold">
                  Total (after discount): Rs. {total.toFixed(2)}/=
                </label>
              </div>

              <button
                onClick={handleCheckout}
                className="bg-blue-800 text-white text-md px-4 py-2 rounded-md w-full mt-4 hover:bg-blue-900"
              >
                Confirm
              </button>

              <button
                onClick={handlePrint}
                className="bg-gray-500 text-white text-md px-4 py-2 rounded-md w-full mt-2 hover:bg-gray-700"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
