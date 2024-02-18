import { GradientPicker, PickerExample } from "@/components/ui/GradientPicker";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

function ProductsList() {
  return (
    <div className="mt-4 mb-4 w-full">
      <Card className="text-foreground">
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>
            Change background color or rearrange products.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full flex gap-6">
            <div className="w-1/4">
              <div className="mb-4">
                <h1 className="text-l font-bold">Background Color</h1>
              </div>
              <PickerExample />
            </div>
            <div className="w-3/4">
              <div className="mb-4">
                <h1 className="text-l font-bold">Rearrange your products</h1>
              </div>
              <ScrollArea />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ProductsList;
