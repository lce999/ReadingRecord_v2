
# 구글 스프레드시트 설정 및 앱스 크립트 배포 안내

이 애플리케이션은 구글 스프레드시트를 데이터베이스로 사용합니다. 에러 방지를 위해 아래 코드를 사용하세요.

## 1. 스프레드시트 준비
1. 새 구글 스프레드시트를 생성합니다.
2. 첫 번째 시트의 이름을 `Dashboard`로 변경합니다.
3. `Dashboard` 시트의 첫 번째 행에 다음 헤더를 입력합니다:
   - A1: `번호`, B1: `이름`, C1: `비밀번호`, D1: `누적페이지`

## 2. 구글 앱스 크립트(Google Apps Script) 설정 (에러 수정됨)
1. 스프레드시트 상단 메뉴에서 **확장 프로그램** > **Apps Script**를 클릭합니다.
2. `Code.gs` 파일에 아래 코드를 복사하여 붙여넣습니다. `e` 객체 체크 로직이 추가되었습니다.

```javascript
const SS = SpreadsheetApp.getActiveSpreadsheet();
const DASHBOARD_SHEET = SS.getSheetByName("Dashboard");

function doGet(e) {
  // e 또는 e.parameter가 없는 경우 처리 (에러 방지)
  if (!e || !e.parameter) {
    return createResponse({ success: false, message: "잘못된 요청입니다. 매개변수가 없습니다." });
  }

  const action = e.parameter.action;
  
  if (action === 'getDashboard') {
    const data = DASHBOARD_SHEET.getDataRange().getValues();
    const headers = data.shift();
    const students = data.map(row => ({
      number: row[0],
      name: row[1],
      totalPageCount: row[3]
    }));
    return createResponse({ success: true, data: students });
  }
  
  return createResponse({ success: false, message: "알 수 없는 action입니다." });
}

function doPost(e) {
  // e 또는 e.postData가 없는 경우 처리
  if (!e || !e.postData || !e.postData.contents) {
    return createResponse({ success: false, message: "잘못된 POST 요청입니다." });
  }

  const params = JSON.parse(e.postData.contents);
  const action = params.action;

  if (action === 'login') {
    return handleLogin(params);
  } else if (action === 'addEntry') {
    return handleAddEntry(params);
  }
  
  return createResponse({ success: false, message: "알 수 없는 action입니다." });
}

function handleLogin(params) {
  const { number, name, password } = params;
  const sheetName = name + "(" + number + ")";
  let sheet = SS.getSheetByName(sheetName);
  
  let studentRowIdx = -1;
  const dashboardData = DASHBOARD_SHEET.getDataRange().getValues();
  for (let i = 1; i < dashboardData.length; i++) {
    if (dashboardData[i][0].toString() === number.toString() && dashboardData[i][1] === name) {
      studentRowIdx = i + 1;
      if (dashboardData[i][2].toString() !== password.toString()) {
        return createResponse({ success: false, message: "비밀번호가 일치하지 않습니다." });
      }
      break;
    }
  }

  if (studentRowIdx === -1) {
    if (password !== "0000") {
      return createResponse({ success: false, message: "신규 등록은 초기 비밀번호 '0000'을 입력해야 합니다." });
    }
    DASHBOARD_SHEET.appendRow([number, name, "0000", 0]);
    sheet = SS.insertSheet(sheetName);
    sheet.appendRow(["No", "읽은날자", "책 제목", "출판사", "소감", "페이지수", "누적페이지수"]);
  }

  const historyData = sheet.getDataRange().getValues();
  historyData.shift(); 
  const history = historyData.reverse().map(row => ({
    no: row[0],
    date: row[1] instanceof Date ? Utilities.formatDate(row[1], "GMT+9", "yyyy-MM-dd") : row[1],
    title: row[2],
    publisher: row[3],
    impression: row[4],
    pages: row[5],
    cumulativePages: row[6]
  }));

  return createResponse({
    success: true,
    data: {
      student: { number, name },
      history: history
    }
  });
}

function handleAddEntry(params) {
  const { student, entry } = params;
  const sheetName = student.name + "(" + student.number + ")";
  const sheet = SS.getSheetByName(sheetName);
  
  const lastRow = sheet.getLastRow();
  const no = lastRow === 1 ? 1 : sheet.getRange(lastRow, 1).getValue() + 1;
  const prevCumulative = lastRow === 1 ? 0 : sheet.getRange(lastRow, 7).getValue();
  const newCumulative = Number(prevCumulative) + Number(entry.pages);

  const newRow = [
    no,
    entry.date,
    entry.title,
    entry.publisher,
    entry.impression,
    entry.pages,
    newCumulative
  ];
  
  sheet.appendRow(newRow);
  
  const dashboardData = DASHBOARD_SHEET.getDataRange().getValues();
  for (let i = 1; i < dashboardData.length; i++) {
    if (dashboardData[i][0].toString() === student.number.toString()) {
      DASHBOARD_SHEET.getRange(i + 1, 4).setValue(newCumulative);
      break;
    }
  }

  return createResponse({
    success: true,
    data: {
      no,
      ...entry,
      cumulativePages: newCumulative
    }
  });
}

function createResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 3. 웹 앱 배포 (중요)
1. **배포** > **새 배포**
2. 유형: **웹 앱**
3. 설정:
   - 설명: 도서관리 API
   - 다음 사용자로 실행: **나**
   - 액세스할 수 있는 사용자: **모든 사용자(Anyone)**
4. 배포 후 URL을 복사하여 `googleSheetService.ts`의 `API_URL`에 넣으세요.
