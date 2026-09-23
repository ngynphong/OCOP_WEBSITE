'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { getTourConfig, TourNextStepDetail } from './steps';

export const triggerTourEvent = new Event('trigger-onboarding-tour');

export function SellerTourGuide() {
  const pathname = usePathname();

  useEffect(() => {
    let driverObj: ReturnType<typeof driver> | null = null;
    let tourTimeout: NodeJS.Timeout | null = null;

    const runTour = (force = false) => {
      const config = getTourConfig(pathname, () => driverObj);
      if (!config || config.steps.length === 0) return;

      const { tourKey, steps } = config;
      const hasSeen = localStorage.getItem(tourKey);

      if (!hasSeen || force) {
        if (tourTimeout) clearTimeout(tourTimeout);
        tourTimeout = setTimeout(() => {
          const firstStepEl = steps[0].element as string;
          if (document.querySelector(firstStepEl)) {
            if (driverObj) {
              driverObj.destroy();
            }
            driverObj = driver({
              showProgress: true,
              nextBtnText: 'Tiếp theo',
              prevBtnText: 'Trở lại',
              doneBtnText: 'Hoàn thành',
              onDestroyed: () => {
                localStorage.setItem(tourKey, 'true');
              },
              steps,
            });
            driverObj.drive();
          }
        }, 500);
      }
    };

    runTour(false);

    const handleManualTrigger = () => runTour(true);
    const handleAutoTrigger = () => runTour(false);

    const handleNextStepTrigger = (e: Event) => {
      const customEvent = e as CustomEvent<TourNextStepDetail>;
      if (!customEvent.detail) return;
      const { elementId, title, description, nextTabId } = customEvent.detail;

      if (driverObj) driverObj.destroy();

      setTimeout(() => {
        driverObj = driver({
          showProgress: false,
          nextBtnText: 'Chuyển trang',
          doneBtnText: 'Đã hiểu',
          steps: [
            {
              element: `#${elementId}`,
              popover: {
                title,
                description,
                side: 'bottom',
                align: 'center',
                onNextClick: () => {
                  if (nextTabId) {
                    const el = document.getElementById(elementId);
                    if (el) el.click();
                  }
                  if (driverObj) driverObj.moveNext();
                },
              },
            },
          ],
        });
        driverObj.drive();
      }, 300);
    };

    window.addEventListener('trigger-onboarding-tour', handleManualTrigger);
    window.addEventListener('trigger-onboarding-tour-auto', handleAutoTrigger);
    window.addEventListener('trigger-tour-next-step', handleNextStepTrigger);

    return () => {
      window.removeEventListener('trigger-onboarding-tour', handleManualTrigger);
      window.removeEventListener('trigger-onboarding-tour-auto', handleAutoTrigger);
      window.removeEventListener('trigger-tour-next-step', handleNextStepTrigger);
      if (tourTimeout) clearTimeout(tourTimeout);
      if (driverObj) driverObj.destroy();
    };
  }, [pathname]);

  return null;
}
