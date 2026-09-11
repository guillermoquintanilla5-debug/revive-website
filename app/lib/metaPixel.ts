export const META_PIXEL_ID = "2116456075622107";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}
