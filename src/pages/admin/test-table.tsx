import React from "react";

export default function TestTable() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Sample Table</h1>

            <table className="w-full border border-gray-600 text-sm text-left">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="border px-4 py-2">Name</th>
                        <th className="border px-4 py-2">Age</th>
                        <th className="border px-4 py-2">City</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border px-4 py-2">Alice</td>
                        <td className="border px-4 py-2">25</td>
                        <td className="border px-4 py-2">New York</td>
                    </tr>
                    <tr>
                        <td className="border px-4 py-2">Bob</td>
                        <td className="border px-4 py-2">30</td>
                        <td className="border px-4 py-2">Los Angeles</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}