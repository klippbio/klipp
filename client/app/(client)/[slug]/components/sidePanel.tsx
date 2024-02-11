"use client";
import { Instagram, Mail, Twitter, User, Youtube } from "lucide-react";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { store, storeItem } from "../..";
import axios, { AxiosError } from "axios";

export default function SidePanel() {
  const username = usePathname().substring(1);

  const { data, isLoading, error } = useQuery<store, AxiosError>(
    ["userDetails", username],
    async () => {
      const response = await axios.get(`/api/publicuser/?username=${username}`);
      return response.data;
    },
    {
      enabled: true,
    }
  );

  return (
    <div className="md:h-screen h-auto w-full bg-secondary-foreground">
      {data && (
        <div className="flex items-center justify-center">
          <div>
            <div className="mt-10 flex items-center justify-center">
              {data.thumbnailUrl ? (
                <div>
                  <img
                    src={data.thumbnailUrl}
                    alt="dove"
                    className="w-48 h-48 rounded-full object-cover"
                  />
                </div>
              ) : (
                <div>
                  <User color="white" />
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-center">
              <span className="text-4xl font-semibold text-white">
                {data.storeTitle}
              </span>
            </div>
            <div className="mt-6 flex justify-center gap-8">
              {data.instagram && (
                <a
                  href={"https://instagram.com/" + data.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram color="white" />
                </a>
              )}
              {data.twitter && (
                <a
                  href={"https://twitter.com/" + data.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter color="white" />
                </a>
              )}
              {data.youtube && (
                <a
                  href={"https://youtube.com/@/" + data.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Youtube color="white" />
                </a>
              )}
              {data.tiktok && (
                <a
                  href={"https://tiktok.com/@" + data.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/tiktok-24.png" alt="tiktok" />
                </a>
              )}
            </div>
            <div className="flex justify-center text-justified text-white mt-6 ml-10 mb-12 mr-10 text-md">
              <span>{data.storeDescription}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
