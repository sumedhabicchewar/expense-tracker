import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
  });

  const [message, setMessage] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // GET - Fetch all expenses
  const fetchExpenses = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/expenses"
      );

      setExpenses(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Load expenses when page opens
  useEffect(() => {
    fetchExpenses();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // POST - Add expense / PUT - Update expense
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        // PUT - Update expense
        await axios.put(
          `http://localhost:5000/api/expenses/${editingId}`,
          {
            title: formData.title,
            amount: Number(formData.amount),
            category: formData.category,
            date: formData.date,
          }
        );

        setMessage("Expense updated successfully!");
        setEditingId(null);
      } else {
        // POST - Create expense
        await axios.post(
          "http://localhost:5000/api/expenses",
          {
            title: formData.title,
            amount: Number(formData.amount),
            category: formData.category,
            date: formData.date,
          }
        );

        setMessage("Expense added successfully!");
      }

      // Clear form
      setFormData({
        title: "",
        amount: "",
        category: "",
        date: "",
      });

      // Refresh list
      fetchExpenses();
    } catch (error) {
      console.error(error);

      if (editingId) {
        setMessage("Failed to update expense");
      } else {
        setMessage("Failed to add expense");
      }
    }
  };

  // EDIT - Load expense into form
  const handleEdit = (expense) => {
    setEditingId(expense._id);

    setFormData({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: expense.date
        ? expense.date.split("T")[0]
        : "",
    });

    setMessage("");
  };

  // CANCEL - Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);

    setFormData({
      title: "",
      amount: "",
      category: "",
      date: "",
    });

    setMessage("");
  };

  // DELETE - Delete expense
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/expenses/${id}`
      );

      setMessage("Expense deleted successfully!");

      fetchExpenses();
    } catch (error) {
      console.error(error);
      setMessage("Failed to delete expense");
    }
  };

  // Calculate total expense
  const totalExpense = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Expense Tracker
          </h1>

          <p className="text-gray-500 mt-2">
            Track and manage your daily expenses
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

          {/* Total Income */}
          <div className="bg-white/70 backdrop-blur-lg border border-white/50 p-6 rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <h2 className="text-gray-500 text-sm font-medium">
              Total Income
            </h2>

            <p className="text-3xl font-bold text-gray-900 mt-2">
              ₹0
            </p>
          </div>

          {/* Total Expense */}
          <div className="bg-white/70 backdrop-blur-lg border border-white/50 p-6 rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <h2 className="text-gray-500 text-sm font-medium">
              Total Expense
            </h2>

            <p className="text-3xl font-bold text-gray-900 mt-2">
              ₹{totalExpense}
            </p>
          </div>

          {/* Balance */}
          <div className="bg-white/70 backdrop-blur-lg border border-white/50 p-6 rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <h2 className="text-gray-500 text-sm font-medium">
              Balance
            </h2>

            <p className="text-3xl font-bold text-gray-900 mt-2">
              ₹{0 - totalExpense}
            </p>
          </div>

        </div>

        {/* Add / Edit Expense Form */}
        <div className="bg-white/70 backdrop-blur-lg border border-white/50 rounded-2xl shadow-lg p-6 mb-8 transition-all duration-300 hover:shadow-xl">

          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {editingId ? "Edit Expense" : "Add New Expense"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Food"
                required
                className="w-full bg-white/80 border border-gray-200 rounded-xl px-4 py-3 outline-none transition-all duration-200 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>

              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="e.g. 250"
                required
                min="0"
                className="w-full bg-white/80 border border-gray-200 rounded-xl px-4 py-3 outline-none transition-all duration-200 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full bg-white/80 border border-gray-200 rounded-xl px-4 py-3 outline-none transition-all duration-200 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
              >
                <option value="">
                  Select Category
                </option>

                <option value="Food">
                  Food
                </option>

                <option value="Travel">
                  Travel
                </option>

                <option value="Shopping">
                  Shopping
                </option>

                <option value="Bills">
                  Bills
                </option>

                <option value="Education">
                  Education
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full bg-white/80 border border-gray-200 rounded-xl px-4 py-3 outline-none transition-all duration-200 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">

              <button
                type="submit"
                className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-medium transition-all duration-200 hover:bg-black hover:-translate-y-0.5 hover:shadow-lg"
              >
                {editingId
                  ? "Update Expense"
                  : "Add Expense"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-6 bg-gray-200 text-gray-800 py-3 rounded-xl font-medium transition-all duration-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
              )}

            </div>

          </form>

          {/* Message */}
          {message && (
            <p className="mt-4 text-center font-medium text-gray-700">
              {message}
            </p>
          )}

        </div>

        {/* Expense List */}
        <div className="bg-white/70 backdrop-blur-lg border border-white/50 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">

          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            All Expenses
          </h2>

          {expenses.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No expenses found
            </p>
          ) : (
            <div className="space-y-4">

              {expenses.map((expense) => (
                <div
                  key={expense._id}
                  className="bg-white/60 backdrop-blur-md border border-gray-200/70 rounded-xl p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                >

                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      {expense.title}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      {expense.category}
                    </p>

                    <p className="text-sm text-gray-400 mt-1">
                      {new Date(
                        expense.date
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">

                    <p className="text-lg font-bold text-gray-900">
                      ₹{expense.amount}
                    </p>

                    {/* Edit */}
                    <button
                      onClick={() =>
                        handleEdit(expense)
                      }
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-blue-600 hover:-translate-y-0.5"
                    >
                      Edit
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() =>
                        handleDelete(expense._id)
                      }
                      className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-red-600 hover:-translate-y-0.5"
                    >
                      Delete
                    </button>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default App;