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
        let id = 0
        if (data.expenses.length === 0) {
            id = 0
        } else {
            let last_index = data.expenses.length - 1
            id = data.expenses[last_index].id + 1
        }
        const options_json = ({
            "description": options.description,
            "amount": options.amount,
            "id": id
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
    .action(() => {
        let total = 0
        for (let i = 0; i < data.expenses.length; i++) {
            total += parseInt(data.expenses[i].amount)
        }
        console.log(`Total expenses: $${total}`)
    })

program.parse()
