
export interface Theater {
  id: string;
  name: string;
  location: string;
  capacity: number;
  screens: number;
  description?: string;
  imageUrl?: string;
  amenities?: string[];
  isActive?: boolean;
}
