import React, { useState, useEffect } from "react";

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

const Cart: React.FC<{}> = ({ }) => { 
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState<number>(0); // Discount in percentage
  const [total, setTotal] = useState<number>(0);
  const [profit, setProfit] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [productsForTerm, setProductForTerm] = useState<Product[]>([]);

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
    try {
      const res = await fetch(`/api/find-product?name=${searchTerm}`);
      const data = await res.json();
      setProductForTerm(data);
    } catch (error) {
      console.error("Error fetching products:", error);
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
    const updatedProducts = productsForTerm.map((product) => {
      const cartItem = cart.find((item) => item.id === product.id);
      if (cartItem) {
        return {
          ...product,
          remaining_quantity: product.remaining_quantity - cartItem.quantity,
        };
      }
      return product;
    });

    console.log("Cart Items:", cart);
    console.log("Updated Products:", updatedProducts);

    setCart([]); // Reset cart after checkout
    setDiscount(0); // Reset discount
    setTotal(0); // Reset total
    setProfit(0); // Reset profit
    alert("Checkout successful!");
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">Point of Sale (POS)</h1>

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
          <div className="space-y-4">
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
          </div>
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
                      <h3 className="text-lg font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        {item.quantity} x Rs. {item.unit_sell_price.toFixed(2)} = Rs. {item.totalPrice.toFixed(2)}
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
                  <label className="block mb-2 font-medium">
                    Discount (%):
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value))}
                      className="border rounded-md px-2 py-1 w-full mt-1"
                    />
                  </label>
                  <p className="text-lg font-semibold mt-2">
                    Subtotal: Rs. {cart.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)}
                  </p>
                  <p className="text-lg font-semibold">
                    Total (after discount): Rs. {total.toFixed(2)}
                  </p>
                  <p className="text-lg font-semibold text-green-500">
                    Profit: Rs. {profit.toFixed(2)}
                  </p>
                </div>

                <button
                  className="bg-blue-800 text-white text-md px-4 py-2 rounded-md w-full mt-4 hover:bg-blue-900"
                  onClick={handleCheckout}
                >
                  Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
