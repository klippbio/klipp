import { Instagram, Mail, Twitter, Youtube } from "lucide-react";
import React from "react";

export default function SidePanel() {
  return (
    <div className="md:h-screen h-auto w-full bg-secondary-foreground">
      <div className="flex items-center justify-center">
        <div>
          <div className="mt-10 flex items-center justify-center">
            <img
              src="/dove.jpeg"
              alt="dove"
              className="w-48 h-48 rounded-full object-cover"
            />
          </div>
          <div className="mt-6 flex justify-center">
            <span className="text-4xl font-semibold text-white">Hello</span>
          </div>
          <div className="mt-6 flex justify-center gap-8">
            <Instagram color="white" />
            <Twitter color="white" />
            <Youtube color="white" />
            <Mail color="white" />
            <img src="/tiktok-24.png" alt="tiktok" />
          </div>
          <div className="flex justify-center text-justified text-white mt-6 ml-10 mb-12 mr-10 text-md">
            <span>
              We make it easy to aggregate social profiles and personally
              relevant content, which empowers users to showcase who they are
              and what they care about. Ultimately, this allows creators to
              understand, grow, and monetise their audience.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
