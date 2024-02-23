import { Card } from "@/components/ui/card";
import { storeItem } from "../..";
import { Button } from "@/components/ui/button";
import { AuthDetails } from "@/app/components/AuthContext";
import { cn } from "@/components/ui/utils";
import { useRouter } from "next/navigation";
import {
  CalendarClock,
  ChevronRightIcon,
  FileDown,
  Pencil,
} from "lucide-react";
import { useState } from "react";

export default function ProductCard({
  item,
  authDetails,
  isDragging,
  username,
  currencySymbol,
}: {
  item: storeItem;
  authDetails: AuthDetails;
  isDragging: boolean;
  username: string;
  currencySymbol: string | undefined;
}) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const editUrl =
    item.itemType === "DIGITALPRODUCT"
      ? "/app/digital-products/create?id=" + item.itemTypeId
      : item.itemType === "CALENDAR"
      ? `/app/calendar/products/edit?id=${item.itemTypeId}&tab=setup`
      : item.itemType === "LINK"
      ? "/app/links"
      : "";

  return (
    <Card
      onClick={() => {
        if (!isDragging) {
          router.push(`/${username}/${item.id}`);
        }
      }}
      className={cn(
        "w-full h-44 rounded-lg hover:bg-primary-background hover:shadow-md",
        authDetails.token === null ? "cursor-pointer" : "cursor-move"
      )}
      key={item.id}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className=" p-4">
        <div className="flex flex-row justify-between text-secondary-foreground p-4 bg-secondary rounded-lg h-20">
          <div className="p-4 text-xl font-semibold">{item?.name}</div>
          {isHovered && !isDragging && authDetails.token !== null && (
            <Button
              className="flex items-center justify-center w-10 h-10 px-2 py-2  rounded-full hover:bg-secondary-foreground hover:text-primary-foreground border border-secondary-foreground"
              variant={"outline"}
              onClick={(e) => {
                e.stopPropagation();

                router.push(editUrl);
              }}
            >
              <Pencil className="w-10 h-10" />
            </Button>
          )}
        </div>
        <div className="flex h-20 p-0 items-end justify-between">
          <div className="mb-6 ml-2">
            {item.itemType === "DIGITALPRODUCT" ? (
              <div className="flex gap-2">
                <FileDown />
                <div>Digital Product</div>
              </div>
            ) : item.itemType === "CALENDAR" ? (
              <div className="flex gap-2">
                <CalendarClock />
                <div>Book a Session</div>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="mb-5 font-bold text-secondary-foreground">
            <Button
              className="flex w-24 cursor-pointer justify-between rounded-full hover:bg-secondary-foreground px-1 p-2 hover:text-primary-foreground border-secondary-foreground text-xl"
              variant={"outline"}
              onClick={() => {
                router.push(`/${username}/${item.id}`);
              }}
            >
              <div className="flex ml-2">
                <div className="">{currencySymbol}</div>
                <div className="">{item?.price}</div>
              </div>
              <div className="">
                <ChevronRightIcon />
              </div>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
