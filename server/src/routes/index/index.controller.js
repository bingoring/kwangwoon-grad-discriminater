'use strict'
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

exports.demo = async (req, res) => {
    console.log("here");

    function getGradeData(html) {
        // cheerio 라이브러리를 사용하여 html을 DOM 으로 파싱합니다.
        const $ = cheerio.load(html);

        var rate_text;
        try{
            $('#hakbu > table:nth-child(3) > tbody > tr:nth-child(12) > td').each(function(index,elem){
              rate_text = $(this).text(); //해당 태그의 text부분만 잘라오기
              console.log(rate_text);
            });
            //console.log('Size=' +size);
            //console.log('Average Correct Percentage=' +(sum/size).toFixed(3)+'%');
        }
        catch(error){
            console.error(error);
        }
         // end for

        return rate_text;
    } // end extractNewsDate()

    // 브라우저 옵션 설정
    const browserOption = {
        slowMo: 500, // 디버깅용으로 퍼핏티어 작업을 지정된 시간(ms)만큼 늦춥니다.
        headless: false // 디버깅용으로 false 지정하면 브라우저가 자동으로 열린다.
    };
    const browser = await puppeteer.launch(browserOption);
    const page = await browser.newPage();
    const hisnet_id = '';   //학번
    const hisnet_pw = '';   //pw
    // 탭 옵션
    const pageOption = {
        // waitUntil: 적어도 500ms 동안 두 개 이상의 네트워크 연결이 없으면 탐색이 완료된 것으로 간주합니다.
        waitUntil: 'networkidle2',
        // timeout: 20초 안에 새 탭의 주소로 이동하지 않으면 에러 발생
        timeout: 20000
    };
    try {
        // 리다이렉트 되는 페이지의 주소를 사용.
        const url =
            'https://klas.kw.ac.kr/usr/cmn/login/LoginForm.do'; 

        // 1. 클라스 페이지 접속
        await page.goto(url,pageOption);
    } catch (error) {
        await page.close();
        await browser.close();

        console.error(error);
        return;
    }

    console.log("goto page");

    try {
        // 2. 아이디와 패스워드 입력
        await page.evaluate((id, pw) => {
            document.querySelector("#loginId").value = id;
            document.querySelector("#loginPwd").value = pw;
        }, hisnet_id, hisnet_pw);

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
    let response;
    try {
        // 리다이렉트 되는 페이지의 주소를 사용.
        const url =
            'https://klas.kw.ac.kr/std/cps/inqire/AtnlcScreStdPage.do';

        // 4. 클라스 성적조회 페이지 접근.
        await page.goto(url, pageOption);

        // 5. 이수 성적 가져오기
        const totalGrade = await page.evaluate(() => document.querySelector('#hakbu > table:nth-child(3) > tbody > tr:nth-child(12) > td').textContent);
        
        // 6. 수강한 과목 가져오기
        //#hakbu > table:nth-child(1)
        //#hakbu > table:nth-child(13)  3학년2학기
        //#hakbu > table:nth-child(14)  4학년1학기
        //          ...
        //#hakbu > table:nth-child(21)
        //const semesterGrade = await (await (await page.$('#hakbu > table:nth-child(13)')).getProperty('textContent')).jsonValue();
        const semesterGrade = await page.evaluate(() => document.querySelector('#hakbu > table:nth-child(14)').textContent);
        //student_id = await page.evaluate(element1 => element1.value, element1);
        console.log(totalGrade);
        console.log(semesterGrade);
    } catch (error) {
        console.error(error);
        return;
    } finally {
        // catch 구문에 return 이 존재해도 finally 구문은 실행 합니다.

        // 7. 페이지 닫기
        await page.close();
        // 8. 브라우저 닫기
        await browser.close();
    }
};