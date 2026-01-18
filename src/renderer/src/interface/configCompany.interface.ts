export interface IConfigCompany {
  id: number;
  uuid: string;
  secret_company: string;
  email: string;
  address: string;
  telp: string;
  telp_wa: string;
  title_web: string;
  keyword_web: string;
  descripsi_web: string;
  facebook_link: string;
  tiktok_link: string;
  instagram_link: string;
  youtube_link: string;
  shope_link: string;
  tokped_link: string;
}

export interface IPayloadConfigCompany {
  id?: number | null;
  uuid?: string;
  secret_company: string;
  email: string;
  address: string;
  telp: string;
  title_web: string;
  keyword_web: string;
  descripsi_web: string;
  facebook_link: string;
  tiktok_link: string;
  instagram_link: string;
  youtube_link: string;
  shope_link: string;
  tokped_link: string;
}
