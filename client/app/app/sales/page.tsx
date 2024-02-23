//TODO: the sale coming here is of different type then being used in the columns file change it, see how to fix it while working on adding more columns to this table

"use client";
import { Sale, columns } from "./columns";
import { AxiosError } from "axios";
import AxiosApi from "@/app/services/axios";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "./data-table";
import { useAuthDetails } from "@/app/components/AuthContext";

export default function Page() {
  const authDetails = useAuthDetails();
  const { data } = useQuery<Sale[], AxiosError>(
    ["sale", authDetails.storeId],
    async () => {
      const response = await AxiosApi(
        "GET",
        `/api/sale/all?storeId=${authDetails.storeId}`,
        {},
        authDetails
      );
      return response.data;
    },
    {
      enabled: !!authDetails.storeId,
    }
  );

  return (
    <div className="w-full">
      {data && (
        <div className="w-full px-2">
          <DataTable data={data} columns={columns} />
        </div>
      )}
    </div>
  );
}
