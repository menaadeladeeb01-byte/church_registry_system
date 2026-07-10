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
    head_id int references members (id) on delete set null ,
    church_id int not null references church (id)
);

CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL, 
    date_of_birth DATE NOT NULL,
    phone_number VARCHAR(20), 
    national_id VARCHAR(14) UNIQUE, 
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('MALE', 'FEMALE')), 
    status VARCHAR(20) NOT NULL DEFAULT 'ALIVE' CHECK (status IN ('ALIVE', 'DECEASED')), 
    family_id INT NOT NULL REFERENCES families (id) ON DELETE CASCADE, 
    church_id INT NOT NULL REFERENCES church (id) ON DELETE CASCADE
);

CREATE TABLE family_events (
    id SERIAL PRIMARY KEY, 
    event_date DATE NOT NULL,
    event_type VARCHAR(200) NOT NULL,
    notes TEXT,
    
    member_id INT NOT NULL REFERENCES members (id) ON DELETE CASCADE,
    church_id INT NOT NULL REFERENCES church (id) ON DELETE CASCADE
);


CREATE TABLE refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE, 
    token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);