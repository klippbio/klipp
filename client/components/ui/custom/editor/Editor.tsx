/* eslint-disable */
//@ts-nocheck
"use client";
import { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import "./editor.css";
import {
  deleteFile,
  generateUploadURL,
  uploadFile,
} from "@/app/services/getS3url";
import { read } from "fs";
import { String } from "aws-sdk/clients/cognitosync";

export default function Editor({
  initialBlocks,
  updateEditorData,
  isReadonly,
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [deleteUrls, setDeleteUrls] = useState<string[]>([]);

  const ref = useRef<EditorJS>();

  async function getUploadURL(type: string) {
    return await generateUploadURL(type);
  }

  async function uploadFileFromEditor(file: File, url: string) {
    const awsUrl = await uploadFile(url, file);

    return awsUrl;
  }

  const initializeEditor = async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
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
        minHeight: 0,
        readOnly: isReadonly,
        data: {
          blocks: initialBlocks,
        },
        onReady() {
          ref.current = editor;
        },
        async onChange(api, event) {
          if (event) {
            if (Array.isArray(event)) {
              event.forEach(async (blockEvent) => {
                if (blockEvent.type === "block-removed") {
                  const removedBlock = await blockEvent.detail.target.save(); // Access the removed block
                  if (
                    removedBlock &&
                    removedBlock.data.file &&
                    removedBlock.data.file.url
                  ) {
                    setDeleteUrls((prev) => [
                      ...prev,
                      removedBlock.data.file.url,
                    ]);
                  }
                }
              });
            } else {
              if (event.type === "block-removed") {
                const removedBlock = await event.detail.target.save();
                if (
                  removedBlock &&
                  removedBlock.data.file &&
                  removedBlock.data.file.url
                ) {
                  setDeleteUrls((prev) => [
                    ...prev,
                    removedBlock.data.file.url,
                  ]);
                }
              }
            }
          }
          if (!isReadonly) {
            editor.save().then((outputData) => {
              console.log("Article data: ", outputData);
              updateEditorData(outputData);
            });
          }
          // setSaved(false);
        },
        tools: {
          header: Header,
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
            config: {
              placeholder: isReadonly
                ? ""
                : "Type your product description here. Press TAB to get started...",
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
            inlineToolbar: true,
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
                  try {
                    const url = await getUploadURL(file.type as String);
                    const awsUrl = await uploadFileFromEditor(file, url);
                    return {
                      success: 1,
                      file: {
                        url: awsUrl, // Update with the actual AWS URL
                      },
                    };
                  } catch (error) {
                    console.error("Error uploading the file:", error);
                    return {
                      success: 0,
                      file: {
                        url: "", // You can specify a placeholder URL or leave it empty
                      },
                    };
                  }
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

      return async () => {
        console.log("Unmounting editor");
        if (ref.current) {
          if (!isReadonly) {
            await ref.current.save().then((outputData) => {
              console.log("Article data final: ", outputData);
              updateEditorData(outputData);
            });
          }
          console.log("Destroying editor");
          ref.current.destroy();
        }
      };
    }
  }, [isMounted]);

  // const save = () => {
  //   console.log("sac e called");
  //   if (ref.current && !isReadonly) {
  //     ref.current.save().then((outputData) => {
  //       console.log("Article data: ", outputData);
  //       updateEditorData(outputData);
  //     });
  //   }
  // };

  useEffect(() => {
    const deleteFiles = async () => {
      for (const url of deleteUrls) {
        await deleteFile(url);
      }
    };

    if (deleteUrls.length > 0) {
      deleteFiles().then(() => {
        setDeleteUrls([]);
      });
    }
  }, [deleteUrls]);

  return (
    <div className="rounded-md flex w-full">
      <div id="editorjs" className=" w-full" />
    </div>
  );
}
