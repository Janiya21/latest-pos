import React, { useEffect, useState } from 'react';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchTransactions = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/api/transaction?page=${page}&limit=10`);
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      const data = await response.json();
      setTransactions(data.data);
      setCurrentPage(data.page);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Transactions</h1>
      {loading ? (
        <p>Loading transactions...</p>
      ) : (
        <div>
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 border-b">ID</th>
                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 border-b">Sub Total</th>
                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 border-b">Discount</th>
                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 border-b">Discounted Price</th>
                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 border-b">Total After Discount</th>
                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 border-b">Profit</th>
                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 border-b">Created At</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction: any) => (
                <tr key={transaction.id} className="border-b">
                  <td className="py-2 px-4 text-sm text-gray-700">{transaction.id}</td>
                  <td className="py-2 px-4 text-sm text-gray-700">{transaction.sub_total.toFixed(2)}</td>
                  <td className="py-2 px-4 text-sm text-gray-700">{transaction.discount.toFixed(2)}</td>
                  <td className="py-2 px-4 text-sm text-gray-700">{transaction.discounted_price.toFixed(2)}</td>
                  <td className="py-2 px-4 text-sm text-gray-700">{transaction.total_after_discount.toFixed(2)}</td>
                  <td className="py-2 px-4 text-sm text-gray-700">{transaction.profit.toFixed(2)}</td>
                  <td className="py-2 px-4 text-sm text-gray-700">{new Date(transaction.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <p>
              Page {currentPage} of {totalPages}
            </p>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
