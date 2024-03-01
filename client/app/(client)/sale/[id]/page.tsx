"use client";
import { usePathname } from "next/navigation";
import { sale } from "../..";
import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import AxiosApi from "@/app/services/axios";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import CalendarSaleContent from "./calendarSuccessContent";
import DDSuccessContent from "./ddSuccessContent";

function Mypage() {
  const id = usePathname().split("/")[2];

  const { data } = useQuery<sale, AxiosError>(
    ["sale", id],
    async () => {
      const response = await AxiosApi("GET", `/api/sale/?id=${id}`);
      return response.data;
    },
    {
      enabled: true,
    }
  );
  return (
    // <div>
    //   {isLoading ? <div>Loading...</div> : <div></div>}
    //   <div className="md:flex md:flex-row m-4 gap-4 flex-wrap">
    //     {data && (
    //       <Card>
    // <CardHeader className="bg-secondary">
    //   <div className="w-full rounded-md flex flex-row justify-between">
    //     <div className="flex flex-col w-2/3 pr-4">
    //       <div className="font-bold text-2xl text-foreground">
    //         <div>{data.buyerName}</div>
    //       </div>
    //       <div className="text-l">
    //         {data.buyerEmail ? data.buyerEmail : "No email"}
    //       </div>
    //     </div>
    //   </div>
    // </CardHeader>
    //       </Card>
    //     )}
    //   </div>
    // </div>
    <div className="flex flex-col justify-center items-center p-4">
      {/* {data && (
        <div className="bg-white w-full max-w-lg rounded-lg shadow-md p-6 mt-5">
          <div className="text-center">
            <div className="text-green-500 text-4xl">✓</div>
            <h1 className="text-xl font-bold mt-2">
              This meeting is scheduled
            </h1>
            <p className="text-gray-600">
              We sent an email with a calendar invitation with the details to
              everyone.
            </p>
          </div>
          
          <div className="text-center mt-6">
            <Link
              href="/reschedule"
              className="text-blue-500 hover:underline mr-2"
            >
              Reschedule
            </Link>
            <Link href="/cancel" className="text-blue-500 hover:underline">
              Cancel
            </Link>
          </div>
          <div className="text-center mt-4">
            <Link
              href="/dashboard"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Take me home
            </Link>
          </div>
        </div>
      )} */}
      {data && (
        <Card className="md:w-[450px]">
          <CardHeader className="border-b-black rounded-t-md flex items-center">
            {data.booking?.bookingStatus === "CANCELLED" ||
            data.status !== "COMPLETED" ? (
              <div className="flex flex-col  items-center ">
                <div className="text-red-500 text-4xl">✗</div>
                <h1 className="text-xl font-bold mt-2">
                  Your purchase was{" "}
                  {data.booking?.bookingStatus === "CANCELLED"
                    ? "cancelled"
                    : String(data.status).toLowerCase()}
                </h1>
              </div>
            ) : (
              <div className="flex flex-col items-center ">
                <div className="text-green-500 text-4xl">✓</div>
                <h1 className="text-xl font-bold mt-2">
                  Your purchase was successful
                </h1>
              </div>
            )}

            <h2 className="text-sm  mt-2 text-center">
              We have also sent an email with the details to you.
            </h2>
            <Separator orientation="horizontal" />
          </CardHeader>
          <CardContent className="text-sm">
            {data.storeItem.itemType === "CALENDAR" ? (
              <CalendarSaleContent data={data} />
            ) : (
              <div>
                <DDSuccessContent data={data} />
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default Mypage;
