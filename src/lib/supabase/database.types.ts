export type ListingStatus = 'draft' | 'published' | 'archived';
export type ListingType = 'room' | 'whole_unit' | 'student_apartment';
export type PeopleRequestMode = 'buddy' | 'service';
export type PeopleBudgetType = 'aa' | 'treat' | 'fixed' | 'negotiable';
export type PeopleRequestStatus = 'open' | 'matched' | 'closed' | 'expired';
export type ExpertPriceType = 'hourly' | 'fixed' | 'negotiable';
export type ExpertServiceStatus = 'active' | 'inactive' | 'pending_review' | 'rejected';
export type MatchStatus = 'suggested' | 'applied' | 'accepted' | 'rejected' | 'cancelled';

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
  parent_id: string | null;
  body: string;
  created_at: string;
  profiles?: Pick<Profile, 'display_name' | 'avatar_url'> | null;
};

export type UserProfile = {
  id: string;
  user_id: string;
  nickname: string;
  avatar_url: string | null;
  gender: string | null;
  age_range: string | null;
  languages: string[];
  location_area: string | null;
  bio: string | null;
  is_verified: boolean;
  rating_avg: number;
  rating_count: number;
  created_at: string;
  updated_at: string;
};

export type PeopleRequest = {
  id: string;
  creator_id: string;
  mode: PeopleRequestMode;
  category: string;
  title: string;
  description: string;
  location_area: string | null;
  specific_location: string | null;
  start_time: string | null;
  end_time: string | null;
  budget_type: PeopleBudgetType;
  budget_amount: number | null;
  desired_count: number;
  requirements: string | null;
  status: PeopleRequestStatus;
  created_at: string;
  updated_at: string;
};

export type ExpertService = {
  id: string;
  provider_id: string;
  category: string;
  title: string;
  description: string;
  price_type: ExpertPriceType;
  price_amount: number | null;
  service_area: string | null;
  available_times: string[];
  tags: string[];
  proof_images: string[];
  status: ExpertServiceStatus;
  created_at: string;
  updated_at: string;
};

export type PeopleMatch = {
  id: string;
  request_id: string;
  matched_user_id: string;
  match_score: number;
  status: MatchStatus;
  message: string | null;
  created_at: string;
  updated_at: string;
};

export type Conversation = {
  id: string;
  request_id: string;
  user_a_id: string;
  user_b_id: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export type Review = {
  id: string;
  reviewer_id: string;
  target_user_id: string;
  request_id: string | null;
  rating: number;
  content: string | null;
  created_at: string;
};

export type Report = {
  id: string;
  reporter_id: string | null;
  target_type: string;
  target_id: string;
  reason: string;
  status: string;
  created_at: string;
};

export type ListingWithOwner = Listing & {
  profiles?: Pick<Profile, 'display_name' | 'phone' | 'avatar_url'> | null;
  favorites?: Favorite[];
  comments?: Comment[];
};

export type PeopleRequestWithCreator = PeopleRequest & {
  profiles?: Pick<Profile, 'display_name' | 'avatar_url'> | null;
};

export type ExpertServiceWithProvider = ExpertService & {
  profiles?: Pick<Profile, 'display_name' | 'avatar_url'> | null;
  user_profiles?: Pick<UserProfile, 'nickname' | 'avatar_url' | 'is_verified' | 'rating_avg' | 'rating_count' | 'location_area'>[] | null;
};

export type PeopleMatchWithUser = PeopleMatch & {
  profiles?: Pick<Profile, 'display_name' | 'avatar_url'> | null;
  user_profiles?: Pick<UserProfile, 'nickname' | 'avatar_url' | 'is_verified' | 'rating_avg' | 'rating_count' | 'location_area'>[] | null;
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
      user_profiles: {
        Row: UserProfile;
        Insert: Omit<UserProfile, 'id' | 'created_at' | 'updated_at' | 'rating_avg' | 'rating_count' | 'is_verified'> & {
          id?: string;
          avatar_url?: string | null;
          gender?: string | null;
          age_range?: string | null;
          languages?: string[];
          location_area?: string | null;
          bio?: string | null;
          is_verified?: boolean;
          rating_avg?: number;
          rating_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<UserProfile>;
      };
      people_requests: {
        Row: PeopleRequest;
        Insert: Omit<PeopleRequest, 'id' | 'created_at' | 'updated_at' | 'status'> & {
          id?: string;
          status?: PeopleRequestStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<PeopleRequest>;
      };
      expert_services: {
        Row: ExpertService;
        Insert: Omit<ExpertService, 'id' | 'created_at' | 'updated_at' | 'status'> & {
          id?: string;
          status?: ExpertServiceStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<ExpertService>;
      };
      matches: {
        Row: PeopleMatch;
        Insert: Omit<PeopleMatch, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<PeopleMatch>;
      };
      conversations: {
        Row: Conversation;
        Insert: Omit<Conversation, 'id' | 'created_at' | 'updated_at' | 'status'> & {
          id?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Conversation>;
      };
      reviews: {
        Row: Review;
        Insert: Omit<Review, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Review>;
      };
      reports: {
        Row: Report;
        Insert: Omit<Report, 'id' | 'created_at' | 'status'> & {
          id?: string;
          status?: string;
          created_at?: string;
        };
        Update: Partial<Report>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      listing_status: ListingStatus;
      listing_type: ListingType;
      people_request_mode: PeopleRequestMode;
      people_budget_type: PeopleBudgetType;
      people_request_status: PeopleRequestStatus;
      expert_price_type: ExpertPriceType;
      expert_service_status: ExpertServiceStatus;
      match_status: MatchStatus;
    };
  };
};
