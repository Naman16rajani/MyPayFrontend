
import './App.css';
import {useState} from "react";
import {Alert, Button, Snackbar} from "@mui/material";


function App() {
    const [amount, setAmount] = useState(0);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [contact, setContact] = useState(0);
    const [status, setStatus] = useState(false);
    const [trueContact, setTrueContact] = useState(true)
    const handleClose = () => {
        setStatus(false);
        setTrueContact(true)
    };

    //function for loading script tag with source src in frontend
    function loadScript(src) {
        return new Promise((resolve) => {
            const script = document.createElement('script')
            script.src = src
            script.onload = () => {
                resolve(true)
            }
            script.onerror = () => {
                resolve(false)
            }
            document.body.appendChild(script)
        })
    }

    // for displaying razorpay pop up
    async function displayRazorpay() {

        if (contact.toString().length === 10) {
            setTrueContact(true);
            // loading script with razorpay's given api for frontend for getting Razorpay object
            const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')
            if (!res) {
                alert('Razorpay SDK failed to load. Are you online?')
                return
            }

            //getting orderid from backend
            const data = await fetch('https://mypay-production.up.railway.app/razorpay/' + amount.toString(), {method: 'POST'}).then((t) =>
                t.json()
            )

            const options = {
                "key": "rzp_test_aqRrSZmCJ6Z4pC", // Enter the Key ID generated from the Dashboard
                "amount": data.amount.toString(), // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paisa
                "currency": data.currency,
                "name": "MyPay",
                "description": "Test Transaction",
                "image": "https://mypay-production.up.railway.app/razorpay/logo.svg",
                "order_id": data.id,
                "handler": async function (response) {

                    console.log(response)
                    setStatus(true);


                },
                "prefill": {
                    "name": name,
                    "email": email,
                    "contact": "" + contact
                },
                "notes": {
                    "address": "MyPay Corporate Office"
                },
                "theme": {
                    "color": "#3399cc"
                }
            }
            const paymentObject = new window.Razorpay(options)
            paymentObject.open()
        } else {
            setTrueContact(false);
        }


    }
// Creating React Form
    return (
        <div className="App">
            <header className="App-header">
                <form>
                    <table>
                        <tr>
                            <td>
                                <label>Enter your Name:<span/>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </label>
                            </td>
                        </tr>
                        <tr>
                            <td><label>Enter your Email:<span/>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </label></td>
                        </tr>
                        <tr>
                            <td><label>Enter your Amount:<span/>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </label></td>
                        </tr>
                        <tr>
                            <td><label>Enter your contact:<span/>
                                <input
                                    type="number"
                                    value={contact}
                                    onChange={(e) => setContact(e.target.value)}
                                />
                            </label></td>
                        </tr>
                    </table>
                    <br/>

                    <Button sx={{
                        bgcolor: '#61dafb',
                        boxShadow: 1,
                        borderRadius: 2,
                        p: 2,
                        fontSize:'1.2rem',
                        minWidth: 200,
                    }} variant="contained" onClick={displayRazorpay}>Pay</Button>

                </form>

            </header>

            <Snackbar open={status} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{width: '100%'}}>
                    Transaction completed
                </Alert>
            </Snackbar>
            <Snackbar open={!trueContact} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{width: '100%'}}>
                    Contact was wrong
                </Alert>
            </Snackbar>
        </div>
    );
}

export default App;
