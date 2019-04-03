const cTable = require("console.table");
const inquirer = require("inquirer");
const mysql = require("mysql");

let connection = mysql.createConnection({
    host     : "localhost",
    user     : "root",
    password : "root",
    database : "bamazon"
});

connection.connect();

function buyItem(){
    connection.query("SELECT * FROM products", function (error, results){
        if (error) throw error;

        let displayArr = [];
        for (let i=0; i<results.length; i++){
            displayArr.push(
                {
                    ID: results[i].item_id,
                    Product: results[i].product_name,
                    Price: "$" + results[i].price
                }
            );
        }
        console.log("\n");
        console.table(displayArr);

        inquirer.prompt([
            {
                type: "input",
                name: "id",
                message: "What is the ID of the product you would like to buy?"
            },
            {
                type: "input",
                name: "units",
                message: "How many units?"
            }
        ]).then(answers=>{
            processOrder(answers);          
        })
    });
}

function processOrder(answers){
    let id = answers.id;
    let units = answers.units;
    connection.query("SELECT * FROM products WHERE item_id="+parseInt(id), function(error, results){
        if (error) throw error;

        if (parseInt(units) > parseInt(results[0].stock_quantity)){
            console.log("\n\nNot enough in stock! Try again!");
            buyItem();
        }
        else{
            connection.query("UPDATE products SET stock_quantity="+(parseInt(results[0].stock_quantity) - parseInt(units))+" WHERE item_id="+parseInt(id), function (error, results){
                if (error) throw error;
                console.log("\nThank you for shopping at Bamazon! Your order for "+units+" units of product #"+id+" has been processed.\n");
                inquirer.prompt([
                    {
                        type: "confirm",
                        name: "bool",
                        message: "Would you like to continue shopping?"
                    }
                ]).then(ans=>{
                    if (ans.bool) buyItem();
                    else {
                        console.log("\nSee you again soon!")
                        connection.end();
                    }
                });
            });
        }
    });
}

buyItem();