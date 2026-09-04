"use server";

import type { ApiResponse, College, CollegeFilters, Placement, Rating, SortOption } from "@/types";
import {
  colleges,
  getCollegeByIdData,
  getFeaturedCollegesData,
} from "@/data/colleges";
import { sleep } from "@/lib/utils";

const applyFilters = (
  data: College[],
  filters: Partial<CollegeFilters>
): College[] => {
  return data.filter((college) => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        college.name.toLowerCase().includes(searchLower) ||
        college.shortName.toLowerCase().includes(searchLower) ||
        college.city.toLowerCase().includes(searchLower) ||
        college.state.toLowerCase().includes(searchLower) ||
        college.courses.some((c) =>
          c.name.toLowerCase().includes(searchLower)
        );
      if (!matchesSearch) return false;
    }

    if (filters.state && filters.state.length > 0) {
      if (!filters.state.includes(college.state)) return false;
    }

    if (filters.city && filters.city.length > 0) {
      if (!filters.city.includes(college.city)) return false;
    }

    if (filters.course && filters.course.length > 0) {
      const hasCourse = college.courses.some((c) =>
        filters.course!.includes(c.name)
      );
      if (!hasCourse) return false;
    }

    if (filters.minRating && college.rating.overall < filters.minRating) {
      return false;
    }

    if (filters.maxRating && college.rating.overall > filters.maxRating) {
      return false;
    }

    if (filters.minFees && college.annualFees < filters.minFees) {
      return false;
    }

    if (filters.maxFees && college.annualFees > filters.maxFees) {
      return false;
    }

    if (
      filters.minPlacement &&
      college.placement.overallPercentage < filters.minPlacement
    ) {
      return false;
    }

    if (
      filters.maxAvgPackage &&
      college.placement.averagePackage > filters.maxAvgPackage
    ) {
      return false;
    }

    if (filters.type && filters.type.length > 0) {
      if (!filters.type.includes(college.type)) return false;
    }

    if (filters.accredited && filters.accredited.length > 0) {
      if (!filters.accredited.includes(college.accredited)) return false;
    }

    if (filters.featuredOnly && !college.featured) {
      return false;
    }

    if (filters.facilities && filters.facilities.length > 0) {
      const hasFacility = college.facilities.some((f) =>
        filters.facilities!.includes(f.name)
      );
      if (!hasFacility) return false;
    }

    return true;
  });
};

const applySort = (
  data: College[],
  sortOption: SortOption | null
): College[] => {
  if (!sortOption) return data;

  const sorted = [...data];
  const [field, direction] = sortOption.split("-") as [
    string,
    "asc" | "desc"
  ];

  sorted.sort((a, b) => {
    let aVal: number | string = 0;
    let bVal: number | string = 0;

    switch (field) {
      case "rating":
        aVal = a.rating.overall;
        bVal = b.rating.overall;
        break;
      case "fees":
        aVal = a.annualFees;
        bVal = b.annualFees;
        break;
      case "placement":
        aVal = a.placement.overallPercentage;
        bVal = b.placement.overallPercentage;
        break;
      case "avgPackage":
        aVal = a.placement.averagePackage;
        bVal = b.placement.averagePackage;
        break;
      case "highestPackage":
        aVal = a.placement.highestPackage;
        bVal = b.placement.highestPackage;
        break;
      case "name":
        aVal = a.name;
        bVal = b.name;
        break;
      default:
        return 0;
    }

    if (typeof aVal === "number" && typeof bVal === "number") {
      return direction === "asc" ? aVal - bVal : bVal - aVal;
    }

    if (typeof aVal === "string" && typeof bVal === "string") {
      return direction === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    return 0;
  });

  return sorted;
};

export interface GetCollegesParams {
  filters?: Partial<CollegeFilters>;
  sort?: SortOption;
  page?: number;
  pageSize?: number;
  delayMs?: number;
}

export async function getColleges(
  params: GetCollegesParams = {}
): Promise<ApiResponse<College[]>> {
  const {
    filters = {},
    sort = null,
    page = 1,
    pageSize = 100,
    delayMs = 300,
  } = params;

  if (delayMs > 0) {
    await sleep(delayMs);
  }

  try {
    let result = applyFilters(colleges, filters);
    result = applySort(result, sort);

    const total = result.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    result = result.slice(start, end);

    return {
      success: true,
      data: result,
      total,
      page,
      pageSize,
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      message: error instanceof Error ? error.message : "Failed to fetch colleges",
    };
  }
}

export async function getCollegeById(
  id: string,
  delayMs: number = 200
): Promise<ApiResponse<College | null>> {
  if (delayMs > 0) {
    await sleep(delayMs);
  }

  try {
    const college = getCollegeByIdData(id);

    if (!college) {
      return {
        success: false,
        data: null,
        message: "College not found",
      };
    }

    return {
      success: true,
      data: college,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : "Failed to fetch college",
    };
  }
}

export async function getFeaturedColleges(
  delayMs: number = 200
): Promise<ApiResponse<College[]>> {
  if (delayMs > 0) {
    await sleep(delayMs);
  }

  try {
    const featured = getFeaturedCollegesData();
    return {
      success: true,
      data: featured,
      total: featured.length,
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      message: error instanceof Error ? error.message : "Failed to fetch featured colleges",
    };
  }
}

export type { SortOption, CollegeFilters } from "@/types";

type CollegeWithFlatFields = Omit<College, "rating"> & {
  rating: number;
  ratings: Rating;
  fees: number;
  placementPercent: number;
  reviews: number;
  avgPackage: number;
  highestPackage: number;
  established: number;
  location: string;
  totalStudents: number;
  facultyCount: number;
  coursesCount: number;
  facilitiesCount: number;
  placementYears: Placement["stats"];
  recruiters: Placement["topRecruiters"];
};

const flattenCollege = (c: College): CollegeWithFlatFields => ({
  ...c,
  ratings: c.rating,
  rating: c.rating.overall,
  fees: c.annualFees,
  placementPercent: c.placement.overallPercentage,
  reviews: c.rating.reviewsCount,
  avgPackage: c.placement.averagePackage,
  highestPackage: c.placement.highestPackage,
  established: c.establishedYear,
  location: `${c.city}, ${c.state}`,
  totalStudents: c.courses.reduce((sum, co) => sum + co.seats, 0) * 4,
  facultyCount: Math.round(c.courses.length * 8),
  coursesCount: c.courses.length,
  facilitiesCount: c.facilities.length,
  placementYears: c.placement.stats,
  recruiters: c.placement.topRecruiters,
});

export interface FetchCollegesParams {
  query?: string;
  state?: string;
  city?: string;
  minRating?: number;
  maxFees?: number;
  sort?: SortOption;
  page?: number;
  limit?: number;
}

export async function fetchColleges(params: FetchCollegesParams = {}) {
  const {
    query,
    state,
    minRating,
    maxFees,
    sort = "rating-desc",
    page = 1,
    limit = 12,
  } = params;

  const filters: Partial<CollegeFilters> = {};
  if (query) filters.search = query;
  if (state) filters.state = [state];
  if (minRating !== undefined) filters.minRating = minRating;
  if (maxFees !== undefined) filters.maxFees = maxFees;

  const result = await getColleges({
    filters,
    sort,
    page,
    pageSize: limit,
    delayMs: 100,
  });

  const flatColleges = (result.data || []).map(flattenCollege);
  const totalPages = Math.ceil((result.total || 0) / limit);

  return {
    colleges: flatColleges,
    total: result.total || 0,
    totalPages,
    page,
  };
}

export async function fetchFeaturedColleges(limit: number = 6) {
  const result = await getFeaturedColleges(100);
  const flatColleges = (result.data || []).slice(0, limit).map(flattenCollege);
  return flatColleges;
}

export async function fetchCollegeById(id: string) {
  const result = await getCollegeById(id, 100);
  if (!result.success || !result.data) return null;
  return flattenCollege(result.data);
}
