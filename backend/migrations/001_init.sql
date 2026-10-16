create database if not exists todo_app;

use todo_app;

create table if not exists users (
  id bigint unsigned not null auto_increment,
  username varchar(50) not null,
  fullname varchar(100) null,
  email varchar(255) not null,
  password_hash varchar(255) not null,
  created_at datetime(3) not null default current_timestamp(3),

  primary key (id),
  unique key uq_users_username (username),
  unique key uq_users_email (email)
);

create table if not exists todos (
  id bigint unsigned not null auto_increment,
  user_id bigint unsigned not null,
  title varchar(200) not null,
  description varchar(2000) null,
  completed boolean not null default false,
  due_date date null,
  created_at datetime(3) not null default current_timestamp(3),
  updated_at datetime(3) not null default current_timestamp(3) 
  on update current_timestamp(3),

  primary key (id),
  index idx_todos_user_created (user_id, created_at, id),

  constraint fk_todos_user
    foreign key (user_id)
    references users(id)
    on delete cascade
);

create table if not exists tags (
  id bigint unsigned not null auto_increment,
  user_id bigint unsigned not null,
  tag_name varchar(50) not null,
  tag_desc varchar(255) null,
  created_at datetime(3) not null default current_timestamp(3),
  updated_at datetime(3) not null default current_timestamp(3)
    on update current_timestamp(3),

  primary key (id),
  unique key uq_tags_user_name (user_id, tag_name),

  constraint fk_tags_user
    foreign key (user_id)
    references users(id)
    on delete cascade
);

create table if not exists todo_tags (
  todo_id bigint unsigned not null,
  tag_id bigint unsigned not null,
  created_at datetime(3) not null default current_timestamp(3),

  primary key (todo_id, tag_id),
  index idx_todo_tags_tag_id (tag_id),

  constraint fk_todo_tags_todo
    foreign key (todo_id)
    references todos(id)
    on delete cascade,

  constraint fk_todo_tags_tag
    foreign key (tag_id)
    references tags(id)
    on delete cascade
);
