import Image from "next/image";

export default function Logo({
  width = 100,
  height = 100,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <Image
      alt="Eduoral"
      src="/eduoral.svg"
      width={width}
      height={height}
      style={{
        width,
        height,
      }}
    />
  );
}
