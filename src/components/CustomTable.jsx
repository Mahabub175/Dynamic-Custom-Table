import { useEffect, useState } from "react";
import axios from "axios";

const CustomTable = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);

  // given api wasn't working, so I've used this one
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/users`
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = data.filter((item) => {
      return (
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.email.toLowerCase().includes(search.toLowerCase())
      );
    });
    setFilteredData(filtered);
    setTotalPages(Math.ceil(filtered.length / perPage));
    setCurrentPage(1);
  }, [search, data, perPage]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    setFilteredData((prevData) => prevData.slice(startIndex, endIndex));
  }, [currentPage, perPage]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const toggleRowSelection = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-4">Custom Table</h1>

      <input
        type="text"
        placeholder="Search..."
        className="p-2 mb-4 w-full max-w-md bg-gray-800 border border-gray-600 rounded"
        value={search}
        onChange={handleSearch}
      />

      <div className="w-full max-w-4xl overflow-x-auto">
        <table className="w-full border border-gray-600 rounded text-sm">
          <thead>
            <tr className="bg-gray-800">
              <th className="p-2 border border-gray-600">Select</th>
              <th className="p-2 border border-gray-600">ID</th>
              <th className="p-2 border border-gray-600">Name</th>
              <th className="p-2 border border-gray-600">Email</th>
              <th className="p-2 border border-gray-600">Phone</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-700 transition-colors"
                >
                  <td className="p-2 border border-gray-600 text-center">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(item.id)}
                      onChange={() => toggleRowSelection(item.id)}
                      className="form-checkbox bg-gray-800"
                    />
                  </td>
                  <td className="p-2 border border-gray-600 text-center">
                    {item.id}
                  </td>
                  <td className="p-2 border border-gray-600">{item.name}</td>
                  <td className="p-2 border border-gray-600">{item.email}</td>
                  <td className="p-2 border border-gray-600">{item.phone}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="p-4 text-center border border-gray-600"
                >
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center mt-4 space-x-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className={`px-4 py-2 border border-gray-600 rounded ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className={`px-4 py-2 border border-gray-600 rounded ${
            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Next
        </button>
      </div>

      <div className="mt-4">
        <label className="mr-2">Items per page:</label>
        <select
          value={perPage}
          onChange={(e) => setPerPage(Number(e.target.value))}
          className="p-2 bg-gray-800 border border-gray-600 rounded"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>
    </div>
  );
};

export default CustomTable;
