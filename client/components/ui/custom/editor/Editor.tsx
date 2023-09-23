"use client";
import { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import "./editor.css";
import { generateUploadURL, uploadFile } from "@/app/services/getS3url";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Editor() {
  const [isMounted, setIsMounted] = useState(false);
  const editorRef = useRef();

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

    if (!ref.current) {
      const editor = new EditorJS({
        placeholder: "Type here to write your post...",
        holder: "editorjs",
        data: { blocks: [] },
        onReady() {
          ref.current = editor;
        },
        tools: {
          table: Table,
          quote: Quote,
          header: Header,
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
                  //TODO: Add try catch and toast

                  await uploadFileFromEditor(file, url);
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

  const save = (e: any) => {
    e.preventDefault();
    if (ref.current) {
      ref.current.save().then((outputData) => {
        console.log("Article data: ", outputData);
      });
    }
  };

  return (
    // <div className="border-2 rounded-md" onClick={save}>
    //   <div className="grid w-full gap-10 p-3">
    //     <div className="flex w-full justify-between">
    //       <div className="prose px-8 flex flex-col prose-stone w-full">
    //         <div id="editorjs" className="min-h-[500px]" />
    //         <button type="submit" className={cn(buttonVariants())}>
    //           Save
    //         </button>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div className="border-2 rounded-md">
      <div className="grid p-3 w-full gap-10">
        <div className="flex w-full justify-between">
          <div className="prose px-8 flex flex-col prose-stone w-full">
            <div id="editorjs" className="min-h-[500px]" />
            <button
              type="submit"
              className={cn(buttonVariants())}
              onClick={save}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
