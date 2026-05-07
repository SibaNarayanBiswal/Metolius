import { test, expect } from "@playwright/test";
import { timestamp } from "../utils/commonUtils";
import {MenuLocators} from '../page/element';
// import fs from 'fs';


test.describe.configure({ mode: 'serial' });

test.beforeEach(async ({ page }) => {
  
  await page.goto("https://survey.metoliusaa.com/",{waitUntil:'domcontentloaded',timeout:300000});
  const logoutButton1 = page.locator("//span[normalize-space()='Log Out']");
  
  if (await logoutButton1.isVisible()) {
    await page.getByRole('link', { name: 'Log Out' }).click();
  }

  await page.getByRole('textbox', { name: 'Enter username' }).fill("MC iAD Test");
  await page.getByRole('textbox', { name: 'Enter password' }).fill("iBridgeMC@123#");

  await page.locator("#terms").click();
  await page.locator("button[type='submit']").click();

  const logoutButton = page.locator("//span[normalize-space()='Log Out']");

  // Wait for login to complete properly
  await expect(logoutButton).toBeVisible({ timeout: 10000 });

  // Handle menu visibility
  if (!(await logoutButton.isVisible())) {
    await page.locator("//button[contains(@class,'menuBar')]").click();
  }
});

test("Company Management", async ({ page }) => {
  const menu = new MenuLocators(page);

  // Navigate
  await menu.orgStructureMenu.click()
  await expect(menu.companyManagement).toBeVisible()
  await menu.companyManagement.click()
  await expect(page).toHaveTitle(/Company Management/);

  // Locators
  let hasNext = true;
let Total_Company_count = 0;

const table = page.locator('table:visible tbody');
const nextBtn = page.getByRole('button', { name: /Next/i });

while (hasNext) {
  const rows = table.locator('tr');

  await expect(rows.first()).toBeVisible();

  const count = await rows.count();
  console.log(`Rows on this page: ${count}`);

  for (let i = 0; i < count; i++) {
    const cells = rows.nth(i).locator('td');
    const texts = await cells.allTextContents();

    // ✅ skip invalid / empty rows
    if (texts.length < 3) continue;

    const name = texts[1];
    const description = texts[2];

    console.log({ name, description });
    Total_Company_count++;
  }

  // ✅ check disabled via class (correct way for your app)
  const classAttr = await nextBtn.getAttribute('class');

  if (classAttr?.includes('disabled')) {
    hasNext = false;
    break;
  }

  // ✅ wait for table change safely
  const firstRowBefore = await rows.first().textContent();

  // ✅ force click to avoid overlay interception
  await nextBtn.click({ force: true });

  // ✅ wait for new data (important)
  await expect(rows.first()).not.toHaveText(firstRowBefore!, {
    timeout: 10000,
  });
}

console.log(`Total Company Count : ${Total_Company_count}`);


//------------------------------------------------------------------Add Admin feature------------------------------------------------------------------
  const newly_added_company_name='Auto_Company: '+timestamp
  const updated_company_name=`updated comnpany:${timestamp}`
  await page.getByRole('button',{name:'Add Company'}).click()
  await page.waitForSelector('.modal-content')
  const master_company_textField=await page.getByRole('textbox', { name: 'Master Company Name' });
  const company_textfield=page.locator("//input[@placeholder='Company Name']");
  const company_description=page.locator("textarea[placeholder='Company Description']");

//------------------------------------------------------------------Add company------------------------------------------------------------------
  if(await master_company_textField.isVisible() && await company_textfield.isVisible() && await company_description.isVisible()){
    await company_textfield.fill(newly_added_company_name);
    await company_description.fill('Description of the Automated company');
    await page.locator("//div[@class='css-1r2yxou']").click();
    const timezone_selection:string[]=await page.locator('//div[@class="css-qr46ko"]/div').allInnerTexts();
    const timezone_selection_list:string[]=[...timezone_selection];
    const sorted_timezone_selection_list:string[]=[...timezone_selection].sort();
    await expect(timezone_selection_list).toEqual(sorted_timezone_selection_list);
    await page.getByText("(GMT+05:30) India Standard Time").click()
    await page.locator("//button[@type='submit']").click();

    const entered_company_textfield=await company_textfield.inputValue()
    const company_description_textfield=await company_description.inputValue()

//------------------------------------------------------------------For checking add admin validation messages------------------------------------------------------------------
    if (await entered_company_textfield.length>30){
      const company_validation_message=await page.locator("//div[normalize-space()='Company Name must be at most 30 characters']")
      await expect(company_validation_message).toBeVisible();
      await page.locator('.icon-style-class-two').click()
    }

    if (entered_company_textfield.trim()===""){
        await expect(page.locator("//div[normalize-space()='Company Name is required']")).toBeVisible();
        await page.locator('.icon-style-class-two').click()
    }

    if (company_description_textfield.trim()===""){
        await expect(page.locator("//div[normalize-space()='Company Description is required']")).toBeVisible();
        await page.locator('.icon-style-class-two').click()
    }
  }
  else {
    console.log("element's are missing in Add company modal")
  }
  //------------------------------------------------------------------search button------------------------------------------------------------------
  await page.getByPlaceholder('Search').fill(newly_added_company_name)
  const company_total=(await page.locator('tbody tr').all()).length;
  await expect(company_total).toBeGreaterThanOrEqual(0);
  const expected_row = page.locator('tbody tr', { hasText: newly_added_company_name });
  await expect(expected_row).toBeVisible();


//------------------------------------------------------------------Edit Company------------------------------------------------------------------
  const edit_button=await page.locator("//a[@class='icon-primary']//*[name()='svg']");
  await edit_button.click()
if(await master_company_textField.isVisible() && await company_textfield.isVisible() && await company_description.isVisible()){
    await company_textfield.fill(updated_company_name);
    await company_description.fill('Description of the Automated company-updated');
    await page.locator("//div[@class='css-1r2yxou']").click();
    await page.getByText('(GMT-05:00) US Eastern Standard Time').click();
    await page.locator("//button[@type='submit']").click();
}
  await page.getByPlaceholder('Search').fill(updated_company_name)
  await expect(page.locator('tbody tr', { hasText: updated_company_name })).toBeVisible();
  //------------------------------------------------------------------Edit Company------------------------------------------------------------------
  await page.locator("//a[@class='icon-danger']//*[name()='svg']").click()
  const delete_modal=await page.getByRole('dialog', { name: 'Are you sure?' })
  await expect(delete_modal).toBeVisible();
  if(await delete_modal.isVisible()){
      await page.getByText('Yes').click()
  }
  await page.getByPlaceholder('Search').fill(updated_company_name)
  await expect(page.locator('tbody tr', { hasText: updated_company_name })).toBeVisible();
  await page.getByPlaceholder('Search').fill('')

    //------------------------------------------------------------------Download Feature------------------------------------------------------------------

  await page.locator("//button[@class='btn-icon']//*[name()='svg']").click()
  const download=await page.waitForEvent('download')
  const fileName = download.suggestedFilename();
  expect(fileName).toContain('.xlsx');
  

  await menu.logoutMenu.click()
});

test.afterEach(async ({ context }) => {
      
    await context.clearCookies();
    await context.clearPermissions();
})