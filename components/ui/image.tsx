import * as React from "react";

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
}

export function Image({ className, ...props }: ImageProps) {
  return (
    <img
      className={`rounded-md object-cover ${className ?? ""}`}
      {...props}
    />
  );
}
