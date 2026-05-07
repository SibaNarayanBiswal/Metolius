import { Page, Locator } from '@playwright/test';

export class MenuLocators {
  readonly page: Page;

  // 🔹 Locators
  readonly dashboardMenu: Locator;
  readonly orgStructureMenu: Locator;
  readonly companyManagement: Locator;
  readonly departmentManagement: Locator;
  readonly participantManagement: Locator;
  readonly surveysMenu: Locator;
  readonly manageSurvey: Locator;
  readonly crosswalk: Locator;
  readonly resourceMenu: Locator;
  readonly distributionMenu: Locator;
  readonly assignAndSend: Locator;
  readonly scheduleLog: Locator;
  readonly progressReport: Locator;
  readonly emailQueue: Locator;
  readonly analyticsMenu: Locator;
  readonly questionAnalysis: Locator;
  readonly demographicBreakdown: Locator;
  readonly reportsMenu: Locator;
  readonly savedReports: Locator;
  readonly participantResponses: Locator;
  readonly intelligentReports: Locator;
  readonly manageTemplates: Locator;
  readonly manageIntelligentReports: Locator;
  readonly manageDatasets: Locator;
  readonly defaultSettings: Locator;
  readonly knowledgeBase: Locator;
  readonly logoutMenu: Locator;
  readonly savedReport_IR:Locator;

  constructor(page: Page) {
    this.page = page;

    // 🔥 Initialize locators (NO await here)
    this.dashboardMenu = page.getByRole('link', { name: 'Dashboard' });
    this.orgStructureMenu = page.locator("//span[normalize-space()='Org Structure']");
    this.companyManagement = page.getByText('Company Management');
    this.departmentManagement = page.getByText('Department Management');
    this.participantManagement = page.getByText('Participant Management');
    this.surveysMenu = page.locator("//span[normalize-space()='Surveys']");
    this.manageSurvey = page.getByText('Manage Surveys');
    this.crosswalk = page.getByText('View Crosswalks');
    this.resourceMenu = page.getByRole('link', { name: 'Resources' });
    this.distributionMenu = page.getByText('Distribution');
    this.assignAndSend = page.getByText('Assign & Send');
    this.scheduleLog = page.getByRole('link', { name: /Schedule Log/i });
    this.progressReport = page.getByText('Participant Progress Report');
    this.emailQueue = page.getByText('Email Queue');
    this.analyticsMenu = page.getByText('Analytics');
    this.questionAnalysis = page.getByText('Question Analysis');
    this.demographicBreakdown = page.getByText('Demographic Breakdown');
    this.reportsMenu = page.locator("//span[normalize-space()='Reports']");
    this.savedReports = page.locator("//a[@href='/my-reports']");
    this.participantResponses = page.getByText('Participant Responses');
    this.intelligentReports = page.locator(':text-is("Intelligent Reports")');
    this.manageTemplates = page.getByText('Manage Templates');
    this.manageIntelligentReports = page.getByText('Manage Intelligent Reports');
    this.manageDatasets = page.getByText('Manage Datasets');
    this.defaultSettings = page.getByText('Default Settings');
    this.knowledgeBase = page.getByText('Knowledge Base');
    this.logoutMenu = page.getByText('Log Out');
    this.savedReport_IR=page.locator("//span[@class='ps-2'][normalize-space()='Saved Reports'])[2]")
  }
}