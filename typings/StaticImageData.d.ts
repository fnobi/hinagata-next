module "next/image-types" {
  export type StaticImageData = {
    src: string;
    height: number;
    width: number;
    blurDataURL?: string;
  };
}
