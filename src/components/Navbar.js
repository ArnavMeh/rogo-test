import React, { useContext } from 'react'
import { Link } from "react-router-dom"
import { Button } from 'antd';

import UserContext from '../UserContext'

const Navbar = () => {

    const { userContext, setUserContext } = useContext(UserContext)

    return (
        <div
            style={{
                // width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                // height: "50px",
                border: "1px solid black",
                padding: "20px"
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignContent: "center"
                }}
            >
                <div>
                    ICON
                </div>
                <div 
                    style={{
                        fontSize: "24px",
                        fontWeight:"600"
                    }}
                >
                    Task Manager
                </div>
            </div>

            { userContext?
                <>
                    <div
                        style={{fontSize:"16px"}}
                    >
                        <Button type="primary" ghost>
                            <Link to='/search'>Search Tasks</Link>
                        </Button>
                        <Button type="primary" ghost style={{marginLeft:"10px"}}>
                            <Link to='/editor'>Task Editor</Link>
                        </Button>
                    </div>
                    {/* <div
                        style={{
                            fontSize: "18px",
                            width: "180px",
                            display: "flex",
                            justifyContent:"end"
                        }}
                    >
                        Hello, {userContext.fields.Name}!
                    </div> */}
                </>
            :
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "150px",
                        alignContent: "center"
                    }}
                >   
                    <Button>
                        <Link to="/login">Login</Link>
                    </Button>
                    <Button>
                        <Link to="/signup">Signup</Link>
                    </Button>
                </div>
            }
        </div>
    )
}

export default Navbar