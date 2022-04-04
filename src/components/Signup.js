import React, { useState, useContext } from 'react'
import { Input, Card, Button } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';

import UserContext from '../UserContext'

const headers = {
    Authorization: 'Bearer keydbEuffxpMd5qMB',
    'Content-Type': 'application/json',
}

const Signup = () => {
    
    const {userContext, setUserContext} = useContext(UserContext)

    const navigate = useNavigate();
    const [name, setName] = useState("")
    const [isDup, setIsDup] = useState(false)
    
    const signup = async() => {
        try {
            const res = await axios.get('https://api.airtable.com/v0/app8dZOMg4vazbHnB/Users?'
                + `filterByFormula={Name}='${name}'`,
                { headers: headers }
            );
            if (res.data.records != 0) {
                setIsDup(true);
            } else {
                setIsDup(false);
                createUser()
            }
        } catch (e) { console.log(e) }
    }

    const createUser = async() => {
        try {
            const res = await axios.post('https://api.airtable.com/v0/app8dZOMg4vazbHnB/Users',
                { fields: { Name: name, Tasks: [] } },
                { headers: headers }
            );
            setUserContext(res.data)
            navigate('/search')
        } catch (e) { console.log(e) }
    }

    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <Card
                style={{
                    borderRadius: "20px",
                    width: "300px"
                }}
            >
                <div style={{display:"flex"}}>
                    <div>LOGO</div>
                    <div>Task Manager</div>
                </div>
                <div style={{height:"20px"}}></div>

                <Input
                    addonBefore={<div>Name</div>}
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value)
                    }}
                />
                {/* <Input
                    addonBefore={<div>Password</div>}
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value)
                    }}
                /> */}
                {isDup &&
                    <div
                        style={{fontSize: "10px",color: "red", marginTop:"4px"}}
                    >This name already exists, try a different one.</div>
                }
                <div style={{height:"20px"}}></div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}
                >
                    <Button
                        onClick={() => {
                            signup()
                        }}
                    >
                        Signup
                    </Button>
                    <Link
                        to='/login'
                    >
                        Go to Login
                    </Link>
                </div>
                
            </Card>
        </div>
    )
}

export default Signup