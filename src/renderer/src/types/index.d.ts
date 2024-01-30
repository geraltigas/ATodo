declare module "*.module.css" {
  const content: Record<string, string>;
  export default content;
}

declare module '*.mp3' {
  const src: string;
  export default src;
}
