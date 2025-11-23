// types/gtag.d.ts
export {};

declare global {
  interface Window {
    gtag: (
      command: 'consent' | 'config' | 'event' | 'js' | 'set',
      targetId: string | Date | 'update',
      config?: Record<string, any>
    ) => void;
    dataLayer: any[];
  }
}