create table church (
    id serial primary key , 
    place varchar(200) not null , 
    name varchar(200) not null
);

create table users (
    id serial primary key  ,
    user_name varchar(100) not null ,
    user_Email varchar(200) unique not null ,
    user_password varchar(300) not null,
    church_id int not null references church (id)

);

create table families (
    id serial primary key , 
    name varchar(100) not null ,
    place varchar(200) not null,
    phone_number varchar (20) not null ,
    church_id int not null references church (id)
);

create table members (
    id serial primary key ,
    name varchar(100) not null , 
    date_of_birth date not null ,
    phone_number varchar(11) not null,
    national_id varchar (14) unique ,
    gender varchar (10) not null , 
    status varchar(20) not null default 'ALIVE',
    family_id int not null references families (id),
    church_id int not null references church (id)

);

create table family_events (
    id serial primary key , 
    event_date date not null,
    event_type varchar (200) not null ,
    notes text ,
    member_id int not null references members (id),
    church_id int not null references church (id)

);