'use client';

import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), {
    ssr: false,
    loading: () => <div className="h-64 bg-gray-50 animate-pulse rounded-lg border border-gray-200"></div>,
});

const modules = {
    toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['clean']
    ],
};

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'color', 'background',
    'align',
    'link', 'image'
];

interface EditorProps {
    value: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: EditorProps) {
    return (
        <div className="bg-white">
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder || 'Nhập nội dung...'}
                className="h-full min-h-[300px]"
            />
            <style jsx global>{`
                .ql-container {
                    min-height: 250px;
                    font-size: 16px;
                    border-bottom-left-radius: 8px;
                    border-bottom-right-radius: 8px;
                }
                .ql-toolbar {
                    border-top-left-radius: 8px;
                    border-top-right-radius: 8px;
                    background: #f9fafb;
                }
                .ql-editor {
                    min-height: 250px;
                }
            `}</style>
        </div>
    );
}
