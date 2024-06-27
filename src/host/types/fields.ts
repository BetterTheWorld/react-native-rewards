export type CountryField = {
  id: string;
  value: string;
  label: string;
  token?: string;
  formInput: string;
};

export type CityField = {
  id: string;
  value: string;
};

export interface CreateTeamFormValues {
  teamName: string;
  city?: CityPrediction;
  sport?: Category;
  country?: CountryField;
  role: TeamRole[];
}

export interface GoogleCityPrediction {
  description: string;
  place_id: string;
}

export interface CityPrediction {
  value: string;
  id: string;
}

export interface Category {
  name: string;
  featured: boolean;
  image: string;
  slug: string;
  parent: CategoryParent | null;
}

export interface CategoryParent {
  slug: string;
  name: string;
}

export interface CategoryResponse {
  data: {
    categories: Category[];
  };
}

export interface CategorySection {
  title: string;
  data: Category[];
}

export interface TeamRole {
  id: string;
  name: string;
}

export interface SiteRoles {
  id: string;
  teamRoles: TeamRole[];
}

export interface SiteRolesGraphQLResponse {
  data: {
    Site: SiteRoles;
  };
}
