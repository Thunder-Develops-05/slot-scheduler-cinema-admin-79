
export interface Center {
  id: string;
  name: string;
  location: string;
  capacity: number; // maximum people per slot
  courts: number; // number of cricket courts
  description?: string;
  imageUrl?: string;
  amenities?: string[];
  isActive?: boolean;
  contactNumber?: string;
  address?: string;
}
