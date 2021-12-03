DROP DATABASE IF EXISTS greatBay_DB;
CREATE DATABASE greatBay_DB;

USE greatBay_DB;


CREATE table auctions (
    id int auto_increment not null,
    item_name varchar(100) not null,
    category varchar(45) not null,
    starting_bid int default 0,
    highest_bid int default 0,
    primary key(id)
)