import React from 'react';

interface MarkdownWidgetProps {
    data: {
        content: string;
    };
}

export const MarkdownWidget: React.FC<MarkdownWidgetProps> = ({ data }) => {
    if (!data || !data.content) {
        return <div className="p-4 text-gray-500">No markdown content available.</div>;
    }

    // Note: For a real application, you would use a library like 'react-markdown'
    // to safely render markdown content as HTML. For this example, we'll
    // simply display the raw text.
    return (
        <div className="prose max-w-none">
            <p>{data.content}</p>
        </div>
    );
};
