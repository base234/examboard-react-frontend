import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Image from "@tiptap/extension-image";
import Typography from "@tiptap/extension-typography";
import Heading from "@tiptap/extension-heading";
// import Math from '@tiptap/extension-math'; // Math extension might need to be installed separately
import { MathExtension } from "@aarkue/tiptap-math-extension";
import "katex/dist/katex.min.css";
import { common, createLowlight } from "lowlight"; // Fixed lowlight import
import Placeholder from "@tiptap/extension-placeholder";
// Import TextAlign extension
import TextAlign from "@tiptap/extension-text-align";

// Create the lowlight instance
const lowlight = createLowlight(common);

// Custom extension for resizable images
const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "50%",
        renderHTML: (attributes) => {
          return {
            width: attributes.width,
          };
        },
      },
      height: {
        default: "auto",
        renderHTML: (attributes) => {
          return {
            height: attributes.height,
          };
        },
      },
    };
  },
  addNodeView() {
    return ({ node, editor, getPos }) => {
      const container = document.createElement("div");
      container.classList.add("image-resizer-container");
      container.style.position = "relative";
      container.style.display = "inline-block";
      container.style.maxWidth = "100%";

      const img = document.createElement("img");
      img.src = node.attrs.src;
      img.alt = node.attrs.alt || "";
      img.style.width = node.attrs.width;
      img.style.height = node.attrs.height;
      img.style.display = "block";

      container.appendChild(img);

      // Add resize handles only when the editor is editable
      if (editor.isEditable) {
        // Add resize handles
        const handles = ["nw", "ne", "sw", "se"];
        handles.forEach((position) => {
          const handle = document.createElement("div");
          handle.classList.add("resize-handle", `resize-handle-${position}`);
          handle.setAttribute("data-position", position);

          // Style the handle
          handle.style.position = "absolute";
          handle.style.width = "8px";
          handle.style.height = "8px";
          handle.style.backgroundColor = "#4299e1";
          handle.style.border = "1px solid white";
          handle.style.cursor = "pointer";

          // Position the handle
          if (position === "nw") {
            handle.style.top = "0";
            handle.style.left = "0";
            handle.style.cursor = "nw-resize";
          } else if (position === "ne") {
            handle.style.top = "0";
            handle.style.right = "0";
            handle.style.cursor = "ne-resize";
          } else if (position === "sw") {
            handle.style.bottom = "0";
            handle.style.left = "0";
            handle.style.cursor = "sw-resize";
          } else if (position === "se") {
            handle.style.bottom = "0";
            handle.style.right = "0";
            handle.style.cursor = "se-resize";
          }

          container.appendChild(handle);
        });

        // Add event listeners for resizing
        let startX, startY, startWidth, startHeight;
        let activeHandle = null;

        const onMouseDown = (event) => {
          if (event.target.classList.contains("resize-handle")) {
            event.preventDefault();
            event.stopPropagation();

            activeHandle = event.target.getAttribute("data-position");
            startX = event.clientX;
            startY = event.clientY;
            startWidth = img.getBoundingClientRect().width;
            startHeight = img.getBoundingClientRect().height;

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
          }
        };

        const onMouseMove = (event) => {
          if (!activeHandle) return;

          const deltaX = event.clientX - startX;
          const deltaY = event.clientY - startY;

          let newWidth = startWidth;
          let newHeight = startHeight;

          // Adjust dimensions based on which handle is being dragged
          if (activeHandle.includes("e")) newWidth = startWidth + deltaX;
          if (activeHandle.includes("w")) newWidth = startWidth - deltaX;
          if (activeHandle.includes("s")) newHeight = startHeight + deltaY;
          if (activeHandle.includes("n")) newHeight = startHeight - deltaY;

          // Maintain minimum size
          newWidth = Math.max(50, newWidth);
          newHeight = Math.max(50, newHeight);

          // Update image size
          img.style.width = `${newWidth}px`;
          img.style.height = `${newHeight}px`;
        };

        const onMouseUp = (event) => {
          if (!activeHandle) return;

          // Update the node attributes with new dimensions
          if (typeof getPos === "function") {
            editor
              .chain()
              .focus()
              .command(({ tr }) => {
                tr.setNodeMarkup(getPos(), undefined, {
                  ...node.attrs,
                  width: `${img.getBoundingClientRect().width}px`,
                  height: `${img.getBoundingClientRect().height}px`,
                });
                return true;
              })
              .run();
          }

          activeHandle = null;
          document.removeEventListener("mousemove", onMouseMove);
          document.removeEventListener("mouseup", onMouseUp);
        };

        container.addEventListener("mousedown", onMouseDown);
      }

      return {
        dom: container,
        update: (updatedNode) => {
          if (updatedNode.attrs.src !== node.attrs.src) {
            img.src = updatedNode.attrs.src;
          }
          if (updatedNode.attrs.width !== node.attrs.width) {
            img.style.width = updatedNode.attrs.width;
          }
          if (updatedNode.attrs.height !== node.attrs.height) {
            img.style.height = updatedNode.attrs.height;
          }
          return true;
        },
        destroy: () => {
          if (editor.isEditable) {
            container.removeEventListener("mousedown", onMouseDown);
          }
        },
      };
    };
  },
});

const QuestionEditor = ({ editorContent = "", setPlaceholder = "Start typing...", onUpdate = () => {} }) => {
  const [isEditing, setIsEditing] = useState(true);
  const [htmlContent, setHtmlContent] = useState("");

  const [textColor, setTextColor] = useState("#000000");
  const [highlightColor, setHighlightColor] = useState("#FFFF00");

  // Setup editor with extensions
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        document: true,
        heading: false,
      }),
      Placeholder.configure({
        placeholder: setPlaceholder,
      }),
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Table.configure({
        resizable: true,
        lastColumnResizable: true,
        allowTableNodeSelection: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      ResizableImage.configure({
        inline: true,
        allowBase64: true,
      }),
      Typography,
      // Add TextAlign extension
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right"],
        defaultAlignment: "left",
      }),
      // CodeBlockLowlight.configure({
      //   lowlight,
      // }),
      // Math extension is commented out as it might require a separate installation
      // Math.configure({
      //   // KaTeX options (if needed)
      // }),
      MathExtension.configure({
        evaluation: true,
        katexOptions: { macros: { "\\B": "\\mathbb{B}" } },
        delimiters: "dollar",
      }),
    ],
    content: editorContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setHtmlContent(html);
      onUpdate(html);
    },
  });

  // Update HTML content when editor changes
  useEffect(() => {
    if (editor) {
      setHtmlContent(editor.getHTML());
    }
  }, [editor]);

  // Add CSS for image resizing
  // Add proper CSS for editor content
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
    /* Editor content styles */
    .ProseMirror:focus {
      outline: none;
    }
    .ProseMirror {
      min-height: 300px;
      height: 100%;
      width: 100%;
      overflow-y: auto;
      padding: 0px 16px 20px 16px; /* Remove padding */
    }

    /* Image styles and resize handles */
    .image-resizer-container {
      position: relative;
      display: inline-block;
      max-width: 100%;
      margin: 1em 0;
    }

    .image-resizer-container img {
      display: block;
      max-width: 100%;
    }

    .image-resizer-container .resize-handle {
      position: absolute;
      width: 8px;
      height: 8px;
      background-color: #4299e1;
      border: 1px solid white;
      border-radius: 2px;
    }

    .image-resizer-container .resize-handle-nw {
      top: 0;
      left: 0;
      cursor: nw-resize;
    }

    .image-resizer-container .resize-handle-ne {
      top: 0;
      right: 0;
      cursor: ne-resize;
    }

    .image-resizer-container .resize-handle-sw {
      bottom: 0;
      left: 0;
      cursor: sw-resize;
    }

    .image-resizer-container .resize-handle-se {
      bottom: 0;
      right: 0;
      cursor: se-resize;
    }

    /* Table styles */
    .ProseMirror table {
      border-collapse: collapse;
      table-layout: fixed;
      width: 100%;
      margin: 1em 0;
      overflow: hidden;
    }
    .ProseMirror table td,
    .ProseMirror table th {
      border: 2px solid #ddd;
      padding: 8px;
      position: relative;
      min-width: 100px;
    }
    .ProseMirror table th {
      background-color: #f8f9fa;
      font-weight: bold;
    }

    /* Math styles */
    .math-node {
      display: inline-block;
      margin: 0 0.15em;
      vertical-align: middle;
    }
    .math-node.math-display {
      display: block;
      text-align: center;
      margin: 1em 0;
    }

    /* Text alignment styles */
    .ProseMirror .is-editor-empty:first-child::before {
      content: attr(data-placeholder);
      float: left;
      color: #adb5bd;
      pointer-events: none;
      height: 0;
    }
    .ProseMirror .text-left {
      text-align: left;
    }
    .ProseMirror .text-center {
      text-align: center;
    }
    .ProseMirror .text-right {
      text-align: right;
    }
  `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (!editor) {
    return (
      <div className="w-full p-4 border rounded-md">Loading editor...</div>
    );
  }

  // Function to handle heading selection
  const setHeading = (level) => {
    editor.chain().focus().toggleHeading({ level }).run();
  };

  // Function to handle image upload
  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (event) => {
      if (event.target.files?.length) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            editor
              .chain()
              .focus()
              .setImage({
                src: reader.result,
                width: "300px",
                height: "auto",
              })
              .run();
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const setTextColorHandler = (color) => {
    setTextColor((prevColor) => color);
    editor.chain().focus().setColor(color).run();
  };

  const setHighlightColorHandler = (color) => {
    setHighlightColor(color);
    editor.chain().focus().toggleHighlight({ color: color }).run();
  };

  // Function to add a table
  const addTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  };

  const addRow = () => {
    editor.chain().focus().addRowAfter().run();
  };

  const addColumn = () => {
    editor.chain().focus().addColumnAfter().run();
  };

  // Function to toggle editor/HTML view
  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  // Function to insert a mathematical equation (placeholder since Math extension is commented out)
  const insertMathEquation = () => {
    const equation = prompt("Enter LaTeX equation:");
    if (equation) {
      editor.commands.insertContent({
        type: "inlineMath",
        attrs: { latex: equation },
      });
    }
  };

  // Check if the current selection has a specific mark or node type
  const isActive = (type, options = {}) => {
    return editor.isActive(type, options);
  };

  return (
    <div className="w-full">
      <div className="sticky top-0 z-10 bg-white flex flex-col">
        <div className=" py-1.5 px-2 border-b border-gray-200 flex flex-wrap items-center justify-between gap-1">
          <div className="flex items-center gap-1">
            {/* Heading dropdown */}
            <select
              className="px-2 py-1 mr-1 text-sm rounded border border-gray-300 hover:border-gray-400 cursor-pointer"
              onChange={(e) => setHeading(parseInt(e.target.value))}
              value={
                isActive("heading", { level: 1 })
                  ? 1
                  : isActive("heading", { level: 2 })
                  ? 2
                  : isActive("heading", { level: 3 })
                  ? 3
                  : isActive("heading", { level: 4 })
                  ? 4
                  : isActive("heading", { level: 5 })
                  ? 5
                  : isActive("heading", { level: 6 })
                  ? 6
                  : 0
              }
            >
              <option value="0">Paragraph</option>
              <option value="1">Heading 1</option>
              <option value="2">Heading 2</option>
              <option value="3">Heading 3</option>
              <option value="4">Heading 4</option>
              <option value="5">Heading 5</option>
              <option value="6">Heading 6</option>
            </select>

            <div className="text-gray-300">|</div>

            {/* Basic Formatting */}
            <div className="flex space-x-1">
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-1.5 rounded hover:bg-gray-200 ${
                  isActive("bold") ? "bg-gray-200" : ""
                }`}
                title="Bold"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
                  <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
                </svg>
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-1.5 rounded hover:bg-gray-200 ${
                  isActive("italic") ? "bg-gray-200" : ""
                }`}
                title="Italic"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="19" y1="4" x2="10" y2="4"></line>
                  <line x1="14" y1="20" x2="5" y2="20"></line>
                  <line x1="15" y1="4" x2="9" y2="20"></line>
                </svg>
              </button>
              <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-1.5 rounded hover:bg-gray-200 ${
                  isActive("underline") ? "bg-gray-200" : ""
                }`}
                title="Underline"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path>
                  <line x1="4" y1="21" x2="20" y2="21"></line>
                </svg>
              </button>
              <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`p-1.5 rounded hover:bg-gray-200 ${
                  isActive("strike") ? "bg-gray-200" : ""
                }`}
                title="Strikethrough"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <path d="M16 6C16 6 16.5 8 12 8C8.5 8 7 6.5 7 5C7 3.5 8.5 2.5 12 2.5C14.5 2.5 16 3 16 3"></path>
                  <path d="M8 16C8 16 10 21.5 16 18C18 16.5 16 14.5 14 14C11 13.5 8 16 8 16Z"></path>
                </svg>
              </button>
            </div>

            <div className="text-gray-300">|</div>

            {/* Text Alignment */}
            <div className="flex space-x-1">
              <button
                onClick={() =>
                  editor.chain().focus().setTextAlign("left").run()
                }
                className={`p-1.5 rounded hover:bg-gray-200 ${
                  isActive({ textAlign: "left" }) ? "bg-gray-200" : ""
                }`}
                title="Align Left"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="4" y1="6" x2="20" y2="6"></line>
                  <line x1="4" y1="12" x2="14" y2="12"></line>
                  <line x1="4" y1="18" x2="18" y2="18"></line>
                </svg>
              </button>
              <button
                onClick={() =>
                  editor.chain().focus().setTextAlign("center").run()
                }
                className={`p-1.5 rounded hover:bg-gray-200 ${
                  isActive({ textAlign: "center" }) ? "bg-gray-200" : ""
                }`}
                title="Align Center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="4" y1="6" x2="20" y2="6"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                  <line x1="6" y1="18" x2="18" y2="18"></line>
                </svg>
              </button>
              <button
                onClick={() =>
                  editor.chain().focus().setTextAlign("right").run()
                }
                className={`p-1.5 rounded hover:bg-gray-200 ${
                  isActive({ textAlign: "right" }) ? "bg-gray-200" : ""
                }`}
                title="Align Right"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="4" y1="6" x2="20" y2="6"></line>
                  <line x1="10" y1="12" x2="20" y2="12"></line>
                  <line x1="6" y1="18" x2="20" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="text-gray-300">|</div>

            {/* Lists */}
            <div className="flex space-x-1">
              <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-1.5 rounded hover:bg-gray-200 ${
                  isActive("bulletList") ? "bg-gray-200" : ""
                }`}
                title="Bullet List"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="9" y1="6" x2="20" y2="6"></line>
                  <line x1="9" y1="12" x2="20" y2="12"></line>
                  <line x1="9" y1="18" x2="20" y2="18"></line>
                  <circle cx="5" cy="6" r="2"></circle>
                  <circle cx="5" cy="12" r="2"></circle>
                  <circle cx="5" cy="18" r="2"></circle>
                </svg>
              </button>

              <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-1.5 rounded hover:bg-gray-200 ${
                  isActive("orderedList") ? "bg-gray-200" : ""
                }`}
                title="Numbered List"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="10" y1="6" x2="21" y2="6"></line>
                  <line x1="10" y1="12" x2="21" y2="12"></line>
                  <line x1="10" y1="18" x2="21" y2="18"></line>
                  <path d="M4 6h1v4H4zM4 10h2M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
                </svg>
              </button>
            </div>
          </div>
          {/* HTML Toggle */}
          <button
            onClick={toggleEditing}
            className="p-1 font-medium text-xs border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded cursor-pointer"
          >
            {isEditing ? <i className='fa-solid fa-pencil fa-fw'></i> : "HTML"}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-1 py-1 px-2 border-b border-gray-200">
          {/* Text Color */}
          <label
            className="text-xs flex items-center space-x-1 cursor-pointer p-1.5 rounded hover:bg-gray-200"
            htmlFor="select-text-color"
          >
            <input
              id="select-text-color"
              className="hidden"
              type="color"
              onChange={(e) => setTextColorHandler(e.target.value)}
              title="Text Color"
            />
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              fill={textColor}
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <rect x="0" fill="none" width="24" height="24"></rect>{" "}
                <g>
                  {" "}
                  <path d="M3 19h18v3H3v-3zM15.82 17h3.424L14 3h-4L4.756 17H8.18l1.067-3.5h5.506L15.82 17zm-1.952-6h-3.73l1.868-5.725L13.868 11z"></path>{" "}
                </g>{" "}
              </g>
            </svg>
          </label>

          {/* Highlight Text */}
          <label
            className="text-xs flex items-center space-x-1 cursor-pointer p-1.5 rounded hover:bg-gray-200"
            htmlFor="highlight-text"
          >
            <input
              id="highlight-text"
              className="hidden"
              type="color"
              defaultValue="#FFFF00"
              onChange={(e) => setHighlightColorHandler(e.target.value)}
              title="Highlight Color"
            />
            <svg
              width="16"
              height="16"
              fill={highlightColor}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 52 52"
              enableBackground="new 0 0 52 52"
              xmlSpace="preserve"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path d="M25.9,16l4.3,10h-9l3.9-10H25.9z M48,8v36c0,2.2-1.8,4-4,4H8c-2.2,0-4-1.8-4-4V8c0-2.2,1.8-4,4-4h36 C46.2,4,48,5.8,48,8z M42.5,40.7L30.5,11c-0.3-0.6-0.8-1-1.5-1h-7.1c-0.6,0-1.2,0.4-1.4,1l-11,29.7C9.3,41.3,9.7,42,10.4,42h4.1 c0.6,0,1.2-0.5,1.4-1.1l3.2-8.9h13.4l3.5,8.9c0.2,0.6,0.8,1.1,1.4,1.1h4.1C42.2,42,42.7,41.3,42.5,40.7z"></path>{" "}
              </g>
            </svg>
          </label>

          <div className="text-gray-300">|</div>

          {/* Table */}
          <button
            onClick={addTable}
            className="p-1.5 rounded hover:bg-gray-200"
            title="Insert Table"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="3" y1="15" x2="21" y2="15"></line>
              <line x1="9" y1="3" x2="9" y2="21"></line>
              <line x1="15" y1="3" x2="15" y2="21"></line>
            </svg>
          </button>

          <button
            onClick={addRow}
            className="p-1.5 rounded hover:bg-gray-200"
            title="Add row bottom"
          >
            <svg
              width="14"
              height="14"
              fill="#000000"
              viewBox="0 0 1920 1920"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  d="M1920 1694.118c0 124.574-101.308 225.882-225.882 225.882H225.882C101.422 1920 0 1818.692 0 1694.118V225.882C0 101.308 101.421 0 225.882 0h1468.236C1818.692 0 1920 101.308 1920 225.882v1468.236ZM225.882 790.588v903.53h1468.236v-903.53H225.882Zm1129.412-564.706v338.824h338.824V225.882h-338.824Zm-564.706 0v338.824h338.824V225.882H790.588Zm-564.706 0v338.824h338.824V225.882H225.882Zm338.824 887.492H831.02V847.06h257.958v266.315h266.315v258.07H1088.98v266.203H831.02v-266.202H564.706v-258.07Z"
                  fillRule="evenodd"
                ></path>{" "}
              </g>
            </svg>
          </button>

          <button
            onClick={addColumn}
            className="p-1.5 rounded hover:bg-gray-200"
            title="Add Column to Right"
          >
            <svg
              width="14"
              height="14"
              fill="#000000"
              viewBox="0 0 1920 1920"
              xmlns="http://www.w3.org/2000/svg"
              transform="rotate(90)"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  d="M1694.118 1129.412v-903.53H225.882v903.53h1468.236ZM564.706 1694.118v-338.824H225.882v338.824h338.824Zm564.706 0v-338.824H790.588v338.824h338.824Zm564.706 0v-338.824h-338.824v338.824h338.824ZM0 225.882C0 101.308 101.308 0 225.882 0h1468.236C1818.578 0 1920 101.308 1920 225.882v1468.236c0 124.574-101.421 225.882-225.882 225.882H225.882C101.308 1920 0 1818.692 0 1694.118V225.882Zm1355.294 580.744H1088.98v266.315H831.02V806.626H564.706v-258.07H831.02V282.352h257.958v266.202h266.315v258.07Z"
                  fillRule="evenodd"
                ></path>{" "}
              </g>
            </svg>
          </button>

          <div className="text-gray-300">|</div>

          {/* Image Upload */}
          <button
            onClick={handleImageUpload}
            className="p-1.5 rounded hover:bg-gray-200"
            title="Insert Image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          </button>

          {/* Math Equation */}
          <button
            onClick={insertMathEquation}
            className="p-1.5 rounded hover:bg-gray-200"
            title="Insert Math Equation"
          >
            <svg
              width="14"
              height="14"
              fill="#000000"
              viewBox="0 0 1920 1920"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  d="M1919.989 168.955V394.95h-832.716l-476.16 1251.388-212.78-4.743-194.373-588.537H-.01V827.176h285.515l107.294 77.59L513.08 1268.89 903.857 241.802l105.6-72.847h910.532ZM1265.72 788.99l240.177 240.176 240.162-240.12 159.7 159.586-240.2 240.197 240.2 240.198-159.7 159.586-240.163-240.12-240.176 240.177-159.698-159.7 240.183-240.141-240.183-240.14 159.698-159.7Z"
                  fillRule="evenodd"
                ></path>{" "}
              </g>
            </svg>
          </button>

          {/* Code Block */}
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-1.5 rounded hover:bg-gray-200 ${
              isActive("codeBlock") ? "bg-gray-200" : ""
            }`}
            title="Code Block"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
          </button>
        </div>
      </div>
      {/* Editor Header */}

      {/* Editor Content */}
      <div className="w-full bg-white border border-transparent rounded-b-md">
        {isEditing ? (
          <EditorContent
            editor={editor}
            className="w-full pr-10 md:pr-16 lg:pr-20 pb-10 prose max-w-full"
          />
        ) : (
          <textarea
            value={htmlContent}
            onChange={(e) => {
              setHtmlContent(e.target.value);
              editor.commands.setContent(e.target.value, false);
            }}
            className="w-full min-h-[300px] p-2 font-mono text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
      </div>
    </div>
  );
};

export default QuestionEditor;
