import { Partner } from 'src/partners/schemas/partner.schema';

export interface GetAllPartnersResponse {
  payload: Partner[];
  message: string;
  total: number;
  page: number;
  lastPage: number;
}
