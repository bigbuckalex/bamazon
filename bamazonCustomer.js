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
            // console.log(answers.id);
            // connection.query("SELECT * FROM products WHERE item_id=5", function(error, results){
            //     if (error) throw error;
        
            //     if (parseInt(answers.units) > parseInt(results[0].stock_quantity)){
            //         console.log("Not enough in stock!");
            //     }
            //     else{
            //         console.log(answers);
            //         connection.query("UPDATE products SET stock_quantity="+(parseInt(results[0].stock_quantity) - parseInt(answers.units))+"WHERE item_id = ?", [answers.id], function (error, results){
            //             if (error) throw error;
            //             console.log(results);
            //         });
            //     }
            // });            
        })
    });
}

function processOrder(idQuantity){
    console.log(idQuantity.id );
    connection.query("SELECT * FROM products WHERE item_id="+parseInt(idQuantity.id), function(error, results){
        if (error) throw error;

        if (parseInt(idQuantity.units) > parseInt(results[0].stock_quantity)){
            console.log("Not enough in stock!");
        }
        else{
            connection.query("UPDATE products SET stock_quantity="+(parseInt(results[0].stock_quantity) - parseInt(idQuantity.units))+" WHERE item_id="+parseInt(idQuantity.id), function (error, results){
                if (error) throw error;
                console.log(results);
            });
        }
    });
}

buyItem();