import type { DriveStep, driver } from 'driver.js';

export type DriverInstance = ReturnType<typeof driver>;
export type DriverGetter = () => DriverInstance | null;

export interface TourConfig {
  tourKey: string;
  steps: DriveStep[];
}

export interface TourNextStepDetail {
  elementId: string;
  title: string;
  description: string;
  nextTabId?: string;
}
