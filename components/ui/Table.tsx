/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

export type Column<T> = {
  key: keyof T | string;
  accessor?: (row: T) => any;
  title: string;

  classNameHeader?: string;
  classNameItem?: string;

  render?: (value: any, row: T) => React.ReactNode;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  className?: string;
  showIndex?: boolean;
};

export const Table = <T,>({
  columns,
  data,
  className = "",
  showIndex = false,
}: TableProps<T>) => {
  return (
    <div
      className={`
        overflow-x-auto
        border
        rounded-xl
        ${className}
      `}
    >
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            {showIndex && (
              <th className=" px-2 py-1 text-left border-b font-semibold w-12 ">
                STT
              </th>
            )}
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={`px-2 py-1 border-b font-semibold text-center ${column.classNameHeader || ""}`}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data?.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {showIndex && (
                <td className="px-2 py-1 border-b text-center">
                  {rowIndex + 1}
                </td>
              )}
              {columns.map((column) => {
                const value = column.accessor
                  ? column.accessor(row)
                  : row[column.key as keyof T];

                return (
                  <td
                    key={String(column.key)}
                    className={`px-2 py-1 border-b ${
                      column.classNameItem || ""
                    }`}
                  >
                    {column.render
                      ? column.render(value, row)
                      : String(value ?? "")}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
