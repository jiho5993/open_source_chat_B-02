create schema my_db;
use my_db;

create table user_info (
	username varchar(25),
    password varchar(200),
    state tinyint(1) default 0
);

select * from user_info;

-- 유저 회원가입 테스트
insert into user_info values ("user", "1234", 0);