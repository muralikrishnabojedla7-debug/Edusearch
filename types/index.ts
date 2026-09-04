export interface Course {
  id: string;
  name: string;
  duration: string;
  fees: number;
  seats: number;
  eligibility: string;
}

export interface Placement {
  overallPercentage: number;
  averagePackage: number;
  highestPackage: number;
  medianPackage: number;
  topRecruiters: string[];
  stats: {
    year: number;
    percentage: number;
    avgPackage: number;
    highestPackage: number;
  }[];
}

export interface Rating {
  overall: number;
  academics: number;
  infrastructure: number;
  placements: number;
  faculty: number;
  reviewsCount: number;
}

export interface Facility {
  id: string;
  name: string;
  icon: string;
  available: boolean;
}

export interface College {
  id: string;
  name: string;
  shortName: string;
  city: string;
  state: string;
  type: "Government" | "Private" | "Deemed University" | "Autonomous";
  ownership: "Public" | "Private";
  rating: Rating;
  annualFees: number;
  courses: Course[];
  placement: Placement;
  facilities: Facility[];
  description: string;
  establishedYear: number;
  campusSize: string;
  accredited: string;
  featured: boolean;
  image: string;
  brochureUrl: string;
  applicationUrl: string;
  approvedBy: string[];

  location?: string;
  fees?: number;
  placementPercent?: number;
  reviews?: number;
  avgPackage?: number;
  highestPackage?: number;
  established?: number;
  totalStudents?: number;
  facultyCount?: number;
  coursesCount?: number;
  facilitiesCount?: number;
}

export interface CollegeFilters {
  search: string;
  state: string[];
  city: string[];
  course: string[];
  minRating: number;
  maxRating: number;
  minFees: number;
  maxFees: number;
  minPlacement: number;
  maxAvgPackage: number;
  type: string[];
  accredited: string[];
  featuredOnly: boolean;
  facilities: string[];
}

export type SortOption =
  | "rating-desc"
  | "rating-asc"
  | "fees-desc"
  | "fees-asc"
  | "placement-desc"
  | "placement-asc"
  | "avgPackage-desc"
  | "avgPackage-asc"
  | "highestPackage-desc"
  | "highestPackage-asc"
  | "name-asc"
  | "name-desc";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  total?: number;
  page?: number;
  pageSize?: number;
}
