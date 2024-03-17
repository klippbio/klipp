import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, ArrowDownFromLineIcon, ExternalLink } from "lucide-react";
import React from "react";

//eslint-disable-next-line
function DDSuccessContent({ data }: { data: any }) {
  const urls = JSON.parse(data.storeItem.DigitalProduct.urls);

  console.log(data);
  return (
    <div>
      <div className=" ">
        {data.status === "COMPLETED" ? (
          <div>
            <div className="flex flex-col ">
              <div className="flex text-xl font-bold  justify-center text-secondary-foreground ">
                {data.storeItem.DigitalProduct.name}
              </div>
              <div className="flex justify-center mt-2">
                {data.storeItem.DigitalProduct.shortDescription}
              </div>
            </div>
            {data.storeItem.DigitalProduct.ddFiles.length > 0 && (
              <div>
                <div className="mt-10">
                  <div className="text-lg font-semibold text-secondary-foreground">
                    Files
                  </div>
                  <Separator />
                  {data.storeItem.DigitalProduct.ddFiles.map(
                    //eslint-disable-next-line
                    (file: any, index: number) => (
                      <div
                        key={index}
                        className="flex mt-4 justify-between items-center mb-4 bg-secondary p-2 rounded-md"
                      >
                        <span>{file.name}</span>
                        <Button>
                          <a href={file.url} download>
                            <ArrowDownFromLineIcon size={20} />
                          </a>
                        </Button>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {urls.length > 0 && (
              <div className="mt-10">
                <div className="text-lg font-semibold text-secondary-foreground">
                  External Links
                </div>
                <Separator />
                {urls.map(
                  (urlObj: { name: string; url: string }, index: number) => (
                    <div
                      key={index}
                      className="flex mt-4 justify-between items-center mb-4 bg-secondary p-2 rounded-md"
                    >
                      <div>{urlObj.name}</div>
                      <Button>
                        <a href={urlObj.url} download>
                          <ExternalLink size={20} />
                        </a>
                      </Button>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex flex-col ">
              <div className="flex text-xl font-bold  justify-center text-secondary-foreground ">
                {data.storeItem.DigitalProduct.name}
              </div>
              <div className="flex justify-center mt-2">
                {data.storeItem.DigitalProduct.shortDescription}
              </div>
            </div>

            <div className="mt-10">
              <Card className="bg-red-50 text-red-800 ">
                <CardHeader>
                  <CardTitle>Payment Incomplete</CardTitle>
                </CardHeader>
                <CardContent className="flex">
                  <AlertCircle size={30} className="mr-3" /> Please complete the
                  payment to download the product.
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DDSuccessContent;
