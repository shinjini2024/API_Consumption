import { 
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender
} from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';

const App = () => {
  const apiUrl = "https://jsonplaceholder.typicode.com/posts";
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Column Definition
  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor("title", {
      header: "Title",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("body", {
      header: "Description",
      cell: (info) => info.getValue(),
    }),
  ];

  // Initialize TanStack Table
  const table = useReactTable({
    data: posts,
    columns,
    initialState: {
      pagination: {
        pageSize: 10
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  async function getAllPosts() {
    try {
      setLoading(true);
      let response = await fetch(apiUrl);
      response = await response.json();
      setPosts(response);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    getAllPosts();
  }, []);

  return (
    <div className='container card p-3 m-3'>
      <h2>Show All Posts</h2>
      
      {loading && (
        <p align="center">
          <img src="./images/preloader.gif" height="100px" width="100px" alt="Loading..." />
        </p>
      )}

      {!loading && (
        <div>
          <table>
            <thead>
              {/* Fixed: getHeaderGroups() instead of getHeaderGroup() */}
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {flexRender(
                        // Fixed: header.column instead of header.columns
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {/* Use getRowModel() or getPaginationRowModel() */}
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        // Fixed: cell.column instead of cell.columns
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;