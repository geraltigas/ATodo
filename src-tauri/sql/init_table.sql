-- clear all tables
drop table if exists tasks;
drop table if exists app_state;

create table if not exists tasks (
    id timestamp primary key,
    root_task timestamp,
    name text,
    goal text,
    deadline timestamp,
    time_consumed timestamp,
    status text check ( status in ('created', 'in_progress', 'paused', 'suspended', 'done')),
    parent timestamp,
    position_x integer,
    position_y integer,
    suspended_type text check ( suspended_type in ('time', 'cyclical', 'email', 'constructing', 'unsupported') ),
    suspended_info text
);

-- create index of task table, id, root_task, name
create index if not exists tasks_id_idx on tasks (id);
create index if not exists tasks_root_task_idx on tasks (root_task);
create index if not exists tasks_name_idx on tasks (name);

-- create singleton table for application runtime state
create table if not exists app_state (
    id integer primary key check ( id = 0 ),
    root_task timestamp,
    now_viewing_task timestamp
);

insert into tasks (id, root_task, name, goal, deadline, time_consumed, status, parent, position_x, position_y, suspended_type, suspended_info) values (0, 0,'Work', 'Rise', 4102444800, 0, 'created', -1, 100, 100, NULL, NULL);
insert into app_state (id, root_task, now_viewing_task) VALUES (0, 0, 0);
