// https://gurtn.tistory.com/212
var searchdb = new Array();
const $search = document.querySelector("#search");
const $autoComplete = document.querySelector(".autocomplete");

let nowIndex = 0;
let matchDataList;

$search.onkeyup = (event) => {
    // 검색어
    const value = $search.value.trim();

    // 자동완성 필터링
    matchDataList = value
        ? searchdb.filter((label) => label.toLowerCase().includes(value.toLowerCase()))
        : [];
    
    switch (event.keyCode) {
        // UP KEY
        case 38:
            nowIndex = Math.max(nowIndex - 1, 0);
            break;

        // DOWN KEY
        case 40:
            nowIndex = Math.min(nowIndex + 1, matchDataList.length - 1);
            break;

        // ENTER KEY
        case 13:
            var input = $search.value;
            $search.value = "";

            var mob = matchDataList[nowIndex];
            addMobToList(mob ? mob : input);

            // 초기화
            nowIndex = 0;
            matchDataList.length = 0;

            break;
          
        // 그외 다시 초기화
        default:
            nowIndex = 0;
            break;
    }

    // 리스트 보여주기
    showList(matchDataList, value, nowIndex);
};

const showList = (data, value, nowIndex) => {
  // 정규식으로 변환
    const regex = new RegExp(`(${value})`, "gi");
    $autoComplete.innerHTML = data
        .map(
            (label, index) => `
            <div class='${nowIndex === index ? "active" : ""}' onclick='select(this);'>
                ${label.replace(regex, "<mark>$1</mark>")}
            </div>
        `
        )
        .join("");
};

function select(obj)
{
    $search.value = obj.textContent.trim();
}

function setDB(server) {
    switch (server) {
        case "KMS":
            db = dbk;
            break
        case "JMS":
            db = dbj;
            break;
        case "MSEA":
            db = dbs;
            break;
        /*case "GMS":
            db = dbg;
            break;*/
        case "TMS":
            db = dbt;
            break;
        default:
            db = dbk;
    }

    searchdb.length = 0;
    for (let i = 0; i < db.length; i++)
    {
        searchdb[i] = db[i].name;
    }
}