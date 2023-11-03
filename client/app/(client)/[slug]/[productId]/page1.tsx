// "use client";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import Editor from "@/components/ui/custom/editor/Editor";
// import { Separator } from "@/components/ui/separator";
// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import { url } from "inspector";
// import { Badge } from "lucide-react";
// import { useRouter, usePathname } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import sidePanel from "./sidePanel";
// function publicProductPage() {
//   // const [initialBlocksData, setInitialBlocksData] = useState([]);

//   // const id = usePathname().split("/").pop();
//   // console.log(id);

//   // const { data, isLoading } = useQuery(["product", id], async () => {
//   //   const response = await axios.get(`/api/product/?id=${id}`);
//   //   const parsedDescription = JSON.parse(
//   //     response.data.DigitalProduct.description
//   //   );
//   //   setInitialBlocksData(parsedDescription.blocks);
//   //   return response.data;
//   // });

//   return (
//     // <div>
//     //   {isLoading ? <div>Loading...</div> : <div></div>}

//     //   {data && (
//     //     <div className="flex mt-16 h-full justify-center">
//     //       <Card className="md:w-1/2 w-full mb-4 p-6" key={data.id}>
//     //         <div>
//     //           {/* top div */}
//     //           <div className="flex flex-row justify-between">
//     //             {/* left */}
//     //             <div className="">
//     //               <div className="font-bold text-2xl mt-2 text-foreground">
//     //                 {data.DigitalProduct.name}
//     //               </div>
//     //               <div className="text-l">
//     //                 {data.DigitalProduct.shortDescription}
//     //               </div>
//     //               <div className="flex flex-row gap-4">
//     //                 <div className="font-semibold text-xl flex flex-row gap-4 mt-6">
//     //                   <div> {data.DigitalProduct.currency}</div>
//     //                   <div>{data.DigitalProduct.price}</div>
//     //                 </div>
//     //                 <div>
//     //                   <Button className="bg-primary text-primary-foreground p-2 mt-4">
//     //                     Buy Now
//     //                   </Button>
//     //                 </div>
//     //               </div>
//     //             </div>

//     //             {/* right */}
//     //             <div>
//     //               <div className="w-64 h-32">
//     //                 <img
//     //                   className="rounded-md"
//     //                   src={data.DigitalProduct.thumbnailUrl}
//     //                 />
//     //               </div>
//     //             </div>
//     //           </div>
//     //         </div>
//     //         <Separator className="mt-8"></Separator>
//     //         {/* bottom div */}
//     //         <div>
//     //           <div className="mt-6 border-hidden text-secondary-foreground">
//     //             <Editor
//     //               initialBlocks={initialBlocksData}
//     //               updateEditorData={initialBlocksData}
//     //               isReadonly={true}
//     //             ></Editor>
//     //           </div>
//     //         </div>
//     //       </Card>
//     //     </div>
//     //   )}
//     // </div>
//     <div>
//       <sidePanel></sidePanel>
//     </div>
//   );
// }

// export default publicProductPage;
