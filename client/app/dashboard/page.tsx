// "use client";
// import React from "react";
// import TopBar from "../components/topBar";
// import { Separator } from "@/components/ui/separator";
// import { Card } from "@/components/ui/card";
// import { useAuthDetails } from "../components/AuthContext";
// import AxiosApi from "@/app/services/axios";
// import { useQuery } from "@tanstack/react-query";
// import { AxiosError } from "axios";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
// } from "recharts";
// import { addDays, format } from "date-fns";

// function Page() {
//   const authDetails = useAuthDetails();
//   const storeUrl = authDetails?.storeUrl;
//   const storeId = authDetails?.storeId;

//   const { data, isLoading } = useQuery<Array<any>, AxiosError>(
//     ["pageViews", storeId],
//     async () => {
//       const response = await AxiosApi(
//         "GET",
//         `/api/analytics/?storeId=${storeId}&path=${storeUrl}`
//       );
//       const endDate = new Date();
//       const startDate = addDays(new Date(), -6);

//       const dateMap = {};

//       // Initialize all dates with 0 views
//       for (let d = startDate; d <= endDate; d = addDays(d, 1)) {
//         dateMap[format(d, "yyyy-MM-dd")] = {
//           date: format(d, "yyyy-MM-dd"),
//           value: 0,
//         };
//       }

//       // Populate with actual data
//       response.data.forEach(([date, value]) => {
//         if (dateMap[date]) {
//           dateMap[date].value = value;
//         }
//       });

//       return Object.values(dateMap);
//     },
//     {
//       enabled: !!storeId && !!storeUrl,
//     }
//   );

//   return (
//     <div className="h-screen relative">
//       <div className="sticky top-0 z-50 bg-background ">
//         <TopBar pageTitle="Dashboard" className="mx-4 md:mx-8" />
//         <Separator className="mt-4" orientation="horizontal" />
//       </div>
//       <div className="mx-4 md:mx-8 mt-4 overflow-auto pb-20 md:pb-0">
//         {isLoading ? (
//           <div>Loading...</div>
//         ) : (
//           <Card className="w-full p-6">
//             <LineChart
//               width={1100}
//               height={300}
//               data={data}
//               margin={{
//                 top: 5,
//                 right: 30,
//                 left: 20,
//                 bottom: 5,
//               }}
//             >
//               <CartesianGrid vertical={false} />
//               <XAxis dataKey="date" />
//               <YAxis allowDecimals={false} />
//               <Tooltip />
//               <Legend />
//               <Line
//                 type="monotoneX"
//                 dataKey="value"
//                 stroke="#8884d8"
//                 strokeWidth={3}
//                 dot={false}
//                 activeDot={false}
//               />
//             </LineChart>
//           </Card>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Page;
"use client";
import React from "react";
import TopBar from "../components/topBar";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { useAuthDetails } from "../components/AuthContext";
import AxiosApi from "@/app/services/axios";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { addDays, format, parseISO } from "date-fns";

function Page() {
  const authDetails = useAuthDetails();
  const storeUrl = authDetails?.storeUrl;
  const storeId = authDetails?.storeId;

  const { data, isLoading } = useQuery<Array<any>, AxiosError>(
    ["pageViews", storeId],
    async () => {
      const response = await AxiosApi(
        "GET",
        `/api/analytics/?storeId=${storeId}&path=${storeUrl}`
      );
      const endDate = new Date();
      const startDate = addDays(new Date(), -6);

      const dateMap = {};

      // Initialize all dates with 0 views
      for (let d = startDate; d <= endDate; d = addDays(d, 1)) {
        dateMap[format(d, "yyyy-MM-dd")] = {
          day: format(d, "eee"),
          dateString: format(d, "yyyy-MM-dd"),
          value: 0,
        };
      }

      // Populate with actual data
      response.data.forEach(([date, value]) => {
        const dayOfWeek = format(parseISO(date), "eee");
        if (dateMap[date]) {
          dateMap[date].value = value;
          dateMap[date].day = dayOfWeek;
        }
      });

      return Object.values(dateMap);
    },
    {
      enabled: !!storeId && !!storeUrl,
    }
  );

  return (
    <div className="h-screen relative">
      <div className="sticky top-0 z-50 bg-background ">
        <TopBar pageTitle="Dashboard" className="mx-4 md:mx-8" />
        <Separator className="mt-4" orientation="horizontal" />
      </div>
      <div className="mx-4 md:mx-8 mt-4 overflow-auto pb-20 md:pb-0">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <Card className="w-full">
            <LineChart
              width={1100}
              height={300}
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="day" height={60} />
              <YAxis
                allowDecimals={false}
                domain={["dataMin", "dataMax + 1"]}
                axisLine={false}
              />
              <Tooltip />
              <Legend />
              <Line
                type="monotoneX"
                dataKey="value"
                stroke="#8884d8"
                strokeWidth={3}
                dot={false}
                activeDot={false}
              />
            </LineChart>
          </Card>
        )}
      </div>
    </div>
  );
}

export default Page;
