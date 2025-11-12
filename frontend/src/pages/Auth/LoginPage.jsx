import {useState} from 'react';
import axiosClient from '../../config/axiosClient';

function LoginPage(){
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const[error, setError] = useState('');
    const[loading, setLoading] = useState(false);

    const handleSubmit = async (e)=>{
        e.preventDefault();
        setLoading(true);
        setError(null);

        if(!email || !password){
            setError("Please enter both email and password.");
            setLoading(false);
            return;
        }

        try{
            const response = await axiosClient.post('/users/login', {email, password});

            const {token} = response.data;
            localStorage.setItem('token', token);

            console.log('Login successful');

        }catch(err){
            const errMessage = err.respponse?.data?.message || 'Login failed';
            setError(errMessage);
        }finally{
            setLoading(false);
        }
    }

    return(
        <div>
            <h1>Login Page</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor='email'>Email:</label>
                    <input id="email" type='email' value="{email}" onChange={(e)=>setEmail(e.target.value)} required/>
                </div>
                {error && <div>{error}</div>}
                <div>
                    <label htmlFor='password'>Password:</label>
                    <input id="password" type='password' value="{password}" onChange={(e)=>setPassword(e.target.value)} required/>
                    <button type='submit' disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
                </div>
            </form>
            <button onClick={()=>{window.location.href = '/register'}} >Register</button>

        </div>
    )
}

export default LoginPage;