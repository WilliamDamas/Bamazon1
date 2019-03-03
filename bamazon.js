var inquirer = require("inquirer");
var mysql = require("mysql");


var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'bamazon'
});

connection.connect(function (err) {
    if (err) throw err;
    start();
});


function start() {
    connection.query("SELECT id, product_name, price, stock_quantity FROM products", function (err, results) {
        if (err) throw err




        inquirer
            .prompt([
                {
                    name: "items for sell",
                    type: "list",
                    message: "Which item you wish to purchase ?",
                    pageSize: 10,
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].id + "." + " Name: " + results[i].product_name + " | Price: " + results[i].price + " | Quantity: " + results[i].stock_quantity);
                        }
                        return choiceArray;
                    }
                },

                {
                    name: "the number of item availeble",
                    type: "input",
                    message: "Which item you wish to purchase?",

                }]).then(function (data) {
                    console.log("Getting information...")
                    buy(results, data);
                })
    })
}


function buy(results, data) {

    let IDplaceArray = parseInt(data.buy.split(".")[0]) - 1
    if (data.quantity <= results[IDplaceArray].stock_quantity) {
        let quantity = results[IDplaceArray].stock_quantity - data.quantity
        var query = connection.query(
            "UPDATE products SET ? WHERE ?",
            [
                {
                    stock_quantity: quantity
                },
                {
                    id: data.buy.split(".")[0]
                }
            ],
            function (err, res) {
                console.log(results[IDplaceArray].product_name + " Thanks for purchase");

                start();
            }
        )

    } else {
        console.log("Insufficient items !");
        start();
    }
}