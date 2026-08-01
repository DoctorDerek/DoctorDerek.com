declare module "*.svg?url" {
  const source: import("next/image").StaticImageData

  export default source
}
