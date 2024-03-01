"use client";
import { HomeIcon, Instagram, Twitter, Undo2, Youtube } from "lucide-react";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { store } from "../..";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SidePanelEdit } from "./SidePanelEdit";
import { useAuthDetails } from "@/app/components/AuthContext";
import Link from "next/link";

export default function SidePanel() {
  const username = usePathname().split("/")[1];

  const authDetails = useAuthDetails();
  const router = useRouter();
  const [backgroundColor, setBackgroundColor] = useState("");
  const [textColor, setTextColor] = useState("text-white"); // Default text color

  // Function to determine if the background color is light or dark
  //eslint-disable-next-line
  const isColorDark = (color: any) => {
    if (!color) return true; // Default to dark if no color provided

    const hex = color.replace("#", "");
    const c_r = parseInt(hex.substr(0, 2), 16);
    const c_g = parseInt(hex.substr(2, 2), 16);
    const c_b = parseInt(hex.substr(4, 2), 16);
    const brightness = (c_r * 299 + c_g * 587 + c_b * 114) / 1000;

    return brightness < 155; // Threshold of brightness, below which color is considered dark
  };

  const { data } = useQuery<store, AxiosError>(
    ["userDetails", username],
    async () => {
      const response = await axios.get(`/api/publicuser/?username=${username}`);
      return response.data;
    },
    {
      enabled: true,
    }
  );

  useEffect(() => {
    if (data && data.color) {
      setBackgroundColor(data.color);
      setTextColor(isColorDark(data.color) ? "text-white" : "text-black");
    }
  }, [data]);

  // Use a default class along with dynamically setting the background color and text color.
  const dynamicStyle = backgroundColor
    ? { backgroundColor }
    : { backgroundColor: "#E9976A" };

  return (
    data &&
    dynamicStyle && (
      <div
        className={`md:h-screen h-auto w-full  ${textColor}`}
        style={dynamicStyle}
      >
        <div className="flex flex-col items-center  h-full">
          <div>
            <div className="mt-10 flex items-center justify-center">
              {/* User thumbnail or icon, applying dynamic text/icon color */}
              {data.thumbnailUrl ? (
                <Image
                  src={data.thumbnailUrl}
                  alt="User profile"
                  className="w-48 h-48 rounded-full object-cover"
                  width="192"
                  height={192}
                />
              ) : (
                <Image
                  src="/userImage.webp"
                  alt="User profile"
                  className="w-48 h-48 rounded-full object-cover"
                  width="192"
                  height={192}
                />
              )}
            </div>
            <div className="mt-6 flex justify-center">
              <span className="text-4xl font-semibold">{data.storeTitle}</span>
            </div>
            <div className="mt-6 flex justify-center gap-8">
              {/* Social icons, applying dynamic text/icon color */}
              {/* Example for Instagram icon */}
              {data.instagram && (
                <Link
                  href={`https://instagram.com/${data.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className={textColor} />
                </Link>
              )}
              {data.twitter && (
                <Link
                  href={"https://twitter.com/" + data.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter className={textColor} />
                </Link>
              )}
              {data.youtube && (
                <Link
                  href={"https://youtube.com/@/" + data.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Youtube className={textColor} />
                </Link>
              )}
              {data.tiktok && (
                <Link
                  href={"https://tiktok.com/@" + data.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 460 524"
                    fill={textColor === "text-white" ? "white" : "black"}
                    width={24}
                    height={24}
                  >
                    <path
                      d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22.2h0A122.2 122.2 0 0 0 381 102.4a121.4 121.4 0 0 0 67 20.1z"
                      fill="none"
                      stroke={textColor === "text-white" ? "white" : "black"}
                      stroke-width="40"
                    />
                  </svg>
                </Link>
              )}
            </div>
            <div className="flex justify-center text-justified mt-6 ml-10 mb-12 mr-10 text-md">
              <span>{data.storeDescription}</span>
            </div>
          </div>
          {authDetails.token !== undefined &&
            authDetails.storeUrl === username && (
              <div className="mt-auto mb-8 w-3/4 text-sm lg:w-2/3 border rounded-2xl flex justify-between items-center space-x-2 px-2 h-16 bg-input text-foreground">
                <Button
                  onClick={() => {
                    router.push("/dashboard/");
                  }}
                  variant={"ghost"}
                  className="h-12 bg-input text-accent-foreground border border-primary space-x-2 w-2/3 hover:text-foreground"
                >
                  <Undo2 className="w-5 h-5 lg:w-6 lg:h-6" />
                  <span className="text-sm lg:text-base">Home</span>
                  <HomeIcon className="w-5 h-5 lg:w-6 lg:h-6" />
                </Button>
                <SidePanelEdit
                  data={data}
                  username={username}
                  authDetails={authDetails}
                />
                {/* This is button for add feature if we want in future!
              <Button
                onClick={() => {
                  router.push("/dashboard");
                }}
                variant={"ghost"}
                className="h-14 rounded-2xl w-1/4 space-x-2 hover:bg-input hover:text-accent-foreground"
              >
                <Plus className="h-4 w-4 " />
                <span>Add</span>
              </Button> */}
              </div>
            )}
        </div>
      </div>
    )
  );
}
