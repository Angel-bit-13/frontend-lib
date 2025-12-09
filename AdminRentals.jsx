import { useEffect, useState } from "react";
import API from "../api/axios";

export default function AdminRentals() {
  const [rentals, setRentals] = useState([]);

  const fetchRentals = async () => {
    try {
      const res = await API.get("/rentals");
      setRentals(res.data);
    } catch (err) {
      console.log("Error fetching rentals:", err);
    }
  };

  const approveRental = async (id) => {
    try {
      await API.put(`/rentals/${id}/approve`);
      fetchRentals();
    } catch (err) {
      console.log("Error approving:", err);
    }
  };

  const returnBook = async (id) => {
    try {
      await API.put(`/rentals/${id}/return`);
      fetchRentals();
    } catch (err) {
      console.log("Error returning:", err);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">Book Rentals</h1>

      <div className="bg-white shadow rounded-lg p-5">
        {rentals.map((r) => (
          <div key={r._id} className="border-b py-3 flex justify-between">

            <div>
              <p><strong>Book:</strong> {r.book.title}</p>
              <p><strong>User:</strong> {r.user.name}</p>
              <p><strong>Status:</strong> {r.status}</p>
            </div>

            <div className="flex gap-2">
              {r.status === "pending" && (
                <button
                  onClick={() => approveRental(r._id)}
                  className="px-3 py-1 bg-green-500 text-white rounded"
                >
                  Approve
                </button>
              )}

              {r.status === "approved" && (
                <button
                  onClick={() => returnBook(r._id)}
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                  Mark Returned
                </button>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
