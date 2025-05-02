import { createContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
    let [authToken, setauthToken] = useState(() => localStorage.getItem('authToken') ? JSON.parse(localStorage.getItem('authToken')) : null)
    let [user, setUser] = useState(() => localStorage.getItem('authToken') ? JSON.parse(localStorage.getItem('data')) : null)
    let navigate = useNavigate();


    const loginUser = async (e) => {
        e.preventDefault();
        console.log("Work");
            let response = await fetch('http://127.0.0.1:8000/api/login/', {
                method: 'POST',
                headers: {
                    'content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'username': e.target.username.value,
                    'password': e.target.password.value
                })
            })

            let data = await response.json()
            console.log({ 'data': data })
            console.log({ 'response': response })

            if (response.status === 200) {
                setauthToken(data)
                localStorage.setItem('authToken', JSON.stringify(data.access))
                let access = data.access
                await userprofile(access)
                toast.success("Login Sucessfully")
                navigate("/")
            }
            else {
                toast.error(data.msg)
            }
    }
    const registerUser = async (e) => {
        e.preventDefault();
        console.log("Work");
            let response = await fetch('http://127.0.0.1:8000/api/register/', {
                method: 'POST',
                headers: {
                    'content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'username': e.target.username.value,
                    'email': e.target.email.value,
                    'password': e.target.password.value,
                    'confirm_password': e.target.password.value,
                    'role': e.target.role.value,
                })
            })

            let data = await response.json()
            console.log({ 'data': data })
            console.log({ 'response': response })

            if (response.status === 201) {
                toast.success("User Registerd Please Login Using Your Credentials")
                navigate("/login")
            }
            else {
                toast.error(data.msg)
            }
    }
    const userprofile = async (access) => {
            let response = await fetch('http://127.0.0.1:8000/api/me/',{
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${access}`,
                    'Content-Type': 'application/json',
                },
            })
            let data = await response.json()
            console.log({ 'data': data })
            console.log({ 'response': response })
            localStorage.setItem('data', JSON.stringify(data))
            setUser(data)
    }
    // #################################################################################################

    const postFeedBack = async (e) => {
        e.preventDefault()
        console.log("Posting FeedBack");
        let authToken = JSON.parse(localStorage.getItem('authToken'))
        let access = authToken
            let response = await fetch('http://127.0.0.1:8000/api/feedback/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${access}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "student": user.id,
                    "content": e.target.content.value,
                })
            })
            let data = await response.json()
            console.log({ 'data': data })
            console.log({ 'response': response })
            if (response.status === 201) {
                window.location.reload("/");
            }
            else {
                toast.error(data.msg)
                
            }
    }
    const postInstruction = async (e) => {
        e.preventDefault()
        console.log("Posting Instruction");
        let authToken = JSON.parse(localStorage.getItem('authToken'))
        let access = authToken
            let response = await fetch('http://127.0.0.1:8000/api/instructions/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${access}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "content": e.target.content.value,
                })
            })
            let data = await response.json()
            console.log({ 'data': data })
            console.log({ 'response': response })
            if (response.status === 201) {
                window.location.reload("/");
            }
            else {
                toast.error(data.msg)
            }
    }
    const logoutUser = () => {
        setauthToken(null)
        setUser(null)
        localStorage.removeItem('authToken')
        localStorage.removeItem('data')
        localStorage.removeItem('access')
        toast.warning("Logout Succesfully")
        navigate('/login')
    }
    let contextData = {
        authToken:authToken,
        user: user,
        loginUser:loginUser,
        registerUser,registerUser,
        logoutUser,logoutUser,
        postFeedBack,postFeedBack,
        postInstruction,postInstruction,
    }
    
    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}