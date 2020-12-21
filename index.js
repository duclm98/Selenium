require('chromedriver');
const {
    Builder,
    By,
    Key
} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromePath = require('chromedriver').path;
let service = new chrome.ServiceBuilder(chromePath).build();
chrome.setDefaultService(service);
const fs = require('fs');

// const builds = ['Prototype', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
// const operations = ['Add', 'Subtract', 'Multiply', 'Devide', 'Concatenate'];
const builds = ['1'];
const operations = ['Subtract'];
const number = [{
    number1: '',
    number2: ''
}, {
    number1: '5',
    number2: ''
}, {
    number1: '',
    number2: '-4'
}, {
    number1: 'a4',
    number2: '7'
}, {
    number1: '100',
    number2: 'rt1'
}, {
    number1: 't1',
    number2: 'b1'
}, {
    number1: ' 5',
    number2: '6'
}, {
    number1: '5',
    number2: ' 6'
}, {
    number1: ' 5',
    number2: ' 6'
}, {
    number1: '2/3',
    number2: '4'
}, {
    number1: '-0.5',
    number2: '1'
}, {
    number1: '100',
    number2: '0'
}, {
    number1: '-15',
    number2: '-23'
}, {
    number1: '13',
    number2: '-20'
}, ]

const run = async (browser, report) => {
    let driver = await new Builder().forBrowser(browser).build();
    const RunTestCases = async (driver, build, operation, number1, number2) => {
        let result, msg;
        await driver.get('https://testsheepnz.github.io/BasicCalculator.html');
        await driver.findElement(By.id('selectBuild')).sendKeys(build, Key.RETURN);
        await driver.findElement(By.id('number1Field')).sendKeys(number1, Key.RETURN);
        await driver.findElement(By.id('number2Field')).sendKeys(number2, Key.RETURN);
        await driver.findElement(By.id('selectOperationDropdown')).sendKeys(operation, Key.RETURN);
        await driver.findElement(By.id('calculateButton')).click();

        result = await driver.findElement(By.id('numberAnswerField')).getAttribute("value");
        msg = await driver.findElement(By.id('errorMsgField')).getText();
        return {
            result,
            msg
        }
    }

    let result = [];
    let id = 0;

    for (let i = 0; i < builds.length; i++) {
        for (let j = 0; j < operations.length; j++) {
            for (let k = 0; k < number.length; k++) {
                const resTestCase = await RunTestCases(driver, builds[i], operations[j], number[k].number1, number[k].number2);
                const res = {
                    id: ++id,
                    build: builds[i],
                    operation: operations[j],
                    ...number[k],
                    ...resTestCase
                };
                result.push(res)

                const line = `${id} ${res.build} ${res.operation} ${res.number1} ${res.number2} ${res.result} ${res.msg}\n`;
                fs.appendFileSync(report, line, function (err) {
                    if (err) return console.log(err);
                });
            }
        }
    }

    await driver.quit();

    console.log(result);
}
run('chrome','report_chrome.txt');
// run('firefox','report_firefox.txt');