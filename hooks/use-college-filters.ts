"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { CollegeFilters, SortOption } from "@/types";

export const DEFAULT_FILTERS: CollegeFilters = {
  search: "",
  state: [],
  city: [],
  course: [],
  minRating: 0,
  maxRating: 5,
  minFees: 0,
  maxFees: 500000,
  minPlacement: 0,
  maxAvgPackage: 2000000,
  type: [],
  accredited: [],
  featuredOnly: false,
  facilities: [],
};

const parseArrayParam = (
  value: string | null
): string[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return value ? value.split(",").filter(Boolean) : [];
  }
};

const parseNumberParam = (
  value: string | null,
  defaultValue: number
): number => {
  if (!value) return defaultValue;
  const parsed = Number(value);
  return isNaN(parsed) ? defaultValue : parsed;
};

const parseBooleanParam = (
  value: string | null,
  defaultValue: boolean
): boolean => {
  if (!value) return defaultValue;
  return value === "true";
};

export function useCollegeFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getInitialFilters = useCallback((): CollegeFilters => {
    const params = searchParams;
    return {
      search: params.get("search") ?? DEFAULT_FILTERS.search,
      state: parseArrayParam(params.get("state")),
      city: parseArrayParam(params.get("city")),
      course: parseArrayParam(params.get("course")),
      minRating: parseNumberParam(
        params.get("minRating"),
        DEFAULT_FILTERS.minRating
      ),
      maxRating: parseNumberParam(
        params.get("maxRating"),
        DEFAULT_FILTERS.maxRating
      ),
      minFees: parseNumberParam(params.get("minFees"), DEFAULT_FILTERS.minFees),
      maxFees: parseNumberParam(params.get("maxFees"), DEFAULT_FILTERS.maxFees),
      minPlacement: parseNumberParam(
        params.get("minPlacement"),
        DEFAULT_FILTERS.minPlacement
      ),
      maxAvgPackage: parseNumberParam(
        params.get("maxAvgPackage"),
        DEFAULT_FILTERS.maxAvgPackage
      ),
      type: parseArrayParam(params.get("type")),
      accredited: parseArrayParam(params.get("accredited")),
      featuredOnly: parseBooleanParam(
        params.get("featuredOnly"),
        DEFAULT_FILTERS.featuredOnly
      ),
      facilities: parseArrayParam(params.get("facilities")),
    };
  }, [searchParams]);

  const [filters, setFilters] = useState<CollegeFilters>(getInitialFilters);
  const [sort, setSort] = useState<SortOption>(() => {
    const s = searchParams.get("sort");
    if (s && isValidSortOption(s)) return s;
    return "rating-desc";
  });

  function isValidSortOption(s: string): s is SortOption {
    const valid: SortOption[] = [
      "rating-desc",
      "rating-asc",
      "fees-desc",
      "fees-asc",
      "placement-desc",
      "placement-asc",
      "avgPackage-desc",
      "avgPackage-asc",
      "highestPackage-desc",
      "highestPackage-asc",
      "name-asc",
      "name-desc",
    ];
    return valid.includes(s as SortOption);
  }

  const syncToURL = useCallback(
    (newFilters: CollegeFilters, newSort: SortOption) => {
      const params = new URLSearchParams();

      if (newFilters.search) params.set("search", newFilters.search);
      if (newFilters.state.length > 0)
        params.set("state", JSON.stringify(newFilters.state));
      if (newFilters.city.length > 0)
        params.set("city", JSON.stringify(newFilters.city));
      if (newFilters.course.length > 0)
        params.set("course", JSON.stringify(newFilters.course));

      if (newFilters.minRating !== DEFAULT_FILTERS.minRating)
        params.set("minRating", String(newFilters.minRating));
      if (newFilters.maxRating !== DEFAULT_FILTERS.maxRating)
        params.set("maxRating", String(newFilters.maxRating));
      if (newFilters.minFees !== DEFAULT_FILTERS.minFees)
        params.set("minFees", String(newFilters.minFees));
      if (newFilters.maxFees !== DEFAULT_FILTERS.maxFees)
        params.set("maxFees", String(newFilters.maxFees));
      if (newFilters.minPlacement !== DEFAULT_FILTERS.minPlacement)
        params.set("minPlacement", String(newFilters.minPlacement));
      if (
        newFilters.maxAvgPackage !== DEFAULT_FILTERS.maxAvgPackage
      )
        params.set("maxAvgPackage", String(newFilters.maxAvgPackage));

      if (newFilters.type.length > 0)
        params.set("type", JSON.stringify(newFilters.type));
      if (newFilters.accredited.length > 0)
        params.set("accredited", JSON.stringify(newFilters.accredited));
      if (newFilters.featuredOnly)
        params.set("featuredOnly", String(newFilters.featuredOnly));
      if (newFilters.facilities.length > 0)
        params.set("facilities", JSON.stringify(newFilters.facilities));

      if (newSort !== "rating-desc") params.set("sort", newSort);

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

      router.replace(newUrl, { scroll: false });
    },
    [pathname, router]
  );

  useEffect(() => {
    syncToURL(filters, sort);
  }, [filters, sort, syncToURL]);

  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  }, []);

  const toggleArrayFilter = useCallback(
    (key: keyof Pick<
      CollegeFilters,
      "state" | "city" | "course" | "type" | "accredited" | "facilities"
    >,
      value: string
    ) => {
      setFilters((prev) => {
        const current = prev[key];
        const updated = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value];
        return { ...prev, [key]: updated } as CollegeFilters;
      });
    },
    []
  );

  const setArrayFilter = useCallback(
    (
      key: keyof Pick<
        CollegeFilters,
        "state" | "city" | "course" | "type" | "accredited" | "facilities"
      >,
      values: string[]
    ) => {
      setFilters((prev) => ({ ...prev, [key]: values }));
    },
    []
  );

  const setRangeFilter = useCallback(
    (
      key: keyof Pick<
        CollegeFilters,
        | "minRating"
        | "maxRating"
        | "minFees"
        | "maxFees"
        | "minPlacement"
        | "maxAvgPackage"
      >,
      value: number
    ) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const setRatingRange = useCallback((min: number, max: number) => {
    setFilters((prev) => ({ ...prev, minRating: min, maxRating: max }));
  }, []);

  const setFeesRange = useCallback((min: number, max: number) => {
    setFilters((prev) => ({ ...prev, minFees: min, maxFees: max }));
  }, []);

  const toggleFeaturedOnly = useCallback(() => {
    setFilters((prev) => ({ ...prev, featuredOnly: !prev.featuredOnly }));
  }, []);

  const setFeaturedOnly = useCallback((value: boolean) => {
    setFilters((prev) => ({ ...prev, featuredOnly: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setSort("rating-desc");
  }, []);

  const updateFilters = useCallback(
    (updates: Partial<CollegeFilters>) => {
      setFilters((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  const isFilterActive = useCallback(
    (key: keyof CollegeFilters): boolean => {
      const value = filters[key];
      const defaultVal = DEFAULT_FILTERS[key];
      if (Array.isArray(value) && Array.isArray(defaultVal)) {
        return value.length !== defaultVal.length ||
          value.some((v, i) => v !== defaultVal[i]);
      }
      return value !== defaultVal;
    },
    [filters]
  );

  const hasActiveFilters = useCallback((): boolean => {
    const keys = Object.keys(DEFAULT_FILTERS) as (keyof CollegeFilters)[];
    return keys.some((key) => isFilterActive(key));
  }, [isFilterActive]);

  return {
    filters,
    sort,
    setSort,
    setSearch,
    toggleArrayFilter,
    setArrayFilter,
    setRangeFilter,
    setRatingRange,
    setFeesRange,
    toggleFeaturedOnly,
    setFeaturedOnly,
    resetFilters,
    updateFilters,
    isFilterActive,
    hasActiveFilters,
  };
}
