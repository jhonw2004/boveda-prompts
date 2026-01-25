import React, { useState, useEffect, useRef } from 'react';
import { X, Hash, Plus } from 'lucide-react';

const TagInput = ({ value, onChange, placeholder = "Añadir etiqueta..." }) => {
    // Convert string "tag1, tag2" to array ["tag1", "tag2"]
    const [tags, setTags] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        if (!value) {
            setTags([]);
            return;
        }
        // Sync internal state with prop if it differs
        const newTags = value.split(',').map(t => t.trim()).filter(Boolean);
        // Only update if length differs or content differs to avoid loops (though simple comparison is usually enough)
        if (JSON.stringify(newTags) !== JSON.stringify(tags)) {
            setTags(newTags);
        }
    }, [value]);

    const updateParent = (newTags) => {
        // Parent expects a comma-separated string based on previous code
        const stringValue = newTags.join(', ');
        // Mock an event object to keep compatible with generic handleChange
        const event = {
            target: {
                name: 'etiquetas',
                value: stringValue
            }
        };
        onChange(event);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag();
        } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
            removeTag(tags.length - 1);
        }
    };

    const addTag = () => {
        const trimmed = inputValue.trim().replace(/^#/, ''); // Remove leading # if user typed it
        if (trimmed && !tags.includes(trimmed)) {
            const newTags = [...tags, trimmed];
            setTags(newTags);
            updateParent(newTags);
            setInputValue('');
        } else if (trimmed === '') {
            setInputValue('');
        }
    };

    const removeTag = (index) => {
        const newTags = tags.filter((_, i) => i !== index);
        setTags(newTags);
        updateParent(newTags);
    };

    return (
        <div
            className={`
                flex flex-wrap items-center gap-1.5 p-1.5 rounded-lg border transition-all duration-200 cursor-text
                ${isFocused
                    ? 'bg-obsidian-900 border-obsidian-700 ring-1 ring-obsidian-700/50'
                    : 'bg-transparent border-transparent hover:bg-obsidian-900/30'
                }
            `}
            onClick={() => inputRef.current?.focus()}
        >
            <div className="text-obsidian-500 shrink-0 select-none mr-1">
                <Hash size={14} className="opacity-70" />
            </div>

            {tags.map((tag, index) => (
                <span
                    key={index}
                    className="
                        inline-flex items-center gap-1 px-2 py-0.5 rounded-md 
                        bg-obsidian-800 text-obsidian-200 text-xs font-medium border border-obsidian-700/50
                        animate-in zoom-in-95 duration-150
                    "
                >
                    <span className="opacity-50 select-none">#</span>
                    {tag}
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeTag(index); }}
                        className="ml-1 text-obsidian-500 hover:text-red-400 focus:outline-none transition-colors"
                    >
                        <X size={10} />
                    </button>
                </span>
            ))}

            <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                    setIsFocused(false);
                    if (inputValue) addTag(); // Add tag on blur if text exists
                }}
                placeholder={tags.length === 0 ? placeholder : ""}
                className="
                    flex-1 min-w-[100px] bg-transparent border-none outline-none 
                    text-sm text-obsidian-200 placeholder-obsidian-600
                "
                autoComplete="off"
            />
        </div>
    );
};

export default TagInput;
