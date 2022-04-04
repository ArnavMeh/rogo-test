import React, { useContext, useState, useEffect } from 'react'
import { Button, Input, Card, Select } from 'antd';
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import UserContext from '../UserContext'

const headers = {
    Authorization: 'Bearer keydbEuffxpMd5qMB',
    'Content-Type': 'application/json',
}

const Search = () => {
    const navigate = useNavigate();
    const { userContext, setUserContext } = useContext(UserContext);
    const [ tasks, setTasks ] = useState([]);
    const [ name, setName ] = useState("");
    const [ status, setStatus ] = useState("All");

    useEffect(() => {
        if (!userContext) {
            navigate('/');
        } else {
            getTasks();
        }
    }, [])

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

    const filter = (arr) => {
        if (name.length != 0) {
            const str1 = name.toLowerCase();
            arr = arr.filter(item => {
                const str2 = item.fields.Name.toLowerCase();
                return str1.indexOf(str2) != -1 || str2.indexOf(str1) != -1
            })
        }
        if (status != 'All') {
            arr = arr.filter(item => {
                return item.fields.Status == status;
            })
        }
        return arr;
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
                >Task Search</div>
                <Button
                    onClick={() => { refresh(); }}
                >
                    Refresh
                </Button>
            </div>

            {/* filters */}
            <div>
                <Input
                    addonBefore={<div>Name</div>}
                    value={name}
                    onChange={(e) => {setName(e.target.value)}}
                    style={{margin:"15px 0 10px 0"}}
                />
                <Select
                    value={status}
                    style={{width:"100%"}}
                    onChange={(e) => {setStatus(e)}}
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
                    <Select.Option value='All'>
                        All
                    </Select.Option>
                </Select>
            </div>
            
            {/* tasks */}
            {tasks &&
                <div
                    style={{
                        margin: "20px"
                    }}
                >
                    {filter(tasks).map((task, i) => (
                        <Card
                            hoverable
                            style={{
                                borderRadius: "15px",
                                margin: "10px"
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}
                            >
                                <div style={{fontSize:"20px"}}>{task.fields.Name}</div>
                                <div style={{fontSize:"16px"}}>Status: {task.fields.Status}</div>
                            </div>
                            <div>Notes: {task.fields.Notes}</div>                       
                        </Card>
                    ))}
                </div>
            }
        </div>
        </div>
    )
}

export default Search