// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import { Button, buttonVariants } from "@/components/ui/button";
// import { useAuth } from "@clerk/nextjs";
// import { useUser } from "@clerk/nextjs";
// import { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import { Separator } from "@/components/ui/separator";
// import { generateUploadURL, uploadFile } from "@/app/services/getS3url";
// import Editor from "@/components/ui/custom/editor/Editor";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Switch } from "@/components/ui/switch";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import { useToast } from "@/components/ui/use-toast";
// import { Card } from "@/components/ui/card";

// //types

// //consts
// const digitalDownloadsSchema = z.object({
//   name: z.string().nonempty({ message: "Name is required" }),
//   shortDescription: z.string().optional(),
//   thumbnail: z.string().optional(),
//   externalFile: z.boolean().optional().default(false),
//   fileName: z.string().optional(),
//   fileLink: z.string().optional(),
//   description: z.string().optional(),
//   file: z.string().optional(),
//   currency: z.string().array().default(["USD"]),
//   price: z
//     .number({
//       required_error: "Price is required",
//     })
//     .min(0)
//     .max(5000),
//   recPrice: z.number().min(0).max(5000),
//   minPrice: z.number().min(0).max(5000).default(0).optional(),
//   flexPrice: z.boolean().optional(),
//   visibility: z.boolean().optional().default(false),
// });
// //   .refine(
// //     (digitalDownloadsSchema: any) =>
// //       digitalDownloadsSchema.recPrice >= digitalDownloadsSchema.price,
// //     {
// //       message: "Recommended Price must be greater than Price",
// //       path: ["recPrice"],
// //     }
// //   );

// export function ProfileForm() {
//   //consts
//   const { userId, getToken } = useAuth();
//   const { user } = useUser();
//   const router = useRouter();
//   const email = user?.emailAddresses[0].emailAddress;
//   const [showUploadFile, setShowUploadFile] = useState(true);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [imageUrl, setImageUrl] = useState("");
//   const [editorData, setEditorData] = useState("");
//   const [flexPrice, setFlexPrice] = useState(true);
//   const [priceState, setPriceState] = useState("");

//   const { toast } = useToast();
//   const updateEditorData = useCallback((state: any) => {
//     setEditorData(state);
//   }, []);
//   //form prefix logic
//   const form = useForm<z.infer<typeof digitalDownloadsSchema>>({
//     defaultValues: {
//       thumbnail: "https://thumbnail.com",
//       fileName: "",
//       fileLink: "",
//       description: "",
//       file: "",
//     },
//     resolver: zodResolver(digitalDownloadsSchema),
//   });

//   const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setPriceState(event.target.value);
//   };

//   function onSubmit(data: z.infer<typeof digitalDownloadsSchema>) {
//     data.thumbnail = imageUrl;
//     data.description = editorData;
//     console.log(data);
//   }

//   async function getUploadURL() {
//     return await generateUploadURL();
//   }

//   async function onThumbnailChange(event: any) {
//     const file = event.target.files[0];
//     setSelectedFile(file);
//     const uploadUrl = await getUploadURL();
//     const imageUrl = await uploadFile(uploadUrl, file);
//     setImageUrl(imageUrl);
//   }

//   return (
//     <Card className="m-5 p-5 md:w-2/3 w-full">
//       <div className="">
//         <div className="p-10 rounded-l-lg">
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
//               <div className="flex md:flex-row flex-col ">
//                 <FormField
//                   control={form.control}
//                   name="thumbnail"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel htmlFor="displayName">Thumbnail</FormLabel>
//                       <FormControl>
//                         <div
//                           className={`w-full h-32 md:h-32 md:w-32 border-2 flex flex-col items-center justify-center rounded-md relative ${
//                             selectedFile
//                               ? "border-transparent"
//                               : buttonVariants({ variant: "ghost" })
//                           }`}
//                         >
//                           {selectedFile ? (
//                             <img
//                               src={URL.createObjectURL(selectedFile)}
//                               alt="Selected Thumbnail"
//                               className="w-full h-full md:h-32 object-cover rounded-md"
//                             />
//                           ) : (
//                             <div
//                               className="text-3xl font-bold mb-8 mt-8 text-foreground"
//                               style={{ pointerEvents: "none" }}
//                             >
//                               +
//                             </div>
//                           )}
//                           <Input
//                             type="file"
//                             className="absolute opacity-0 w-full h-full cursor-pointer"
//                             onChange={onThumbnailChange}
//                           />
//                         </div>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <div className="w-full mt-5 md:mt-0  md:ml-5 space-y-5">
//                   <FormField
//                     control={form.control}
//                     name="name"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel htmlFor="name">Product Name</FormLabel>
//                         <FormControl>
//                           <Input {...field} id="name" />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="shortDescription"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel htmlFor="name">Short Description</FormLabel>
//                         <FormControl>
//                           <Input {...field} id="name" />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </div>
//               </div>
//               <FormField
//                 control={form.control}
//                 name="externalFile"
//                 render={({ field }) => (
//                   <FormItem className="flex flex-row items-center mt-10 justify-between rounded-lg border p-3 shadow-sm mb-6">
//                     <div className="space-y-0.5">
//                       <FormLabel>Add external product link</FormLabel>
//                       <FormDescription>
//                         Add a link to your product instead of uploading a file.
//                       </FormDescription>
//                     </div>
//                     <FormControl>
//                       <Switch
//                         checked={field.value}
//                         onCheckedChange={(newValue) => {
//                           field.onChange(newValue);
//                           setShowUploadFile(!newValue);
//                         }}
//                       />
//                     </FormControl>
//                   </FormItem>
//                 )}
//               />
//               {showUploadFile && (
//                 <FormField
//                   control={form.control}
//                   name="file"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel htmlFor="displayName">Upload File</FormLabel>
//                       <FormControl>
//                         <Button
//                           variant={"outline"}
//                           className=" border-2 w-full h-32 flex flex-col items-center justify-center rounded-md relative"
//                         >
//                           <div
//                             className="text-3xl font-bold mb-8 mt-8 text-foreground"
//                             style={{ pointerEvents: "none" }}
//                           >
//                             +
//                           </div>
//                           <Input
//                             type="file"
//                             className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
//                           />
//                         </Button>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               )}
//               <div>
//                 {!showUploadFile && (
//                   <div className="flex md:flex-row flex-col mt-6 md:space-x-6">
//                     <FormField
//                       control={form.control}
//                       name="fileName"
//                       render={({ field }) => (
//                         <FormItem className="md:w-1/2">
//                           <FormLabel htmlFor="name">File Name</FormLabel>
//                           <FormControl>
//                             <Input {...field} id="name" />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                     <FormField
//                       control={form.control}
//                       name="fileLink"
//                       render={({ field }) => (
//                         <FormItem className="md:w-1/2">
//                           <FormLabel htmlFor="name">External Link</FormLabel>
//                           <FormControl>
//                             <Input {...field} id="name" />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                 )}
//                 <div className="py-5">
//                   <FormField
//                     control={form.control}
//                     name="description"
//                     render={({ field }) => (
//                       <FormItem className="">
//                         <FormLabel htmlFor="name">Description</FormLabel>
//                         <FormControl>
//                           <Editor updateEditorData={updateEditorData} />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </div>
//               </div>
//               <Separator className="mt-4" />
//               <div>
//                 <h1 className="text-xl font-bold mt-6 text-primary">Pricing</h1>
//               </div>
//               <div className="flex flex-row gap-4">
//                 <FormField
//                   control={form.control}
//                   name="currency"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel htmlFor="storeUrl">Currency</FormLabel>
//                       <FormControl></FormControl>
//                       <Select defaultValue="USD">
//                         <SelectTrigger className="w-auto">
//                           <SelectValue placeholder="Currency" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="USD">USD</SelectItem>
//                           <SelectItem value="CAD">CAD</SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 {/* <FormField
//                   control={form.control}
//                   name="price"
//                   render={({ field }) => (
//                     <FormItem className="w-full">
//                       <FormLabel htmlFor="storeUrl">Price</FormLabel>
//                       <FormControl>
//                         <Input
//                           {...field}
//                           id="price"
//                           type="number"
//                           placeholder="0"
//                           min={0}
//                           onChange={handlePriceChange}
//                         />
//                       </FormControl>

//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 /> */}
//                 <FormField
//                   control={form.control}
//                   name="price"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel htmlFor="name">Short Description</FormLabel>
//                       <FormControl>
//                         <Input {...field} id="price" type="number" />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <FormField
//                 control={form.control}
//                 name="flexPrice"
//                 render={({ field }) => (
//                   <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-6 mb-6">
//                     <div className="space-y-0.5">
//                       <FormLabel>Enable Flexible Pricing</FormLabel>
//                       <FormDescription>
//                         Allow users to pay what they want.
//                       </FormDescription>
//                     </div>
//                     <FormControl>
//                       <Switch
//                         checked={field.value}
//                         onCheckedChange={(newValue) => {
//                           field.onChange(newValue);
//                           setFlexPrice(!newValue);
//                         }}
//                       />
//                     </FormControl>
//                   </FormItem>
//                 )}
//               />
//               {!flexPrice && (
//                 <div className="flex md:flex-row flex-col mt-6 md:space-x-6">
//                   <FormField
//                     control={form.control}
//                     name="minPrice"
//                     render={({ field }) => (
//                       <FormItem className="md:w-1/2">
//                         <FormLabel htmlFor="name">Minimum Price</FormLabel>
//                         <FormControl>
//                           <Input
//                             {...field}
//                             id="minPrice"
//                             disabled
//                             placeholder="0"
//                             value={priceState}
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="recPrice"
//                     render={({ field }) => (
//                       <FormItem className="md:w-1/2">
//                         <FormLabel htmlFor="recPrice">
//                           Recommended Price
//                         </FormLabel>
//                         <FormControl>
//                           <Input
//                             id="recPrice"
//                             type="number"
//                             placeholder="0"
//                             min={0}
//                           />
//                         </FormControl>

//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </div>
//               )}
//               <Separator className="mt-8" />
//               <div>
//                 <h1 className="text-xl font-bold mt-6 text-primary">
//                   Visibility
//                 </h1>
//               </div>
//               <FormField
//                 control={form.control}
//                 name="visibility"
//                 render={({ field }) => (
//                   <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-6 mb-6">
//                     <div className="space-y-0.5">
//                       <FormLabel>Product Visibility</FormLabel>
//                       <FormDescription>
//                         Make this product visible on you profile. By default,
//                         its private.
//                       </FormDescription>
//                     </div>
//                     <FormControl>
//                       <Switch
//                         checked={field.value}
//                         onCheckedChange={(newValue) => {
//                           field.onChange(newValue);
//                         }}
//                       />
//                     </FormControl>
//                   </FormItem>
//                 )}
//               />
//               <Button className="mt-10 w-32 items-center" type="submit">
//                 Next
//               </Button>
//             </form>
//           </Form>
//         </div>
//       </div>
//     </Card>
//   );
// }

// export default ProfileForm;

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { generateUploadURL, uploadFile } from "@/app/services/getS3url";
import Editor from "@/components/ui/custom/editor/Editor";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Trash } from "lucide-react";
import uploadIcon from "/var/folders/xb/pj426db522lc67gt04dflm4w0000gn/T//sdfcjkmolsdahbjnmdfvolasdfjkm/Paper Upload.svg";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Card } from "@/components/ui/card";

//types

const digitalDownloadsSchema = z
  .object({
    name: z.string().optional(),
    shortDescription: z.string().optional(),
    thumbnail: z.string().optional(),
    externalFile: z.boolean().optional().default(false),
    description: z.string().optional(),
    file: z.string().optional(),
    currency: z.string().array().default(["USD"]),
    price: z.string().default("0"),
    recPrice: z.string().optional(),
    minPrice: z.string(),
    flexPrice: z.boolean().optional(),
    visibility: z.boolean().optional().default(false),
    urls: z
      .array(
        z.object({
          value1: z.string().optional(),
          value2: z.string().optional(),
        })
      )
      .optional(),
  })
  .refine(
    (data) => {
      if (
        data.recPrice !== undefined &&
        data.recPrice !== "" &&
        data.price !== undefined &&
        data.price !== ""
      ) {
        return Number(data.price) < Number(data.recPrice);
      }
      return true; // If recPrice is not present or empty, the refinement is bypassed
    },
    {
      message: "Price must be less than recPrice",
      path: ["recPrice"],
    }
  );

export function ProfileForm() {
  //consts
  const { userId, getToken } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const email = user?.emailAddresses[0].emailAddress;
  const [showUploadFile, setShowUploadFile] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [editorData, setEditorData] = useState("");
  const [flexPrice, setFlexPrice] = useState(true);
  const [priceState, setPriceState] = useState(0);
  const [formValues, setFormValues] = useState({});
  const [minPrice, setMinPrice] = useState("0");

  const { toast } = useToast();
  const updateEditorData = useCallback((state: any) => {
    setEditorData(state);
  }, []);

  //form prefix logic
  const form = useForm<z.infer<typeof digitalDownloadsSchema>>({
    defaultValues: {
      thumbnail: "https://thumbnail.com",
      description: "",
      file: "",
      urls: [{ value1: "Https://google.com", value2: "" }],
    },
    resolver: zodResolver(digitalDownloadsSchema),
    mode: "onChange",
  });

  // const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setPriceState(event.target.value);
  // };

  function onSubmit(data: z.infer<typeof digitalDownloadsSchema>) {
    data.thumbnail = imageUrl;
    data.description = editorData;
    console.log(data);
  }

  async function getUploadURL() {
    return await generateUploadURL();
  }

  async function onThumbnailChange(event: any) {
    const file = event.target.files[0];
    setSelectedFile(file);
    const uploadUrl = await getUploadURL();
    const imageUrl = await uploadFile(uploadUrl, file);
    setImageUrl(imageUrl);
  }

  async function onFileChange(event: any) {
    const file = event.target.files[0];

    const uploadUrl = await getUploadURL();
    const imageUrl = await uploadFile(uploadUrl, file);
    console.log(imageUrl, file.name);
  }

  const arr = ["url1", "url2", "url3"];
  const { fields, append, remove } = useFieldArray({
    name: "urls",
    control: form.control,
    rules: { maxLength: 3 },
  });

  const { watch } = form;

  useEffect(() => {
    const price = watch("price");

    setMinPrice(price);

    form.setValue("minPrice", price);
  }, [watch("price")]);

  //save user data
  // const mutation = useMutation({
  //   mutationFn: async (data: z.infer<typeof digitalDownloadsSchema>) => {
  //     const combinedData = { ...data, userId };
  //     return axios.post("/api/digital-downloads/create", combinedData, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${await getToken()}`,
  //         mode: "cors",
  //       },
  //     });
  //   },
  //   onSuccess: (data: any) => {
  //     const productId = data.data.id;
  //     console.log(data);

  //     toast({
  //       title: "Success!",
  //       duration: 1000,
  //       description: "Product created successfully",
  //     });
  //   },
  //   onError: (error: any) => {
  //     toast({
  //       title: "Error",
  //       variant: "destructive",
  //       duration: 2000,
  //       description: error.response.data.error,
  //     });
  //   },
  // });

  return (
    <Card className="m-5 p-5 md:w-2/3 w-full">
      <div className="">
        <div className="p-10 rounded-l-lg">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
              <div className="flex md:flex-row flex-col ">
                <FormField
                  control={form.control}
                  name="thumbnail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="displayName">Thumbnail</FormLabel>
                      <FormControl>
                        <div
                          className={`w-full h-32 md:h-32 md:w-32 border-2 flex flex-col items-center justify-center rounded-md relative ${
                            selectedFile
                              ? "border-transparent"
                              : buttonVariants({ variant: "ghost" })
                          }`}
                        >
                          {selectedFile ? (
                            <img
                              src={URL.createObjectURL(selectedFile)}
                              alt="Selected Thumbnail"
                              className="w-full h-full md:h-32 object-cover rounded-md"
                            />
                          ) : (
                            <div
                              className="text-3xl font-bold mb-8 mt-8 text-foreground"
                              style={{ pointerEvents: "none" }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-5 h-5"
                              >
                                <path d="M9.25 13.25a.75.75 0 001.5 0V4.636l2.955 3.129a.75.75 0 001.09-1.03l-4.25-4.5a.75.75 0 00-1.09 0l-4.25 4.5a.75.75 0 101.09 1.03L9.25 4.636v8.614z" />
                                <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                              </svg>
                            </div>
                          )}
                          <Input
                            type="file"
                            className="absolute opacity-0 w-full h-full cursor-pointer"
                            onChange={onThumbnailChange}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="w-full mt-5 md:mt-0  md:ml-5 space-y-5">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="name">Product Name</FormLabel>
                        <FormControl>
                          <Input {...field} id="name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shortDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="name">Short Description</FormLabel>
                        <FormControl>
                          <Input {...field} id="name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <FormField
                control={form.control}
                name="externalFile"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center mt-10 justify-between rounded-lg border p-3 shadow-sm mb-6">
                    <div className="space-y-0.5">
                      <FormLabel>Add external product link</FormLabel>
                      <FormDescription>
                        Add a link to your product instead of uploading a file.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(newValue) => {
                          field.onChange(newValue);
                          setShowUploadFile(!newValue);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex flex-row gap-4">
                <div className="w-1/2">
                  {showUploadFile && (
                    <FormField
                      control={form.control}
                      name="file"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="displayName">
                            Upload File
                          </FormLabel>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className=" border-2 w-full h-32 flex flex-col items-center justify-center rounded-md relative"
                            >
                              <div
                                className=" font-bold mb-8 mt-8"
                                style={{ pointerEvents: "none" }}
                              >
                                <div className="flex flex-row">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="w-5 h-5 mr-2"
                                  >
                                    <path d="M9.25 13.25a.75.75 0 001.5 0V4.636l2.955 3.129a.75.75 0 001.09-1.03l-4.25-4.5a.75.75 0 00-1.09 0l-4.25 4.5a.75.75 0 101.09 1.03L9.25 4.636v8.614z" />
                                    <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                                  </svg>
                                  Upload your files here
                                </div>
                              </div>
                              <Input
                                type="file"
                                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                onChange={onFileChange}
                              />
                            </Button>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <div className="w-1/2">
                  {showUploadFile && (
                    <div className="flex flex-row w-full mt-6 ">
                      <div className="w-full mt-1">
                        <FormField
                          control={form.control}
                          name={"a"}
                          render={({ field }) => (
                            <FormItem className="md:w-1">
                              <FormLabel htmlFor="name"></FormLabel>
                              <FormControl>
                                <div>{arr[0]}</div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="">
                        <Button
                          variant="secondary"
                          size="icon"
                          type="button"
                          className=""
                          // onClick={() => remove(index)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {showUploadFile &&
                fields.map((field, index) => (
                  <div key={field.id}>
                    <div className="flex md:flex-row flex-col mt-6 md:space-x-6">
                      {/* <FormField
                        control={form.control}
                        name={`urls.${index}.value1`}
                        render={({ field }) => (
                          <FormItem className="md:w-1/2">
                            <FormLabel htmlFor="name">File Name</FormLabel>
                            <FormControl>Hello</FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      /> */}
                      <p
                        id={`urls.${index}.value1`}
                      >{`urls.${index}.value1`}</p>
                      <FormField
                        control={form.control}
                        name={`urls.${index}.value2`}
                        render={({ field }) => (
                          <FormItem className="md:w-1/2">
                            <FormLabel htmlFor="name">External Link</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        variant="secondary"
                        disabled={fields.length <= 1}
                        size="icon"
                        type="button"
                        className="mt-8"
                        onClick={() => remove(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

              <div>
                {!showUploadFile &&
                  fields.map((field, index) => (
                    <div key={field.id}>
                      <div className="flex md:flex-row flex-col mt-6 md:space-x-6">
                        <FormField
                          control={form.control}
                          name={`urls.${index}.value1`}
                          render={({ field }) => (
                            <FormItem className="md:w-1/2">
                              <FormLabel htmlFor="name">File Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`urls.${index}.value2`}
                          render={({ field }) => (
                            <FormItem className="md:w-1/2">
                              <FormLabel htmlFor="name">
                                External Link
                              </FormLabel>
                              <FormControl>
                                <Input {...field} value="google.com" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          variant="secondary"
                          disabled={fields.length <= 1}
                          size="icon"
                          type="button"
                          className="mt-8"
                          onClick={() => remove(index)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                {!showUploadFile && (
                  <Button
                    type="button"
                    size="sm"
                    className="mt-6"
                    disabled={fields.length >= 5}
                    onClick={() => append({ value1: "", value2: "" })}
                  >
                    Add Files
                  </Button>
                )}

                <div className="py-5">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel htmlFor="name">Description</FormLabel>
                        <FormControl>
                          <Editor updateEditorData={updateEditorData} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Separator className="mt-4" />
              <div>
                <h1 className="text-xl font-bold mt-6 text-primary">Pricing</h1>
              </div>
              <div className="flex flex-row gap-4">
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="storeUrl">Currency</FormLabel>
                      <FormControl></FormControl>
                      <Select defaultValue="USD">
                        <SelectTrigger className="w-auto">
                          <SelectValue placeholder="Currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="CAD">CAD</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel htmlFor="storeUrl">Price</FormLabel>
                      <FormControl>
                        <Input {...field} id="price" type={"number"} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="flexPrice"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-6 mb-6">
                    <div className="space-y-0.5">
                      <FormLabel>Enable Flexible Pricing</FormLabel>
                      <FormDescription>
                        Allow users to pay what they want.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(newValue) => {
                          field.onChange(newValue);
                          setFlexPrice(!newValue);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {!flexPrice && (
                <div className="flex md:flex-row flex-col mt-6 md:space-x-6">
                  <FormField
                    control={form.control}
                    name="minPrice"
                    render={({ field }) => (
                      <FormItem className="md:w-1/2">
                        <FormLabel htmlFor="name">Minimum Price</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            id="minPrice"
                            disabled
                            placeholder="0"
                            value={minPrice}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="recPrice"
                    render={({ field }) => (
                      <FormItem className="md:w-1/2">
                        <FormLabel htmlFor="recPrice">
                          Recommended Price
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            id="recPrice"
                            type="number"
                            placeholder="0"
                            min={0}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              <Separator className="mt-8" />
              <div>
                <h1 className="text-xl font-bold mt-6 text-primary">
                  Visibility
                </h1>
              </div>
              <FormField
                control={form.control}
                name="visibility"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-6 mb-6">
                    <div className="space-y-0.5">
                      <FormLabel>Product Visibility</FormLabel>
                      <FormDescription>
                        Make this product visible on you profile. By default,
                        its private.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(newValue) => {
                          field.onChange(newValue);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button className="mt-10 w-32 items-center" type="submit">
                Next
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </Card>
  );
}

export default ProfileForm;
