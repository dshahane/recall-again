import React from 'react';
import EditCellButton from './EditCellButton';
import DeleteCellButton from './DeleteCellButton';

interface GenericListProps<T> {
    data: T[];
    columns: string[];
    onEdit: (item: T) => void;
    onDelete?: (item: T) => void;
}

const ListView = <T extends { id: string; name: string }>(
    { data, columns, onEdit, onDelete }: GenericListProps<T>
) => {
    if (columns.length < 2 || columns.length > 5) {
        throw new Error("The 'columns' prop must contain between 2 and 5 keys.");
    }

    // Ensure the first two columns are always 'id' and 'name'
    const displayColumns = ['id', 'name', ...columns.slice(2)];

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md">
                <thead>
                <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
                    {displayColumns.map((columnKey) => (
                        <th key={columnKey} className="py-3 px-6">
                            {columnKey.charAt(0).toUpperCase() + columnKey.slice(1).replace(/([A-Z])/g, ' $1')}
                        </th>
                    ))}
                    <th className="py-3 px-6">Actions</th>
                </tr>
                </thead>
                <tbody className="text-gray-700 text-sm">
                {data.length === 0 ? (
                    <tr>
                        <td colSpan={displayColumns.length + 1} className="py-4 px-6 text-center text-gray-500">
                            No items configured yet.
                        </td>
                    </tr>
                ) : (
                    data.map((item) => (
                        <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                            {displayColumns.map((columnKey, index) => (
                                <td key={index} className="py-3 px-6 truncate max-w-xs">
                                    {/* @ts-ignore */}
                                    {item[columnKey] || 'N/A'}
                                </td>
                            ))}
                            <td className="py-3 px-6">
                                <EditCellButton onClick={() => onEdit(item)}>Edit</EditCellButton>
                                {onDelete && (
                                    <>
                                        <label>, </label>
                                        <DeleteCellButton onClick={() => onDelete(item)}>Delete</DeleteCellButton>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
};

export default ListView;