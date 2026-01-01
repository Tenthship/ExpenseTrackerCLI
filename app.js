#!/usr/bin/env node
const { Command } = require("commander");
const fs = require("fs")
const FILE = "expenses.json"

function initialize() {
    if (fs.existsSync(FILE)) {
        const contents = fs.readFileSync(FILE, "utf8");
        if (contents.trim() !== "") {
            data = JSON.parse(contents);
        }
    }
}

const program = new Command();

let data = { expenses: [] }
initialize()

program
  .name("Expense Tracker")
  .description("Simple Expense tracker")
  .version("1.0.0");

program
    .command("add")
    .option("-d, --description <text>", "What the expense is")
    .option("-a, --amount <number>", "How much it cost")
    .action((options) => {
        let date = new Date()
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()
        let id = 0
        if (data.expenses.length === 0) {
            id = 0
        } else {
            let last_index = data.expenses.length - 1
            id = data.expenses[last_index].id + 1
        }
        const options_json = ({
            "id": id,
            "description": options.description,
            "amount": options.amount,
            "year": year,
            "month": month,
            "day": day
        })
        data.expenses.push(options_json)
        fs.writeFileSync(FILE, JSON.stringify(data, null, 2))
    })

program
    .command("list")
    .action(() => {
        console.table(data.expenses)
    })

program
    .command("summary")
    .option("-m, --month <month>", "Month of the expenses you want to look at")
    .action((options) => {
        let total = 0
        if (options.month) {
            for (let i = 0; i < data.expenses.length; i++) {
                if (data.expenses[i].month == options.month) {
                    total += parseInt(data.expenses[i].amount)
                }
                console.log(`Total expenses for month ${options.month}: $${total}`)
            }
        } else {
            for (let i = 0; i < data.expenses.length; i++) {
                total += parseInt(data.expenses[i].amount)
                console.log(`Total expenses: $${total}`)
            }
        }

        
    })

program
    .command("delete")
    .option("-i, --id <number>", "Task id to be deleted")
    .action((options) => {
        let deleted = false
        for (let i = 0; i < data.expenses.length; i++) {
            if (parseInt(options.id) === data.expenses[i].id) {
                data.expenses.splice(i, 1)
                fs.writeFileSync(FILE, JSON.stringify(data, null, 2))
                deleted = true
                break
            }
        }

        if (deleted) {
            console.log(`Successfully deleted task with id ${options.id}`)
        } else {
            console.log(`Task with id ${options.id} does not exist`)
        }
    })

program.parse()
