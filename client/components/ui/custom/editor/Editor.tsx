"use client";
import { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import "./editor.css";
import { generateUploadURL, uploadFile } from "@/app/services/getS3url";

export default function Editor({ initialBlocks, updateEditorData }) {
  const [isMounted, setIsMounted] = useState(false);
  const editorRef = useRef();
  const [saved, setSaved] = useState(false);

  const ref = useRef<EditorJS>();

  async function getUploadURL() {
    return await generateUploadURL();
  }

  async function uploadFileFromEditor(file: File, url: string) {
    return await uploadFile(url, file);
  }

  const initializeEditor = async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Table = require("@editorjs/table");
    const Quote = require("@editorjs/quote");
    const ImageTool = require("@editorjs/image");
    const Delimiter = require("@editorjs/delimiter");
    const Header = require("@editorjs/header");
    const Alert = require("editorjs-alert");
    const NestedList = require("@editorjs/nested-list");
    const Embed = require("@editorjs/embed");
    const CodeTool = require("@editorjs/code");
    const Marker = require("@editorjs/marker");
    const Underline = require("@editorjs/underline");
    const Paragraph = require("@editorjs/paragraph");
    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editorjs",
        data: {
          blocks: initialBlocks,
        },
        onReady() {
          ref.current = editor;
        },
        tools: {
          table: Table,
          quote: Quote,
          header: Header,
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
            config: {
              placeholder:
                "Type your product description here. Press TAB to get started...",
              preserveBlank: true,
            },
          },
          alert: Alert,
          delimiter: Delimiter,
          underline: Underline,
          code: CodeTool,
          list: {
            class: NestedList,
            inlineToolbar: true,
            config: {
              defaultStyle: "unordered",
            },
          },
          Marker: {
            class: Marker,
          },
          embed: {
            class: Embed,
            config: {
              services: {
                youtube: true,
                instagram: true,
                twitter: true,
                gfycat: true,
              },
            },
          },
          image: {
            class: ImageTool,
            inlineToolbar: false,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const url = await getUploadURL();
                  try {
                    await uploadFileFromEditor(file, url);
                  } catch (error) {
                    console.log(error);
                  }
                  return {
                    success: 1,
                    file: {
                      url: url.split("?")[0],
                    },
                  };
                },
              },
            },
          },
        },
      });
      ref.current = editor;
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await initializeEditor();
    };
    if (isMounted) {
      init();

      return () => {
        if (ref.current) {
          ref.current.destroy();
        }
      };
    }
  }, [isMounted]);

  const save = () => {
    if (ref.current) {
      ref.current.save().then((outputData) => {
        updateEditorData(outputData);
        setSaved(true);
      });
    }
  };

  return (
    <div className="border-2 rounded-md p-7 flex flex-colv w-full">
      <div id="editorjs" className="min-h-[100px] w-full" onBlur={save} />
    </div>
  );
}
