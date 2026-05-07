import { test, expect } from '@playwright/test';
import { getExcelData } from '../utils/excelReader';
import { MenuLocators } from '../page/element';

// 👉 Excel path
const filePath = "D:/Metolius_Automation/TestData/Login_DDT.xlsx";

// 👉 Sheet name
const users = getExcelData(filePath, "login page");

// 🔹 Helper Functions
async function expectVisible(...elements: any[]) {
  for (const el of elements) {
    await expect(el).toBeVisible();
  }
}

async function expectNotVisible(...elements: any[]) {
  for (const el of elements) {
    await expect(el).not.toBeVisible();
  }
}

// 🔥 Run tests in parallel
test.describe.parallel('Login DDT Tests', () => {

  users.forEach((user: any, index: number) => {

    test(`Login | ${user.Login_Type} | ${user.Username}`, async ({ page }) => {

      const menu = new MenuLocators(page);
      const role = (user.Login_Type || '').toLowerCase();

      await page.goto("https://survey.metoliusaa.com/", {
        waitUntil: 'domcontentloaded',
        timeout: 60000
        });
      await expect(page).toHaveTitle(/Metolius/);

      // ================= LOGIN PAGE =================
    //   await expect(page.locator(".authSec_logo img")).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Welcome Back!' })).toBeVisible();

      await expectVisible(
        page.getByPlaceholder("Enter username"),
        page.getByPlaceholder("Enter password"),
        page.locator("#terms")
      );

      // ================= FORGOT PASSWORD =================
      page.on("dialog", async (dialog) => {
        console.log(dialog.message());
        expect(dialog.message()).toContain("Username does not exist.");
        await dialog.accept();
      });

      await page.getByText("Forgot Password").click();
      await page.getByPlaceholder("Enter Username").fill("abcdef");
      await page.locator("//button[normalize-space()='Reset Password']").click();

      await page.goBack();

      // ================= TERMS =================
      await page.getByRole('link', { name: 'Terms of Use' }).click();
      await expect(page.getByRole('dialog')).toContainText('Please read these Terms of Use');
      await page.getByRole('button', { name: 'Close' }).click();

      // ================= LOGIN =================
      await page.getByPlaceholder('Enter username').fill(user.Username);
      await page.getByPlaceholder('Enter password').fill(user.Password);
      await page.locator("#terms").check();
      await page.locator("button[type='submit']").click();

      const logoutButton = page.locator("//span[normalize-space()='Log Out']");

      await expect(page).toHaveURL(/dashboard|home/);
      await expect(logoutButton).toBeVisible();

      console.log(`✅ Login successful for: ${user.Username}`);

      // Ensure menu visible
      if (!(await logoutButton.isVisible())) {
        await page.locator("//button[contains(@class,'menuBar')]").click();
      }

      // ================= ROLE VALIDATION =================

      if (role === 'enterprise admin') {

        await expectVisible(
          menu.dashboardMenu,
          menu.orgStructureMenu,
          menu.surveysMenu,
          menu.distributionMenu,
          menu.analyticsMenu,
          menu.reportsMenu,
          menu.defaultSettings,
          menu.knowledgeBase,
          menu.logoutMenu
        );

        await menu.orgStructureMenu.click();
        await expectVisible(
          menu.companyManagement,
          menu.departmentManagement,
          menu.participantManagement
        );

        await menu.surveysMenu.click();
        await expectVisible(menu.manageSurvey, menu.crosswalk, menu.resourceMenu);

        await menu.distributionMenu.click();
        await expectVisible(
          menu.assignAndSend,
          menu.scheduleLog,
          menu.progressReport,
          menu.emailQueue
        );

        await menu.analyticsMenu.click();
        await expectVisible(menu.questionAnalysis, menu.demographicBreakdown);

        await menu.reportsMenu.click();
        await expectVisible(menu.savedReports, menu.participantResponses);

        await menu.intelligentReports.click();
        await expectVisible(
          menu.manageTemplates,
          menu.manageIntelligentReports,
          menu.manageDatasets
        );

      }

      else if (role === 'company admin') {

        await expectVisible(
          menu.dashboardMenu,
          menu.orgStructureMenu,
          menu.surveysMenu,
          menu.distributionMenu,
          menu.analyticsMenu,
          menu.reportsMenu,
          menu.defaultSettings,
          menu.knowledgeBase,
          menu.logoutMenu
        );

        await menu.orgStructureMenu.click();
        await expectNotVisible(menu.companyManagement);
        await expectVisible(menu.departmentManagement, menu.participantManagement);

        await menu.intelligentReports.click();
        await expectVisible(menu.savedReport_IR);
        await expectNotVisible(
          menu.manageTemplates,
          menu.manageIntelligentReports,
          menu.manageDatasets
        );

      }

      else if (role === 'company support user') {

        await expectVisible(
          menu.dashboardMenu,
          menu.surveysMenu,
          menu.distributionMenu,
          menu.analyticsMenu,
          menu.reportsMenu,
          menu.logoutMenu
        );

        await expectNotVisible(menu.orgStructureMenu);

        await menu.surveysMenu.click();
        await expectNotVisible(menu.manageSurvey, menu.crosswalk);
        await expectVisible(menu.resourceMenu);

      }

      else if (role === 'company analyst') {

        await expectVisible(
          menu.dashboardMenu,
          menu.surveysMenu,
          menu.distributionMenu,
          menu.analyticsMenu,
          menu.reportsMenu,
          menu.knowledgeBase,
          menu.logoutMenu
        );

        await expectNotVisible(menu.orgStructureMenu, menu.defaultSettings);

        await menu.analyticsMenu.click();
        await expectVisible(menu.questionAnalysis, menu.demographicBreakdown);

      }

      else if (role === 'client user access') {

        await expectVisible(
          menu.dashboardMenu,
          menu.analyticsMenu,
          menu.reportsMenu,
          menu.knowledgeBase,
          menu.logoutMenu
        );

        await expectNotVisible(
          menu.orgStructureMenu,
          menu.surveysMenu,
          menu.distributionMenu,
          menu.defaultSettings
        );

        await menu.reportsMenu.click();
        await expectVisible(menu.savedReports);
        await expectNotVisible(menu.participantResponses);

        await menu.intelligentReports.click();
        await expectVisible(menu.savedReport_IR);

      }

      else {
        console.log(`⚠️ Invalid role: ${user.Login_Type}`);
      }

      // ================= LOGOUT =================
      await menu.logoutMenu.click();
    });

  });

});