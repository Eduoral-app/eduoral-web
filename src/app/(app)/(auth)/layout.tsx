import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eduoral",

  description:
    "Your personalized study companion, designed to help you learn smarter, stay organized, and achieve your academic goals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="min-h-full flex flex-col">{children}</div>;
}
