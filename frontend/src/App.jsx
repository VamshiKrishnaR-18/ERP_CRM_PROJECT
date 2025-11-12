import {Routes, Route, Link} from "react-router-dom";


const Dashboard = () => <h1>Dashboard(Protected)</h1>
const Customers = () => <h1>Customers(Protected)</h1>
const Invoices= () => <h1>Invoices(Protected)</h1>
const Payments = () => <h1>Payments(Protected)</h1>
const Login = () => <h1>Login(Protected)</h1>
const Register = () => <h1>Register(Protected)</h1>
const NotFound = () => <h1>Not Found</h1>

function App(){
  const isAutneticated = false;
  return(
    <div id="app-container">
      <nav>
        <Link to ="/dashboard">Dashboard</Link> |
        <Link to ="/customers">Customers</Link> |
        <Link to ="/invoices">Invoices</Link> |
        <Link to="/payments">Payments</Link> |
        {isAutneticated ?  (
          <button onClick ={() => console.log('Logging out...')}>Logout</button>
        ):(
          <>
          <Link to="/login">Login</Link> |
          <Link to="/register">Register</Link>
          </>
        )}
      </nav>
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element = {<Login/>}></Route>
          <Route path="Register" element = {<Register/>}></Route>
          {/* Protected Routes */}
          <Route path="/" element = {isAutneticated ? <Dashboard/> : <Login/>}></Route>
          <Route path="/dashboard" element = {isAutneticated ? <Dashboard/> : <Login/>}></Route>
          <Route path="/customers" element = {isAutneticated ? <Customers/>: <Login/>}></Route>
          <Route path="/invoices" element = {isAutneticated ?<Invoices/>: <Login/>}></Route>
          <Route path="/payments" element = {isAutneticated?<Payments/>:<Login/>}></Route>
        </Routes>

        {/*Catch all route */}
        <Route path="*" element = {<NotFound/>}></Route>
      </main>
    </div>
  )
}


export default App;