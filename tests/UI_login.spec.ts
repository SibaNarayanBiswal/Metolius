import { test, expect } from '@playwright/test';
import { getExcelData } from '../utils/excelReader';
import {MenuLocators} from '../POM/element';


// 👉 Excel path
const filePath = "D:/Metolius_Automation/TestData/Login_DDT.xlsx";
 
// 👉 Sheet name must match Excel
const users = getExcelData(filePath, "login page");


 
// 🔥 Run test for each login row
users.forEach((user: any, index) => {
 
    test(`Login Test ${index + 1} - ${user.Username}`, async ({ page }) => {

      const menu = new MenuLocators(page);  
 
        await page.goto("https://survey.metoliusaa.com/");
        await expect(page).toHaveTitle(/Metolius/);
 
        // ================= LOGIN PAGE CHECK =================
        await page.waitForLoadState('domcontentloaded');
        await expect(page.locator(".authSec_logo img")).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Welcome Back!' })).toBeVisible();
 
        await expect(page.getByPlaceholder("Enter username")).toBeVisible();
        await expect(page.getByPlaceholder("Enter password")).toBeVisible();
        await expect(page.locator("#terms")).toBeVisible();
 
        // ================= FORGOT PASSWORD =================
        await page.getByText("Forgot Password").click();
 
        await page.getByPlaceholder("Enter Username").fill("abcdef");
        await page.locator("//button[normalize-space()='Reset Password']").click();
 
        page.on("dialog", async (dialog) => {
            console.log(dialog.message());
            expect(dialog.message()).toContain("Username does not exist.");
            await dialog.accept();
        });
 
        await page.goBack();
 
        // ================= TERMS POPUP =================
        await page.getByRole('link', { name: 'Terms of Use' }).click();
 
        await expect(page.getByRole('dialog')).toContainText(
            'Please read these Terms of Use'
        );
 
        await page.getByRole('button', { name: 'Close' }).click();
 
        // ================= LOGIN FROM EXCEL =================
        await page.getByPlaceholder('Enter username').fill(user.Username);
        await page.getByPlaceholder('Enter password').fill(user.Password);
 
        await page.locator("#terms").check();
        await page.locator("button[type='submit']").click();
 
        // ================= VALIDATION =================
        // await expect(menu.logoutMenu).toBeVisible();
 
        console.log(`✅ Login successful for: ${user.Username}`);
 
        // ================= MENU HANDLING =================
        if (await menu.logoutMenu.isVisible()) {
            console.log("Menu's are displaying");
        } else {
            await page.locator("//button[contains(@class,'menuBar')]").click();
        }
        //================= ROLE VALIDATION =================
      // const dashboard_menu=await page.getByRole('link', { name: 'Dashboard' })
      // const org_structure_menu=page.locator("//span[normalize-space()='Org Structure']")
      // const company_management_subMenu=await page.getByText('Company Management')
      // const department_management_subMenu=await page.getByText('Department Management')
      // const participant_management_subMenu=await page.getByText('Participant Management')
      // const surveys_menu=page.locator("//span[normalize-space()='Org Structure']")
      // const manage_survey=await page.getByText('Manage Surveys')
      // const crosswalk_subMenu=await page.getByText('View Crosswalks')
      // const resource_subMenu=await page.getByRole('link', { name: 'Resources' })
      // const distribution_Menu=await page.getByText('Distribution')
      // const assign_and_send_subMenu=await page.getByText('Assign & Send')
      // const schedule_log_subMenu=await page.getByRole('link', { name: /Schedule Log/i })
      // const progress_report_subMenu=await page.getByText('Participant Progress Report')
      // const email_queue_subMenu=await page.getByText('Email Queue')
      // const analytics_menu=await page.getByText('Analytics')
      // const question_analysis_subMenu=await page.getByText('Question Analysis')
      // const demographic_breakdown_subMenu=await page.getByText('Demographic Breakdown')
      // const reports_menu=await page.locator("//span[normalize-space()='Reports']")
      // const saved_report_subMenu=await page.locator("//a[@href='/my-reports']")
      // const participant_response_subMenu=await page.getByText('Participant Responses')
      // const intelligent_reports_menu=await page.locator(':text-is("Intelligent Reports")')
      // const manage_template_subMenu=await page.getByText('Manage Templates')
      // const manage_intelligent_report_menu=await page.getByText('Manage Intelligent Reports')
      // const manage_datasets_menu=await page.getByText('Manage Datasets')
      // const default_setting_menu=await page.getByText('Default Settings')
      // const knowledge_base_menu=await page.getByText('Knowledge Base')
      // const log_out_menu=await page.getByText('Log Out')

      

        if (user.Login_Type?.toLowerCase().trim()==='enterprise admin'){
          await expect(menu.dashboardMenu).toBeVisible()

          await expect(menu.orgStructureMenu).toBeVisible()

          await menu.orgStructureMenu.click()
          await expect(menu.companyManagement).toBeVisible()
          await expect(menu.departmentManagement).toBeVisible()
          await expect(menu.participantManagement).toBeVisible()

          await expect(menu.surveysMenu).toBeVisible()

          await menu.surveysMenu.click()
          await expect(menu.manageSurvey).toBeVisible()
          await expect(menu.crosswalk).toBeVisible()
          await expect(menu.resourceMenu).toBeVisible()

          await expect(menu.distributionMenu).toBeVisible()

          await menu.distributionMenu.click();
          await expect(menu.assignAndSend).toBeVisible();
          await expect(menu.scheduleLog).toBeVisible()
          await expect(menu.progressReport).toBeVisible()
          await expect(menu.emailQueue).toBeVisible()

          await expect(menu.analyticsMenu).toBeVisible()

          await menu.analyticsMenu.click();
          await expect(menu.questionAnalysis).toBeVisible();
          await expect(menu.demographicBreakdown).toBeVisible()

          await expect(menu.reportsMenu).toBeVisible()

          await menu.reportsMenu.click();
          await expect(menu.savedReports).toBeVisible();
          await expect(menu.participantResponses).toBeVisible()

          await expect(menu.reportsMenu).toBeVisible()

          await menu.intelligentReports.click();
          await expect(menu.manageTemplates).toBeVisible();
          await expect(menu.manageIntelligentReports).toBeVisible();
          await expect(menu.manageDatasets).toBeVisible();

          await expect(menu.defaultSettings).toBeVisible();
          await expect(menu.knowledgeBase).toBeVisible();
          await expect(menu.logoutMenu).toBeVisible();

        }

        else if (user.Login_Type?.toLowerCase().trim()==='company admin'){
          await expect(menu.dashboardMenu).toBeVisible()

          await expect(menu.orgStructureMenu).toBeVisible()

          await menu.orgStructureMenu.click()
          await expect(menu.companyManagement).not.toBeVisible()
          await expect(menu.departmentManagement).toBeVisible()
          await expect(menu.participantManagement).toBeVisible()

          await expect(menu.surveysMenu).toBeVisible()

          await menu.surveysMenu.click()
          await expect(menu.manageSurvey).toBeVisible()
          await expect(menu.crosswalk).toBeVisible()
          await expect(menu.resourceMenu).toBeVisible()

          await expect(menu.distributionMenu).toBeVisible()

          await menu.distributionMenu.click();
          await expect(menu.distributionMenu).toBeVisible();
          await expect(menu.scheduleLog).toBeVisible()
          await expect(menu.progressReport).toBeVisible()
          await expect(menu.emailQueue).toBeVisible()

          await expect(menu.analyticsMenu).toBeVisible()

          await menu.analyticsMenu.click();
          await expect(menu.questionAnalysis).toBeVisible();
          await expect(menu.demographicBreakdown).toBeVisible()

          await expect(menu.reportsMenu).toBeVisible()

          await menu.reportsMenu.click();
          await expect(menu.savedReports).toBeVisible();
          await expect(menu.participantResponses).toBeVisible()

          await expect(menu.reportsMenu).toBeVisible()

          await menu.intelligentReports.click();
          // await expect(menu.savedReport_IR).toBeVisible();
          await expect(menu.manageTemplates).not.toBeVisible();
          await expect(menu.manageIntelligentReports).not.toBeVisible();
          await expect(menu.manageDatasets).not.toBeVisible();

          await expect(menu.defaultSettings).toBeVisible();
          await expect(menu.knowledgeBase).toBeVisible();
          await expect(menu.logoutMenu).toBeVisible();
          
        }

        else if (user.Login_Type?.toLowerCase().trim()==='company support user'){
          await expect(menu.dashboardMenu).toBeVisible()

          await expect(menu.orgStructureMenu).not.toBeVisible()

          await expect(menu.surveysMenu).toBeVisible()

          await menu.surveysMenu.click()
          await expect(menu.manageSurvey).not.toBeVisible()
          await expect(menu.crosswalk).not.toBeVisible()
          await expect(menu.resourceMenu).toBeVisible()

          await expect(menu.distributionMenu).toBeVisible()

          await menu.distributionMenu.click();
          await expect(menu.assignAndSend).toBeVisible();
          await expect(menu.scheduleLog).toBeVisible()
          await expect(menu.progressReport).toBeVisible()
          await expect(menu.emailQueue).toBeVisible()

          await expect(menu.analyticsMenu).toBeVisible()

          await menu.analyticsMenu.click();
          await expect(menu.questionAnalysis).toBeVisible();
          await expect(menu.demographicBreakdown).toBeVisible()

          await expect(menu.reportsMenu).toBeVisible()

          await menu.reportsMenu.click();
          await expect(menu.savedReports).toBeVisible();
          await expect(menu.participantResponses).toBeVisible()

          await expect(menu.intelligentReports).not.toBeVisible()

          await expect(menu.defaultSettings).not.toBeVisible();
          await expect(menu.knowledgeBase).toBeVisible();
          await expect(menu.logoutMenu).toBeVisible();

          
        }

        else if (user.Login_Type?.toLowerCase().trim()==='company analyst'){
          await expect(menu.dashboardMenu).toBeVisible()

          await expect(menu.orgStructureMenu).not.toBeVisible()

          await expect(menu.surveysMenu).toBeVisible()

          await menu.surveysMenu.click()
          await expect(menu.manageSurvey).not.toBeVisible()
          await expect(menu.crosswalk).not.toBeVisible()
          await expect(menu.resourceMenu).toBeVisible()

          await expect(menu.distributionMenu).toBeVisible()

          await menu.distributionMenu.click();
          await expect(menu.assignAndSend).not.toBeVisible();
          await expect(menu.scheduleLog).not.toBeVisible()
          await expect(menu.progressReport).toBeVisible()
          await expect(menu.emailQueue).not.toBeVisible()

          await expect(menu.analyticsMenu).toBeVisible()

          await menu.analyticsMenu.click();
          await expect(menu.questionAnalysis).toBeVisible();
          await expect(menu.demographicBreakdown).toBeVisible()

          await expect(menu.reportsMenu).toBeVisible()

          await menu.reportsMenu.click();
          await expect(menu.savedReports).toBeVisible();
          await expect(menu.participantResponses).toBeVisible()

          await expect(menu.reportsMenu).toBeVisible()

          await menu.intelligentReports.click();
          await expect(menu.manageTemplates).toBeVisible();
          await expect(menu.manageIntelligentReports).toBeVisible();
          await expect(menu.manageDatasets).toBeVisible();

          await expect(menu.defaultSettings).not.toBeVisible();
          await expect(menu.knowledgeBase).toBeVisible();
          await expect(menu.logoutMenu).toBeVisible();


          
        }

        else if ((user.Login_Type||'').toLowerCase()==='client user access'){
          await expect(menu.dashboardMenu).toBeVisible()

          await expect(menu.orgStructureMenu).not.toBeVisible()

          await expect(menu.surveysMenu).not.toBeVisible()

          await expect(menu.distributionMenu).not.toBeVisible()

          await expect(menu.analyticsMenu).toBeVisible()

          await menu.analyticsMenu.click();
          await expect(menu.questionAnalysis).toBeVisible();
          await expect(menu.demographicBreakdown).toBeVisible()

          await expect(menu.reportsMenu).toBeVisible()

          await menu.reportsMenu.click();
          await expect(menu.savedReports).toBeVisible();
          await expect(menu.participantResponses).not.toBeVisible()

          await expect(menu.reportsMenu).toBeVisible()

          await menu.intelligentReports.click();
          await expect(menu.manageTemplates).not.toBeVisible();
          await expect(menu.manageIntelligentReports).not.toBeVisible();
          await expect(menu.manageDatasets).not.toBeVisible();
          // await expect(menu.savedReport_IR).toBeVisible()

          await expect(menu.defaultSettings).not.toBeVisible();
          await expect(menu.knowledgeBase).toBeVisible();
          await expect(menu.logoutMenu).toBeVisible();
          
        }

        else {
          console.log('User is not valid')
          
        }
 
        // ================= LOGOUT =================
        await menu.logoutMenu.click();
    });
 
});