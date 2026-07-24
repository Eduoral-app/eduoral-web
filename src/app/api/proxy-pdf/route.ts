import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // 1. Get the target PDF URL from the request's query string
  const pdfUrl = request.nextUrl.searchParams.get("url");

  // 2. Validate the URL to prevent security issues
  if (!pdfUrl || !isValidUrl(pdfUrl)) {
    return new NextResponse("Invalid URL", { status: 400 });
  }

  try {
    // 3. Fetch the PDF file from the external source on the server
    const response = await fetch(pdfUrl);

    // 4. Check if the fetch was successful
    if (!response.ok) {
      return new NextResponse(`Failed to fetch PDF: ${response.statusText}`, {
        status: response.status,
      });
    }

    // 5. Get the raw PDF data as an ArrayBuffer
    const pdfData = await response.arrayBuffer();

    // 6. Return the PDF data with the correct headers
    return new NextResponse(pdfData, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        // This header is key: it tells the browser to trust the content from your own domain
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// A simple helper function for URL validation
function isValidUrl(string: string): boolean {
  try {
    const url = new URL(string);
    // Allow only HTTP and HTTPS protocols
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
}
