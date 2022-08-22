const { Builder, Browser, By, Key } = require('selenium-webdriver')
const database = require('../databases/database')
const { ISSUE_COMPLETE_STATUS, ISSUE_ACTIONS } = require('./constants')

require('chromedriver')

function getToday() {
    return new Date().setHours(0, 0, 0, 0)
}

function getEndTime(startTime, timeStr) {
    const timeArr = timeStr.split(' ')
    const endTime = new Date(startTime)
    const currentDate = endTime.getDate()
    const interval = parseInt(timeArr[0], 10)
    if (timeArr[1] === 'D') {
        endTime.setDate(currentDate + interval)
    } else {
        endTime.setMonth(endTime.getMonth() + interval)
        if (endTime.getDate() !== currentDate) {
            endTime.setDate(0)
        }
    }
    endTime.setDate(endTime.getDate() - 1)
    return endTime.getTime()
}

function isTimeOut(startTime, timeStr) {
    return getEndTime(startTime, timeStr) <= getToday()
}

function getIssueCompleteStatus(issue) {
    if (issue.status === -1) {
        return ISSUE_COMPLETE_STATUS.Complete
    }
    const { totalTime, timeToOrange, timeToRed } = ISSUE_ACTIONS[issue.action].steps[issue.status]
    const startTime = issue.startTimeArr[issue.status]
    if (isTimeOut(startTime, totalTime)) {
        return ISSUE_COMPLETE_STATUS.TimeOut
    } else if (isTimeOut(startTime, timeToRed)) {
        return ISSUE_COMPLETE_STATUS.RedRisk
    } else if (isTimeOut(startTime, timeToOrange)) {
        return ISSUE_COMPLETE_STATUS.OrangeRisk
    } else {
        return ISSUE_COMPLETE_STATUS.NoRisk
    }
}

async function openBrowser(timeoutArr, redArr, orangeArr) {
    let driver = await new Builder().forBrowser(Browser.CHROME).build()
    try {
        await driver.get('https://www.google.com')
        await driver.findElement(By.className('gLFyf')).sendKeys('test', Key.RETURN)
    } finally {
        // await driver.quit()
    }
}

function sendMessage() {
    console.log('开始查找有过期风险的案件')
    const sql = 'SELECT * FROM issue WHERE status != -1 ORDER BY id'
    database.all(sql, [], (err, rows = []) => {
        if (err) {
            return console.log(err.message)
        }
        const timeoutArr = []
        const redArr = []
        const orangeArr = []
        rows.forEach(row => {
            console.log(row.issueName)
            const status = getIssueCompleteStatus(row)
            if (status === ISSUE_COMPLETE_STATUS.TimeOut) {
                timeoutArr.push(row.issueName)
            } else if (status === ISSUE_COMPLETE_STATUS.RedRisk) {
                redArr.push(row.issueName)
            } else if (status === ISSUE_COMPLETE_STATUS.OrangeRisk) {
                orangeArr.push(row.issueName)
            }
        })
        console.log('查找完成，开始发送短信')
        openBrowser(timeoutArr, redArr, orangeArr)
    })
}

exports.sendMessage = sendMessage