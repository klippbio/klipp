//TODO: Dynamic Colors
//Auth
//Skeletons
//img invisible on smaller screens
"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Editor from "@/components/ui/custom/editor/Editor";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const publicDDProductSchema = z.object({
  name: z.string(),
  price: z.string(),
});

function PublicDigitalProduct() {
  const [initialBlocksData, setInitialBlocksData] = useState([]);

  const id = usePathname().split("/").pop();
  const { data, isLoading } = useQuery(["productId", id], async () => {
    const response = await axios.get(`/api/product/?id=${id}`);
    const parsedDescription = JSON.parse(
      response.data.DigitalProduct.description
    );
    setInitialBlocksData(parsedDescription.blocks);
    return response.data;
  });

  const form = useForm<z.infer<typeof publicDDProductSchema>>({
    resolver: zodResolver(publicDDProductSchema),
    mode: "onChange",
  });

  function onSubmit(data: z.infer<typeof publicDDProductSchema>) {
    console.log(data);
  }
  return (
    <div className="md:flex md:justify-center md:m-8 ">
      {isLoading ? <div>Loading...</div> : null}
      {data && (
        <Card className="border-hidden md:border-solid md:w-9/12">
          <CardHeader className="bg-secondary rounded-t-xl">
            <div className="h-64 bg-secondary rounded-md flex flex-row justify-between">
              <div className="md:w-2/3 w-full flex flex-col justify-between">
                <div className="">
                  <div className="font-bold text-2xl text-foreground">
                    {data.DigitalProduct.name}
                  </div>
                  <div className="text-l text-justify">
                    {data.DigitalProduct.shortDescription}
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="font-semibold text-xl flex gap-4 mt-6">
                    <div> {data.DigitalProduct.currency} </div>
                    <div>{data.DigitalProduct.price}</div>
                  </div>
                  <div>
                    <Button className="bg-primary w-28 text-primary-foreground p-2 mt-4">
                      Buy Now
                    </Button>
                  </div>
                </div>
              </div>
              {/* image */}
              <div>
                <Image
                  alt="a"
                  className="rounded-xl"
                  src={data.DigitalProduct.thumbnailUrl}
                  width="200"
                  height="200"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-secondary-foreground">
              <Editor
                initialBlocks={initialBlocksData}
                updateEditorData={initialBlocksData}
                isReadonly={true}
              ></Editor>
            </div>
            <div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="flex flex-row gap-4 md:flex-nowrap flex-wrap">
                    <div className=" md:w-1/2 w-full ">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="name">Name</FormLabel>
                            <FormControl>
                              <Input {...field} name="name" id="name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className=" md:w-1/2 w-full">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="name">email</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                name="name"
                                type="number"
                                id="name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <Button className="mt-4" type="submit">
                    <span>Buy Now</span>
                  </Button>
                </form>
              </Form>
            </div>
          </CardContent>
        </Card>
      )}
      {/* </Card> */}
    </div>
  );
}

export default PublicDigitalProduct;
