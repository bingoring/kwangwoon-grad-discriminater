'use strict'
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

exports.test = async (req, res) => {
    console.log("here");

    //        slowMo: 500, // 디버깅용으로 퍼핏티어 작업을 지정된 시간(ms)만큼 늦춥니다.
    // 브라우저 옵션 설정
    const browserOption = {
        slowMo: 300,
        headless: true, // 디버깅용으로 false 지정하면 브라우저가 자동으로 열린다.
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    };
    const browser = await puppeteer.launch(browserOption);
    const page = await browser.newPage();
    const klas_id = '2016726095';   //학번
    const klas_pw = 'ritch8288!';   //pw
    // 탭 옵션
    const pageOption = {
        // waitUntil: 적어도 500ms 동안 두 개 이상의 네트워크 연결이 없으면 탐색이 완료된 것으로 간주합니다.
        waitUntil: 'networkidle2',
        // timeout: 20초 안에 새 탭의 주소로 이동하지 않으면 에러 발생
        timeout: 20000,
    };
    try {
        // 리다이렉트 되는 페이지의 주소를 사용.
        const url =
            'https://klas.kw.ac.kr/usr/cmn/login/LoginForm.do'; 

        // 1. 클라스 페이지 접속
        await page.goto(url);
        
    } catch (error) {
        await page.close();
        await browser.close();

        console.error(error);
        return;
    }

    console.log("goto page");

    try {
        const buttonSelector = 'body > div.container > div > div > div.panel-body-inner > form > div.adminLogin-box > button';
        await page.waitForSelector(buttonSelector, { timeout: 1000 });
        // 2. 아이디와 패스워드 입력
        await page.evaluate((id, pw) => {
            document.querySelector("#loginId").value = id;
            document.querySelector("#loginPwd").value = pw;
        }, klas_id, klas_pw);
        
        // 3. 로그인 버튼 클릭
        await page.click('body > div.container > div > div > div.panel-body-inner > form > div.adminLogin-box > button');
        /*
        // 클라스 아이디 입력 부분 클릭
        await page.click("input#loginId");
        // 클라스 아이디를 키보드로 입력한다.
        await page.keyboard.type(hisnet_id);
        // TAB 버튼을 클릭하여 바로 옆에있는 패스워드 입력 영역으로 커서를 이동시킨다.

        await page.keyboard.press("Tab");

        // 클라스 패스워드를 키보드로 입력한다.
        // 이때 자연스러운 입력을 버튼을 하나씩 입력할때마다  DELAY를 통한 시간차가 있게끔 설정한다.

        await page.keyboard.type(hisnet_pw, { delay: 100 });	// 시간은 밀리세컨드(ms) 단위로 계산된다.

        // TAB 버튼을 클릭하여 좌측에 존재하는 로그인 버튼이 선택되게 한다.
        await page.keyboard.press("Tab");

        // ENTER 키를 클릭하여 로그인한다.
        await page.keyboard.press("Enter");
        */
    } catch (e) {
        await page.close();
        await browser.close();

        console.error(e);
        return;
    }
    console.log("login success");

    

    try {
        // 리다이렉트 되는 페이지의 주소를 사용.
        
        const url ='https://klas.kw.ac.kr/std/cps/inqire/AtnlcScreStdPage.do';
        let data = {
            'hakbu': "",
            'totalGrade': "",
        };

        // 4. 클라스 성적조회 페이지 접근.
        await page.goto(url, pageOption);
        const content = await page.content();

        

        // $에 cheerio를 로드한다.
        const $ = cheerio.load(content);
        // 복사한 리스트의 Selector로 리스트를 모두 가져온다.
        //#table:nth-child(14)
        const table = $("#hakbu");

        //학부

        //총 이수 학점
        
        let grades = [];
        //#poduct_list_area > li:nth-child(2)
        const gradeTable = $("#hakbu > table > tbody > tr");
        gradeTable.each((index, list) => {

            //#poduct_list_area > li:nth-child(2) > a > div > div.name > strong
            //#hakbu > table:nth-child(17) > tbody > tr:nth-child(1) > td:nth-child(2)
            //과목명최근 #hakbu > table:nth-child(17) > tbody > tr:nth-child(1) > td:nth-child(2)
            //성적 #hakbu > table:nth-child(17) > tbody > tr:nth-child(1) > td:nth-child(6)
            //과목명옛날 #hakbu > table:nth-child(25) > tbody > tr:nth-child(8) > td:nth-child(2)
            //성적옛날 #hakbu > table:nth-child(25) > tbody > tr:nth-child(8) > td:nth-child(6)
            //grades.push($(list).find("table:nth-child(17) > tbody > tr:nth-child(1) > td:nth-child(2)").text());
            /*
            const gradeTable_1 = $("tbody > tr");
            gradeTable_1.each((index, list) => {
                let gradeSingle = $(list).find("td").text();

                console.log({
                    index, gradeSingle
                })
            })*/
            let name = $(list).find("td:nth-child(2)").text();
            let grade = $(list).find("td:nth-child(6)").text();

            console.log({
                index, name, grade
            })
        })
        
        // 5. 이수 성적 가져오기
        //await page.waitForSelector('#hakbu > table:nth-child(3) > tbody > tr:nth-child(12) > td',{timeout:3000}).catch(() => console.log('Class N3ewq doesn\'t exist!'));

        // data.totalGrade = await page.evaluate(() => {
        //     if(document.querySelector('#hakbu > table:nth-child(3) > tbody > tr:nth-child(12) > td').length > 0)
        //         document.querySelector('#hakbu > table:nth-child(3) > tbody > tr:nth-child(12) > td').textContent
        // });
        //await page.waitForNavigation({ waitUntil: 'networkidle2' });
        //await page.waitForSelector('#hakbu > table:nth-child(3) > tbody > tr:nth-child(12) > td',{timeout:3000}).catch(() => console.log('doesn\'t exist!'));
        
        //data.totalGrade = await page.$eval(document.querySelector('#hakbu > table:nth-child(3) > tbody > tr:nth-child(12) > td').textContent);
        // 6. 수강한 과목 가져오기
        //#hakbu > table:nth-child(1)
        //#hakbu > table:nth-child(13)  3학년2학기
        //#hakbu > table:nth-child(14)  4학년1학기
        //          ...
        //#hakbu > table:nth-child(21)
        //const semesterGrade = await (await (await page.$('#hakbu > table:nth-child(13)')).getProperty('textContent')).jsonValue();
        //3학년 2학기 성적 조회
        
        // data.semesterGrade = await page.evaluate(() => {
        //     if(document.querySelector('#hakbu > table:nth-child(14)').length > 0)
        //         document.querySelector('#hakbu > table:nth-child(14)').textContent;
        // });
        //data.totalGrade = await page.$eval(document.querySelector('#hakbu > table:nth-child(14)').textContent);

        //student_id = await page.evaluate(element1 => element1.value, element1);
    }catch (error) {
        console.error(error);
        console.error("error");
        return;
    } finally {
        // catch 구문에 return 이 존재해도 finally 구문은 실행 합니다.

        // 7. 페이지 닫기
        await page.close();
        // 8. 브라우저 닫기
        await browser.close();
    }
};

async function slowAlert(){
    try {
        // 리다이렉트 되는 페이지의 주소를 사용.
        

        // 4. 클라스 성적조회 페이지 접근.
        await page.goto(url, pageOption);

        // 5. 이수 성적 가져오기
        let data = {};
        //await page.waitForSelector('#hakbu > table:nth-child(3) > tbody > tr:nth-child(12) > td',{timeout:3000}).catch(() => console.log('Class N3ewq doesn\'t exist!'));

        // data.totalGrade = await page.evaluate(() => {
        //     if(document.querySelector('#hakbu > table:nth-child(3) > tbody > tr:nth-child(12) > td').length > 0)
        //         document.querySelector('#hakbu > table:nth-child(3) > tbody > tr:nth-child(12) > td').textContent
        // });
        await page.waitForNavigation({ waitUntil: 'networkidle2' });
        
        //await page.waitForSelector('#hakbu > table:nth-child(3) > tbody > tr:nth-child(12) > td',{timeout:3000}).catch(() => console.log('doesn\'t exist!'));
        data.totalGrade = await page.$eval(document.querySelector('#hakbu > table:nth-child(3) > tbody > tr:nth-child(12) > td').textContent);
        // 6. 수강한 과목 가져오기
        //#hakbu > table:nth-child(1)
        //#hakbu > table:nth-child(13)  3학년2학기
        //#hakbu > table:nth-child(14)  4학년1학기
        //          ...
        //#hakbu > table:nth-child(21)
        //const semesterGrade = await (await (await page.$('#hakbu > table:nth-child(13)')).getProperty('textContent')).jsonValue();
        //3학년 2학기 성적 조회
        
        // data.semesterGrade = await page.evaluate(() => {
        //     if(document.querySelector('#hakbu > table:nth-child(14)').length > 0)
        //         document.querySelector('#hakbu > table:nth-child(14)').textContent;
        // });
        data.totalGrade = await page.$eval(document.querySelector('#hakbu > table:nth-child(14)').textContent);

        //student_id = await page.evaluate(element1 => element1.value, element1);
        console.log(data.totalGrade);
        console.log(data.semesterGrade);

        res.send({
            totalGrade: data.totalGrade,
            semesterGrade: data.semesterGrade
        });
    }catch (error) {
        console.error(error);
        console.error("here");
        return;
    } finally {
        // catch 구문에 return 이 존재해도 finally 구문은 실행 합니다.

        // 7. 페이지 닫기
        await page.close();
        // 8. 브라우저 닫기
        await browser.close();
    }
}

//이건 뭐야?아
//알람 없애는거?
function clearAlert() {
    window.clearTimeout(timeoutID);
  }
function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
};