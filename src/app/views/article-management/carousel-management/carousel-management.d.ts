import { BaseStatuses } from "src/app/commons/abstracts/common";

export declare interface GetCarouselListResponse {
  carouselList: Array<Carousel>;
  totalPages: number;
}

export declare interface Carousel {
  carouselId: number;
  carouselTitle?: string;
  carouselImagePath: string;
  description: string;
  link?: string;
  createdUserId?: number;
  createdAt?: Date;
  updatedUserId?: number;
  updatedAt?: Date;
}

export declare interface AddCarousel {
  carouselTitle?: string;
  carouselImagePath: string;
  description: string;
  link?: string;
}

export declare interface CarouselManagementStatuses extends BaseStatuses {}

export declare type AsCarouselType = 'update' | 'delete';
