// npx playwright test API_Dept_management.spec.ts  --project=chromium --reporter=allure-playwright
// allure generate ./allure-results -o ./allure-report --clean
// allure open ./allure-report 
import {test,expect} from '@playwright/test'

test.describe.configure({ mode: "serial" });



let webToken: string = '';
let departMentID: number = 0;
let company_ID=322;
let Department_Name='';

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

})
test('Create departMent',async({request})=>{
    const create_department_response=await request.post('https://surveystgapi.ibridgellc.com/v1/department',{headers:{
        Authorization:`Bearer ${webToken}`},
        data:{
    "companyID" : 100386,
    "departmentName" : `Department Creation ${Date.now()}`,
    "isAnonymous": false
}

    })
    expect(create_department_response.status()).toBe(201)
    expect(create_department_response.statusText()).toBe('Created')
    const create_Dept_data=await create_department_response.json();
    Department_Name=await create_Dept_data.departmentName
    departMentID=await create_Dept_data.departmentID
    console.log(`Created Department name:${Department_Name}`)
    console.log(`Created Department ID:${departMentID}`)
})

test('Update departMent',async({request})=>{
    const update_department_response=await request.put('https://surveystgapi.ibridgellc.com/v1/department',{headers:{
        Authorization:`Bearer ${webToken}`},
        data:{
    "departmentID": departMentID,
    "departmentName": `Department updation ${Date.now()}`,
    "isAnonymous": false
}

    })
    expect(update_department_response.status()).toBe(200);
    expect(update_department_response.ok()).toBeTruthy();
    const update_Dept_data=await update_department_response.json();
    Department_Name=await update_Dept_data.departmentName
    console.log(`Updated Department name:${Department_Name}`)
    expect(update_Dept_data).toMatchObject({
    departmentID: expect.any(Number),
    departmentName: expect.any(String),
    companyID: expect.any(Number),
    isAnonymous: expect.any(Boolean),
});

})
test('Fetch Department', async ({ request }) => {

  const response = await request.get(
    `https://surveystgapi.ibridgellc.com/v1/department?departmentID=${departMentID}`,
    {
      headers: {
        Authorization: `Bearer ${webToken}`
      }
    }
  );

  expect(response.status()).toBe(200);
  expect(response.ok()).toBeTruthy();

  const body = await response.json();

  console.log(body.message);

//   expect(body).toMatchObject({
//     companyID: expect.any(Number),
//     departmentID: expect.any(Number),
//     departmentName: expect.any(String),
//     departmentDescription: expect.any(null),
//     isAnonymous: expect.any(Boolean),
//     webToken: expect.any(String),
//     message: expect.any(String),
//     status: expect.any(String)
//   });

});

test('Delete DepartMent',async({request})=>{
    const delete_department_response=await request.delete('https://surveystgapi.ibridgellc.com/v1/department',{headers:{
        Authorization:`Bearer ${webToken}`},
        data:{   
            departmentID: departMentID,
        }

    })
    expect(delete_department_response.status()).toBe(204);
    expect(delete_department_response.statusText()).toBe('No Content');

})

test('Fetch Department from Company', async ({ request }) => {

  const response = await request.get(
    `https://surveystgapi.ibridgellc.com/v1/department?companyID=${company_ID}`,
    {
      headers: {
        Authorization: `Bearer ${webToken}`
      }
    }
  );

  expect(response.status()).toBe(200);
  expect(response.ok()).toBeTruthy();

  const body = await response.json();

  console.log(body.message);

//   expect(body).toMatchObject({
//     companyID: expect.any(Number),
//     departmentID: expect.any(Number),
//     departmentName: expect.any(String),
//     departmentDescription: expect.any(null),
//     isAnonymous: expect.any(Boolean),
//     webToken: expect.any(String),
//     message: expect.any(String),
//     status: expect.any(String)
//   });

});

