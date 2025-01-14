let singleForm = document.forms[0];
let sname = singleForm.sname;
let suname = singleForm.suname;
let pname = singleForm.pname;
let dname = singleForm.dname;
let buildingType = document.getElementById("select");
let output1 = document.getElementById("output1");

const text = () => {
    let outText = "no features";
    let object = document.getElementById("object1").childNodes;
    let countList = [];
    for (let index = 0; index < object.length; index++) {
        const element = object[index];
        if(element.type === "checkbox" && element.checked) {
            outText = element.value;
            countList.push(outText);
        }  
    }
    if (countList.length === 0) {
        return outText;
    }
    if (countList.length === 1) {
        outText = countList[0];
        return outText;
    } else {
        outText = "";
        for (const elements of countList) {
            if (elements === countList[0]) {
                outText += elements;
                continue;
            }
            if (elements === countList[countList.length - 1]) {
                outText += ", and " + elements;
                continue
            }
            outText += ", " + elements;
        }
    }
    return outText;
}

const blurrender = () => {
    let digit = "^[0-9]{4}$";
    let date = "^[0-9]{2}/[0-9]{2}/[0-9]{4}$";
    const nowTime = new Date();
    
    if (sname.value.length < 3 || sname.value.length > 50) {
        output1.value = "Please input a valid street name";
    } else if (suname.value.length < 3 || suname.value.length > 50) {
        output1.value = "Please input a valid suburb";
    } else if (pname.value.match(digit) === null) {
        output1.value = "Please input a valid postcode";
    } else if (dname.value.match(date) === null || Date.parse(dname.value) === null) {
        output1.value = "Please enter a valid date of birth";
    } else {
        let dateSplit = dname.value.split("/");
        let birth = new Date(dateSplit[2] + "/" + dateSplit[1] + "/" + dateSplit[0]);
        let age = nowTime.getFullYear() - birth.getFullYear() - 1;
        if (nowTime.getMonth() > birth.getMonth()) {
            age++;
        } else if (nowTime.getMonth() == birth.getMonth() && nowTime.getDate() >= birth.getDate()) {
            age++;
        } 

        let choose = "";
        buildingType.value == "House"?choose = "a":choose = "an";

        let feature = text();

        
        output1.value = `Your are ${age} years old, and your address is ${sname.value} St, ${suname.value}, ${pname.value}, Australia. Your building is ${choose} ${buildingType.value}, and it has ${feature}`;
    }
}

sname.addEventListener('blur', blurrender);
suname.addEventListener('blur', blurrender);
pname.addEventListener('blur', blurrender);
dname.addEventListener('blur', blurrender);
buildingType.addEventListener('change',blurrender);

let heat = singleForm.Heating;
let aircondition = singleForm.AirConditioning;
let pool = singleForm.Pool;
let sandpit = singleForm.Sandpit;
let allSelect = document.getElementById("allSelect");


const selectAll = () => {
    if (allSelect.innerText == "Deselect all") {
        heat.checked = false;
        aircondition.checked = false;
        pool.checked = false;
        sandpit.checked = false;
        allSelect.innerText = "Select All";
    } else {
        heat.checked = true;
        aircondition.checked = true;
        pool.checked = true;
        sandpit.checked = true;
        allSelect.innerText = "Deselect all";
    }
    change();
}
const change = () => {
    if (heat.checked == true && aircondition.checked == true &&  pool.checked == true && sandpit.checked == true) {
        allSelect.innerText = "Deselect all";
    } else {
        allSelect.innerText = "Select All";
    }
    blurrender();
}

heat.addEventListener("change", change);
aircondition.addEventListener("change", change);
pool.addEventListener("change", change);
sandpit.addEventListener("change", change);
allSelect.addEventListener("click", selectAll);


