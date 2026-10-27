import Image from "next/image";
import { cn } from "@/lib/utils/cn";

type LandingImageProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export function LandingImage({
  src,
  alt,
  className,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: LandingImageProps) {
  return (
    <div className={cn("relative overflow-hidden bg-surface-muted", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
        sizes={sizes}
        priority={priority}
      />
    </div>
  );
}
