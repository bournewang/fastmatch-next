export enum Gender {
  Male,
  Female
}

export enum CompanyType {
  StateOwned,    // 国企
  Foreign,       // 外企
  Private,       // 私企
  Startup,       // 创业公司
  Other          // 其他
}

export enum AnnualIncome {
  Below10W,      // 10万以下
  From10Wto20W,  // 10-20万
  From20Wto30W,  // 20-30万
  From30Wto50W,  // 30-50万
  From50Wto100W, // 50-100万
  Above100W      // 100万以上
}

export enum Education {
  HighSchool,    // 高中
  JuniorCollege, // 大专
  Bachelor,      // 本科
  Master,        // 硕士
  PhD,           // 博士
  Other          // 其他
}

export const COMPANY_TYPE_LABELS: Record<CompanyType, string> = {
  [CompanyType.StateOwned]: '国企',
  [CompanyType.Foreign]: '外企',
  [CompanyType.Private]: '私企',
  [CompanyType.Startup]: '创业公司',
  [CompanyType.Other]: '其他'
}

export const ANNUAL_INCOME_LABELS: Record<AnnualIncome, string> = {
  [AnnualIncome.Below10W]: '10万以下',
  [AnnualIncome.From10Wto20W]: '10-20万',
  [AnnualIncome.From20Wto30W]: '20-30万',
  [AnnualIncome.From30Wto50W]: '30-50万',
  [AnnualIncome.From50Wto100W]: '50-100万',
  [AnnualIncome.Above100W]: '100万以上'
}

export const EDUCATION_LABELS: Record<Education, string> = {
  [Education.HighSchool]: '高中',
  [Education.JuniorCollege]: '大专',
  [Education.Bachelor]: '本科',
  [Education.Master]: '硕士',
  [Education.PhD]: '博士',
  [Education.Other]: '其他'
} 