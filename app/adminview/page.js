"use client";
import React, { useMemo, useEffect, useState } from "react";
import { useTable } from "react-table";
import axios from "axios";
import { useRouter } from "next/navigation";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("token");

        const response = await axios.get(
          "http://103.164.54.252:8000/api/users",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: "No",
        accessor: "id",
      },
      {
        Header: "FullName",
        accessor: "first_name",
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: ({ row }) => (
          <div>
            <button className="mr-4 text-blue-600">Edit</button>
            <button className="text-red-700">Delete</button>
          </div>
        ),
      },
    ],
    []
  );

  const tableInstance = useTable({ columns, data: users });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <table {...getTableProps()} className="min-w-full bg-white">
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps()}
                className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                key={column.id}
              >
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} key={row.id}>
              {row.cells.map((cell) => (
                <td
                  {...cell.getCellProps()}
                  className="px-6 py-4 whitespace-no-wrap border-b border-gray-200"
                  key={cell.column.id}
                >
                  {cell.render("Cell")}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function Articles() {
  return (
    <div>
      <h1>Articles</h1>
    </div>
  );
}

export default function Index() {
  const [activeTab, setActiveTab] = useState("users");
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");

    router.push("/");
  };

  return (
    <main className="flex min-h-screen">
      <div className="sidebar">
        <button
          className={`tab ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
        <button
          className={`tab ${activeTab === "articles" ? "active" : ""}`}
          onClick={() => setActiveTab("articles")}
        >
          Articles
        </button>
        <h3 className="mt-60 ml-5 text-red-600" onClick={handleLogout}>
          Log Out
        </h3>
      </div>

      <div className="content">
        {activeTab === "users" && <Users />}
        {activeTab === "articles" && <Articles />}
      </div>

      <style jsx>{`
        .flex {
          display: flex;
        }
        .sidebar {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          margin-right: 20px;
        }
        .tab {
          margin: 10px 0;
          padding: 10px 20px;
          cursor: pointer;
        }
        .active {
          font-weight: bold;
          border-bottom: 4px solid #000;
        }
        .content {
          flex: 1;
        }
      `}</style>
    </main>
  );
}
