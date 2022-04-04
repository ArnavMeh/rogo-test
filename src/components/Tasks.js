import React, { useContext, useState, useEffect } from 'react'
import { Button, Input, Card, Select } from 'antd';
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import UserContext from '../UserContext'

const headers = {
    Authorization: 'Bearer keydbEuffxpMd5qMB',
    'Content-Type': 'application/json',
}

const Tasks = () => {
    const navigate = useNavigate();
    const { userContext, setUserContext } = useContext(UserContext);
    const [ tasks, setTasks ] = useState([]);

    useEffect(() => {
        if (!userContext) {
            navigate('/')
        } else {
            getTasks();
        }
    }, [userContext])

    const getTasks = async() => {
        try {
            const taskList = []
            for (const id of userContext.fields.Tasks) {
                const res = await axios.get(`https://api.airtable.com/v0/app8dZOMg4vazbHnB/Tasks/${id}`,
                    { headers: headers }
                );
                taskList.push(res.data);
            }
            setTasks(taskList)
        } catch (e) {console.log(e)}
    }

    const save = async() => {
        for (var i = 0; i < tasks.length; i++) {
            if (tasks[i].id) { // update task
                try {
                    const res = await axios.put(`https://api.airtable.com/v0/app8dZOMg4vazbHnB/Tasks/${tasks[i].id}`,
                        { fields: tasks[i].fields }, { headers: headers }
                    );
                } catch (e) { console.log(e) }
            } else { // create task
                try {
                    const res = await axios.post(`https://api.airtable.com/v0/app8dZOMg4vazbHnB/Tasks`,
                        { fields: tasks[i].fields }, { headers: headers }
                    );
                    tasks[i] = res.data;
                } catch (e) { console.log(e) }
            }
        }

        // update user
        const new_id_list = tasks.map(task => task.id)
        console.log(new_id_list)
        try {
            const res = await axios.patch(`https://api.airtable.com/v0/app8dZOMg4vazbHnB/Users/${userContext.id}`,
                { fields: { Tasks: new_id_list } }, { headers: headers }
            );
            setUserContext(res.data)
        } catch (e) { console.log(e) }
    }

    const refresh = async() => {
        if (!userContext) { return; }

        try {
            const res = await axios.get(`https://api.airtable.com/v0/app8dZOMg4vazbHnB/Users/${userContext.id}`,
                { headers: headers }
            );
            if (!res || !res.data) {
                return;
            }
            setUserContext(res.data)
        } catch (e) { console.log(e) }
        getTasks();
    }

    return (
        <div
            style={{
                width: "100vw",
                display: "flex",
                justifyContent: "center",
                marginTop: "80px"
            }}
        >
        <div
            style={{
                width: "80%",
                maxWidth: "700px"
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >
                <div
                    style={{
                        fontSize: "20px"
                    }}
                >Task Editor</div>
                <span>
                    <Button
                        onClick={() => {
                            save()
                        }}
                    >Save Progress</Button>
                    <Button
                        style={{marginLeft: "10px"}}
                        onClick={() => {
                            refresh()
                        }}
                    >Refresh</Button>
                </span>
                
            </div>
            
            {tasks &&
                <div
                    style={{
                        margin: "20px"
                    }}
                >
                    {tasks.map((task, i) => (
                        <Card
                            hoverable
                            style={{
                                borderRadius: "15px",
                                margin: "10px"
                            }}
                        >
                            <Input
                                addonBefore={<div>Name</div>}
                                value={task.fields.Name}
                                onChange={(e) => {
                                    const temp = tasks;
                                    temp[i].fields.Name = e.target.value;
                                    setTasks([...temp])
                                }}
                            />
                            <Input.TextArea
                                style={{
                                    margin:"10px 0",
                                    height: "100px"
                                }}
                                value={task.fields.Notes}
                                onChange={(e) => {
                                    const temp = tasks;
                                    temp[i].fields.Notes = e.target.value;
                                    setTasks([...temp])
                                }}
                            />
                            <div
                                style={{display: "flex", justifyContent:"space-between"}}
                            >
                                <Select
                                    value={task.fields.Status}
                                    style={{width:"calc(100% - 40px)"}}
                                    onChange={(e) => {
                                        const temp = tasks;
                                        temp[i].fields.Status = e;
                                        setTasks([...temp])
                                    }}
                                >
                                    <Select.Option value='Todo'>
                                        Todo
                                    </Select.Option>
                                    <Select.Option value='In progress'>
                                        In progress
                                    </Select.Option>
                                    <Select.Option value='Done'>
                                        Done
                                    </Select.Option>
                                </Select>
                                <Button
                                    danger ghost shape="circle"
                                    onClick={() => {
                                        const temp = tasks;
                                        temp.splice(i, 1);
                                        setTasks([...temp])
                                    }}
                                >X</Button>
                            </div>
                            
                        </Card>
                    ))}
                </div>
            }

            <div
                style={{
                    display: "flex",
                    justifyContent: "center"
                }}
            >
                <Button
                    shape="round"
                    onClick={() => {
                        const temp = tasks;
                        temp.push({
                            fields: {
                                Name: "Task",
                                Notes: "Notes",
                                Status: "Todo",
                                User: []
                            }
                        });
                        setTasks([...temp])
                    }}
                >
                    Add Task
                </Button>
            </div>

        </div>
        </div>
    )
}

export default Tasks