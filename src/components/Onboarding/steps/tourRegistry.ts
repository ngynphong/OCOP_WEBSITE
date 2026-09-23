import type { TourConfig, DriverGetter } from './types';
import {
  getProductListSteps,
  getProductCreateSteps,
  getProductDetailSteps,
} from './productTourSteps';
import { getLotListSteps, getLotCreateSteps, getLotDetailSteps } from './lotTourSteps';

export function getTourConfig(pathname: string, getDriver: DriverGetter): TourConfig | null {
  if (pathname === '/dashboard/san-pham') {
    return getProductListSteps();
  }

  if (pathname === '/dashboard/san-pham/tao-moi') {
    return getProductCreateSteps();
  }

  if (pathname.match(/^\/dashboard\/san-pham\/\d+$/)) {
    return getProductDetailSteps(getDriver);
  }

  if (pathname === '/dashboard/lo-san-xuat') {
    return getLotListSteps();
  }

  if (pathname === '/dashboard/lo-san-xuat/tao-moi') {
    return getLotCreateSteps();
  }

  if (pathname.match(/^\/dashboard\/lo-san-xuat\/\d+$/)) {
    return getLotDetailSteps(getDriver);
  }

  return null;
}
