const mysql = require("mysql");
const inquirer = require("inquirer");

const bidAuction = ()=>{
    //query the database and present all items for bidding
    connection.query('select * from auctions', (err, results)=>{
        if(err)throw err;
        inquirer.prompt([
            {
              name: 'choice',
              type: 'rawlist',
              choices() {
                const choiceArray = [];
                results.forEach(({ item_name }) => {
                  choiceArray.push(item_name);
                });
                return choiceArray;
              },
              message: 'What auction would you like to place a bid in?',
            },
            {
              name: 'bid',
              type: 'input',
              message: 'How much would you like to bid?',
            },
          ]).then((answer)=>{
            let chosenItem;
            results.forEach((item) => {
              if (item.item_name === answer.choice) {
                chosenItem = item;
              }
            });
            if (chosenItem.highest_bid < parseInt(answer.bid)) {
                // bid was high enough, so update db, let the user know, and start over
                connection.query(
                  'UPDATE auctions SET ? WHERE ?',
                  [
                    {
                      highest_bid: answer.bid,
                    },
                    {
                      id: chosenItem.id,
                    },
                  ],
                  (error) => {
                    if (error) throw err;
                    console.log('Bid placed successfully!');
                    startAuction();
                  }
                );
              } else {
                // bid wasn't high enough, so apologize and start over
                console.log('Your bid was too low. Try again...');
                startAuction();
              }
          })
    })
}


const postAuction = () =>{
inquirer.prompt([
    {
        name: 'item',
        type: 'input',
        message: 'what is the item you want to input'
    },
    {
        name: 'category',
        type: 'input',
        message: 'what category would you like to place the auction in'
    },
    {
        name: 'startingBid',
        type: 'input',
        message: 'what would you like to start with',
        validate(value){
            if(isNaN(value) === false){
                return true;
            }
            return false;
        }
    }

]).then((answer)=>{
    connection.query('insert into auctions set?', {
        item_name: answer.item,
        category: answer.category,
        starting_bid: answer.starting_bid || 0,
        highest_bid: answer.highest_bid || 0
    }, (err)=>{
        if(err) throw err;
        console.log('your auction item was posted successfull')
        startAuction();
    })
})
}

const startAuction = ()=>{
    inquirer.prompt({
        name: 'postOrBid',
        type: 'list',
        message: 'would you like to [POST] or [BID] for the auction',
        choices: ['POST', 'BID', 'EXIT']
    }).then((answer)=>{
        console.log(answer)
        switch(answer.postOrBid){
            case 'POST': postAuction(); break;
            case 'BID': bidAuction(); break;
            default: connection.end();
        }
    })
}

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'greatBay_DB'
});

connection.connect((err)=>{
if(err) throw err;
startAuction();
})


