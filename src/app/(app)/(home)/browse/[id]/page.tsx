"use client";

import ImageViewer from "@/features/view/viewers/image-view";
import PdfViewer from "@/features/view/viewers/pdf-view";
import { useGetResourceView } from "@/hooks/use-getResourceLink";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { usePathname } from "next/navigation";

export default function Page() {
  const path = usePathname();

  const id = path.split("browse/")[1];

  if (!id) {
    return <>Not Found</>;
  }

  const { data, isLoading, isError } = useGetResourceView(id);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center   text-white">
        <DotLottieReact
          src="/lottie/deliveryman-riding-scooter.json"
          loop
          className="w-[40%] h-[40%]"
          autoplay
        />
        <p className="mt-2 text-sm text-gray-300">Loading PDF...</p>
      </div>
    );
  }
  if (isError || !data) {
    return <div>error</div>;
  }

  if (data.url == "") {
    return (
      <div className="flex flex-col justify-center items-center">
        <DotLottieReact
          src="/lottie/nothing_found.json"
          loop
          className="w-[40%] h-[40%]"
          autoplay
        />
        <p>No Paper Found</p>
      </div>
    );
  }

  const link = data.url;
  const extension = data.type;

  console.log(link);
  console.log(extension);

  if (link && extension == "PDF") {
    return (
      <div className="h-screen w-full ">
        <PdfViewer pdfUrl={`/api/proxy-pdf?url=${encodeURIComponent(link)}`} />
      </div>
    );
  } else if (link && extension == "IMAGE") {
    return (
      <div className="h-screen w-full ">
        <ImageViewer
          imageUrl={`/api/proxy-pdf?url=${encodeURIComponent(link)}`}
        />
      </div>
    );
  }

  return <div>Unsupported</div>;
}
