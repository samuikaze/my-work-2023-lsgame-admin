export declare interface AddNews {
  newsTitle: string | null;
  newsType: string | null;
  newsContent: string | null;
}

export declare interface NewsListResponse {
  newsList: Array<News>;
  totalPages: number;
}

export declare interface NewsList {
  newsList: Array<News>;
  totalPages: number;
}

export declare interface News {
  newsId: number;
  newsTypeId: number;
  newsTitle: string;
  newsContent: string;
  createdUserId?: number | null;
  createdAt?: Date | null;
  updatedUserId?: number | null;
  updatedAt?: Date | null;
  deletedUserId?: number | null;
  deletedAt?: Date | null;
}

export declare interface NewsType {
  newsTypeId: number;
  name: string;
  createdUserId: number | null;
  createdAt: Date | null;
  updatedUserId: number | null;
  updatedAt: Date | null;
}
