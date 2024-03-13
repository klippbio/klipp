"use client";
// Import necessary hooks and components from DndKit
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import UsernameNotfound from "./UsernameNotfound";
import { store, storeItem } from "../..";
import getSymbolFromCurrency from "currency-symbol-map";

import { SortableItem } from "./SortableItem";
import { Card } from "@/components/ui/card";
import { Link, ExternalLink } from "lucide-react";
import { useAuthDetails } from "@/app/components/AuthContext";
import AxiosApi from "@/app/services/axios";
import { toast } from "@/components/ui/use-toast";
import { ErrorResponse } from "@/types/apiResponse";
import { cn } from "@/lib/utils";
import ProductCard from "./ProductCard";
import Image from "next/image";

type UpdateOrderPayload = {
  id: number;
  itemOrder: number;
}[];

export default function ProfileCards() {
  const router = useRouter();
  const authDetails = useAuthDetails();

  const username = usePathname().substring(1).toLowerCase();

  const { data, error } = useQuery<store, AxiosError>(
    ["allProducts", username],
    async () => {
      const response = await axios.get(`/api/publicuser/?username=${username}`);
      return response.data;
    },
    {
      enabled: true,
    }
  );

  // State to track items
  const [isDragging, setIsDragging] = useState(false);
  const [items, setItems] = useState(data?.storeItems || []);
  const originalItemsRef = useRef<storeItem[]>([]);

  const mouseSensorOptions = {
    // Delay in milliseconds before the drag starts (optional)
    activationConstraint: {
      delay: 100, // Delay in milliseconds, adjust based on your needs
      distance: 10, // Minimum distance (pixels) the pointer must move to start dragging
      tolerance: 5, // Movement in pixels
    },
  };

  const touchSensorOptions = {
    // Similar adjustments for touch devices
    activationConstraint: {
      delay: 250, // Delay in milliseconds, increases tap recognition
      tolerance: 5, // Movement in pixels
    },
  };

  useEffect(() => {
    if (data?.storeItems) setItems(data?.storeItems);
  }, [data]);
  const sensors = useSensors(
    useSensor(MouseSensor, mouseSensorOptions),
    useSensor(TouchSensor, touchSensorOptions)
  );

  // Handle drag end to reorder items
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over !== null && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);

      // Store the original items before updating
      originalItemsRef.current = [...items] as storeItem[];

      // Prepare the updatedOrders for the mutation
      const updatedOrders = newItems.map((item, index) => ({
        id: item.id,
        itemOrder: index,
      }));

      // Call mutate with updatedOrders and originalItems as context
      updateOrderMutation.mutate(updatedOrders);
    }
  };

  const updateOrderMutation = useMutation({
    mutationFn: async (updatedOrders: UpdateOrderPayload) => {
      const response = await AxiosApi(
        "POST",
        `/api/changeOrder/`,
        updatedOrders,
        authDetails
      );
      return response.data;
    },
    onSuccess: async () => {
      toast({
        title: "Updated successfully",
        duration: 500,
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      // Revert to the original items stored in the ref
      setItems(originalItemsRef.current);
      toast({
        title: "Error",
        variant: "destructive",
        duration: 2000,
        description: error?.response?.data?.error || "An error occurred",
      });
    },
  });

  if (error?.response?.status === 404) {
    return <UsernameNotfound username={username} />;
  }

  if (error?.response?.status === 500) {
    throw Error("Internal Server Error");
  }

  const currency =
    Array.isArray(data?.storeItems) &&
    (data?.storeItems?.length ?? 0) > 0 &&
    Array.isArray(data?.storeItems[0].currency) &&
    (data?.storeItems[0].currency.length ?? 0) > 0
      ? data?.storeItems[0].currency[0].toUpperCase()
      : "";

  const currencySymbol = getSymbolFromCurrency(currency as string);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(event) => {
        handleDragEnd(event);
        // Ensure to reset isDragging after a short delay to account for click latency
        setTimeout(() => setIsDragging(false), 0);
      }}
    >
      {items.length > 0 && (
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={rectSortingStrategy}
        >
          <div className="flex w-full flex-wrap p-6">
            {items.length > 0
              ? items.map((item: storeItem) => (
                  <SortableItem
                    key={item.id}
                    id={item.id}
                    disabled={
                      authDetails.storeUrl !== username.toLowerCase()
                        ? true
                        : false
                    }
                  >
                    {item.itemType === "LINK" ? (
                      <div className="w-full" key={item.id}>
                        <Card
                          className={cn(
                            "w-full h-44 rounded-lg hover:bg-primary-background overflow-hidden hover:shadow-md",
                            authDetails.storeUrl !== username.toLowerCase()
                              ? "cursor-pointer"
                              : "cursor-move"
                          )}
                          key={item.name}
                          onClick={(e) => {
                            if (!isDragging) {
                              e.preventDefault();
                              window.open(item.linkUrl, "_blank");
                            }
                          }}
                        >
                          <div className="">
                            <div className="text-xl font-bold text-bold text-secondary-foreground">
                              <div className="flex flex-row justify-between">
                                <div className="p-4 bg-secondary rounded-md">
                                  {item.thumbnailUrl ? (
                                    <div>
                                      {" "}
                                      <Image
                                        src={item.thumbnailUrl}
                                        alt="Thumbnail"
                                        width={1000}
                                        height={1000}
                                        className="h-36 rounded-md w-36 object-cover"
                                      />
                                    </div>
                                  ) : (
                                    <div>
                                      <div className="h-40 w-40 rounded-lg bg-secondary flex items-center justify-center">
                                        <Link className="h-16 w-16 text-secondary-foreground" />
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center">
                                  {item.name}
                                </div>
                                <div className="flex items-center mr-6">
                                  <ExternalLink size={18} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </div>
                    ) : (
                      <div className="" key={item.id}>
                        <ProductCard
                          item={item}
                          authDetails={authDetails}
                          currencySymbol={currencySymbol}
                          isDragging={isDragging}
                          username={username}
                        />
                      </div>
                    )}
                  </SortableItem>
                ))
              : "No items to display"}
          </div>
        </SortableContext>
      )}
    </DndContext>
  );
}
