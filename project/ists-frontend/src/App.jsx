import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/products";

export default function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    quantity: "",
    unit_price: "",
    supplier: "",
    date_added: "",
    status: ""
  });
  const [editingId, setEditingId] = useState(null);

  const fetchProducts = async () => {
    const res = await axios.get(API_URL);
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`${API_URL}/${editingId}`, form);
    } else {
      await axios.post(API_URL, form);
    }
    fetchProducts();
    setForm({
      name: "",
      category: "",
      quantity: "",
      unit_price: "",
      supplier: "",
      date_added: "",
      status: ""
    });
    setEditingId(null);
  };

  const deleteProduct = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchProducts();
  };

  const editProduct = (product) => {
    setForm({
      name: product.name,
      category: product.category,
      quantity: product.quantity,
      unit_price: product.unit_price,
      supplier: product.supplier,
      date_added: product.date_added,
      status: product.status
    });
    setEditingId(product.product_id);
  };

  return (
    <div className="min-h-screen bg-sky-100 p-4"> {/* Sky-gray background */}
      <h1 className="text-2xl font-bold text-center mb-4 text-gray-700">
        Product Management
      </h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-3 rounded shadow-md mb-4 grid grid-cols-2 gap-2 text-sm"
      >
        {Object.keys(form).map((field) => (
          <input
            key={field}
            type={field === "date_added" ? "date" : "text"}
            name={field}
            value={form[field]}
            onChange={handleChange}
            placeholder={field.replace("_", " ").toUpperCase()}
            className="border p-1 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 text-sm"
            required
          />
        ))}

        <button
          className={`col-span-2 p-1 rounded text-sm bg-blue-500 hover:bg-blue-600 text-white`}
        >
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      {/* SHORT SCROLLABLE TABLE */}
      <div className="bg-white rounded shadow overflow-y-auto max-h-72 text-sm">
        <table className="w-full table-auto border-collapse border border-gray-300 text-sm">
          <thead className="sticky top-0 text-xs">
            <tr>
              <th className="border p-1 bg-gray-300">ID</th>
              <th className="border p-1 bg-gray-300">Name</th>
              <th className="border p-1 bg-gray-300">Category</th>
              <th className="border p-1 bg-gray-300">Qty</th>
              <th className="border p-1 bg-gray-300">Price</th>
              <th className="border p-1 bg-gray-300">Supplier</th>
              <th className="border p-1 bg-gray-300">Date</th>
              <th className="border p-1 bg-gray-300">Status</th>
              <th className="border p-1">Action</th> {/* Action column stays normal */}
            </tr>
          </thead>
          <tbody className="bg-gray-50 text-xs">
            {products.map((p) => (
              <tr key={p.product_id} className="hover:bg-gray-100">
                <td className="border p-1 text-center bg-gray-50">{p.product_id}</td>
                <td className="border p-1 bg-gray-50">{p.name}</td>
                <td className="border p-1 bg-gray-50">{p.category}</td>
                <td className="border p-1 text-center bg-gray-50">{p.quantity}</td>
                <td className="border p-1 text-right bg-gray-50">{p.unit_price}</td>
                <td className="border p-1 bg-gray-50">{p.supplier}</td>
                <td className="border p-1 text-center bg-gray-50">{p.date_added}</td>
                <td className="border p-1 text-center bg-gray-50">{p.status}</td>
                <td className="border p-1 text-center flex justify-center gap-1">
                  <button
                    onClick={() => editProduct(p)}
                    className="bg-blue-500 text-white px-2 py-0.5 rounded hover:bg-blue-600 text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(p.product_id)}
                    className="bg-red-500 text-white px-2 py-0.5 rounded hover:bg-red-600 text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
