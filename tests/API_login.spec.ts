import {test,expect,request} from '@playwright/test'
import { timestamp } from '../utils/commonUtils';

test.describe.configure({ mode: "serial" });


let webToken: string = '';
let companyID: number = 0;
// let companyName='';

test.beforeAll("authRequest",async({request})=>{
    const result = await request.post('https://surveystgapi.ibridgellc.com/v1/auth', {
        data: {
            tUsername: "MC iBridge",
            tPassword: "iBridgeMC@123#",
            metaData: {
                ipAddress: "49.207.147.238",
                osName: "Windows",
                osVersion: "10.0",
                browserName: "Microsoft Edge",
                browserVersion: "140.0.0.0",
                deviceName: "Win32",
                deviceType: "Laptop"
            }
}})
expect (result.status()).toBe(200);
expect(result.statusText()).toEqual('OK');

const authPageResponse=await result.json();
expect(authPageResponse).toHaveProperty('webToken')
webToken=await authPageResponse.webToken
console.log(`WebToken:${webToken}`)
// expect (authPageResponse)
const structuredMenus = authPageResponse.menu.map(menu => ({
    menu: menu.menuDisplayName,
    subMenus: menu.subMenu.map(sub => sub.menuDisplayName)
}));

console.log(structuredMenus);
})


test("Company Management-Add company Test",async({request})=>{
            const create_company=await request.post('https://surveystgapi.ibridgellc.com/v1/company', {headers:{Authorization: `Bearer ${webToken}`},
                data:{
        "companyName": `Automated by API ${timestamp}`,
        "companyDescription": "New company Description'",
        "timezoneID": 1,
        "companyMasterID":1
        }})
        const create_comany_response=await create_company.json();
        expect(await create_company.status()).toBe(201);
        expect(await create_company.statusText()).toEqual('Created')

        companyID=await create_comany_response.companyID
        console.log('The Fetched company id is '+companyID)
})


test("Company Management-Fetch company Test",async({request})=>{
    const companyByID=await request.get('https://surveystgapi.ibridgellc.com/v1/company', {headers:{Authorization: `Bearer ${webToken}`},params:{companyID: companyID}})
    const companyByID_response=await companyByID.json();
    expect(await companyByID.status()).toBe(200);
    expect(companyByID.statusText()).toEqual('OK');
    expect(await companyByID_response.companyID).toBe(companyID);
})

test('Company get all dropdowns',async({request})=>{
    const company_dropdown_list=await request.get('https://surveystgapi.ibridgellc.com/v1/company',{headers:{Authorization: `Bearer ${webToken}`},params:{companyMasterID: 1}});
    const company_dropdown_list_response=await company_dropdown_list.json();
    expect(company_dropdown_list.status()).toBe(200);
    expect(company_dropdown_list.statusText()).toBe('OK');
    let companies: string[] = [];
    for (let key in company_dropdown_list_response.data) {
    const company = company_dropdown_list_response.data[key];
    companies.push(company.companyName);

  }
    console.log("Companies in dropdown:", companies);
    console.log("Total number of companies:", companies.length);
})

test('Company listing datatable',async({request})=>{
    const company_listing_Response=await request.get('https://surveystgapi.ibridgellc.com/v1/company',{headers:{Authorization: `Bearer ${webToken}`},data:{
    "companyMasterID": 1,
    "draw": 1,  // Required for DataTables to track request order
    "start": 0, // Starting point in data set (paging)
    "length": 10, // Number of records to retrieve
    "search": { "value": "'", "regex": false }, // Search parameters
    "order": [{ "column": 0, "dir": "desc" }], // Ordering columns
    "isExport": false
}});
expect(company_listing_Response.status()).toBe(200);
expect(company_listing_Response.statusText()).toBe('OK');
const company_listing_data=await company_listing_Response.json();

let companyList: { name: string; description: string }[] = [];

for (let key in company_listing_data.data) {
  const company = company_listing_data.data[key];

  companyList.push({
    name: company.companyName,
    description: company.companyDescription
  });
}
console.log(companyList)
console.log(companyList)
// expect(Number(company_listing_data.recordsTotal)).toBe(companyList.length)
})

test('update company', async ({ request }) => {

  const updatedName = `updated Automated company ${timestamp}`;
  const updatedDescription = `updated Automated company description ${timestamp}`;

  const response = await request.put(
    "https://surveystgapi.ibridgellc.com/v1/company",
    {
      headers: {
        Authorization: `Bearer ${webToken}`
      },
      data: {
        companyID: companyID,
        companyName: updatedName,
        companyDescription: updatedDescription,
        timezoneID: 2
      }
    }
  );

  const body = await response.json();

  expect(response.status()).toBe(200);
  expect(body.companyID).toBe(companyID);
  expect(body.companyName).toBe(updatedName);
  expect(body.companyDescription).toBe(updatedDescription);
});

test('Delete company', async ({ request }) => {
  const deleteResponse = await request.delete(
    `https://surveystgapi.ibridgellc.com/v1/company`,
    {
      headers: {
        Authorization: `Bearer ${webToken}`
      },
      data:{
        companyID:companyID
      }
  }
);
 expect (deleteResponse.statusText()).toBe('No Content')
 expect (deleteResponse.status()).toBe(204)
})