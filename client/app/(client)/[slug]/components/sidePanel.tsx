"use client";
import { Instagram, Music2, Twitter, User, Youtube } from "lucide-react";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { store } from "../..";

export default function SidePanel() {
  const username = usePathname().substring(1);
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
      onSuccess: (data) => {
        // Update the background color when data is successfully fetched
        if (data.color) {
          setBackgroundColor(data.color);
          // Determine and set text color based on background color brightness
          setTextColor(isColorDark(data.color) ? "text-white" : "text-black");
        }
      },
    }
  );

  // Use a default class along with dynamically setting the background color and text color.
  const dynamicStyle = backgroundColor ? { backgroundColor } : {};

  return (
    <div
      className={`md:h-screen h-auto w-full bg-secondary-foreground ${textColor}`}
      style={dynamicStyle}
    >
      {data && (
        <div className="flex items-center justify-center">
          <div>
            <div className="mt-10 flex items-center justify-center">
              {/* User thumbnail or icon, applying dynamic text/icon color */}
              {data.thumbnailUrl ? (
                <img
                  src={data.thumbnailUrl}
                  alt="User profile"
                  className="w-48 h-48 rounded-full object-cover"
                />
              ) : (
                <User className={textColor} />
              )}
            </div>
            <div className="mt-6 flex justify-center">
              <span className="text-4xl font-semibold">{data.storeTitle}</span>
            </div>
            <div className="mt-6 flex justify-center gap-8">
              {/* Social icons, applying dynamic text/icon color */}
              {/* Example for Instagram icon */}
              {data.instagram && (
                <a
                  href={`https://instagram.com/${data.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className={textColor} />
                </a>
              )}
              {data.twitter && (
                <a
                  href={"https://twitter.com/" + data.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter className={textColor} />
                </a>
              )}
              {data.youtube && (
                <a
                  href={"https://youtube.com/@/" + data.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Youtube className={textColor} />
                </a>
              )}
              <a
                href={"https://tiktok.com/@" + data.tiktok}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Music2 className={textColor} />
              </a>
              {/* Include other social icons similarly */}
            </div>
            <div className="flex justify-center text-justified mt-6 ml-10 mb-12 mr-10 text-md">
              <span>{data.storeDescription}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
