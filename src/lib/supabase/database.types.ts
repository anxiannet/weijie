export type ListingStatus = 'draft' | 'published' | 'archived';
export type ListingType = 'room' | 'whole_unit' | 'student_apartment';

export type Profile = {
  id: string;
  display_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
};

export type Listing = {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  location: string;
  nearest_school: string | null;
  mrt_station: string | null;
  price_sgd: number;
  bedrooms: number | null;
  bathrooms: number | null;
  listing_type: ListingType;
  available_from: string | null;
  image_urls: string[];
  amenities: string[];
  status: ListingStatus;
  created_at: string;
  updated_at: string;
};

export type Favorite = {
  user_id: string;
  listing_id: string;
  created_at: string;
};

export type Comment = {
  id: string;
  listing_id: string;
  user_id: string;
  body: string;
  created_at: string;
  profiles?: Pick<Profile, 'display_name' | 'avatar_url'> | null;
};

export type ListingWithOwner = Listing & {
  profiles?: Pick<Profile, 'display_name' | 'phone' | 'avatar_url'> | null;
  favorites?: Favorite[];
  comments?: Comment[];
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string };
        Update: Partial<Profile>;
      };
      listings: {
        Row: Listing;
        Insert: Omit<Listing, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Listing>;
      };
      favorites: {
        Row: Favorite;
        Insert: Favorite;
        Update: Partial<Favorite>;
      };
      comments: {
        Row: Comment;
        Insert: Omit<Comment, 'id' | 'created_at' | 'profiles'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Pick<Comment, 'body'>>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      listing_status: ListingStatus;
      listing_type: ListingType;
    };
  };
};
