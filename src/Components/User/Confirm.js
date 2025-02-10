import React, { Component, useEffect, useState, useContext } from 'react';
import AccountContext from '../../Context/AccountContext';
import AccountState from '../../States/AccountState';
import Header from '../header';
import Footer from '../footer';

function Confirm() {


    const [code, setCode] = useState("");

    const { handleConfirmUser } = useContext(AccountContext);


    useEffect(() => {

        getSession()
            .then(session => {
                window.location.href = '/feed';
            })
            .catch(err => {

                console.log(err);
            })


        document.addEventListener('keydown', handleKeyDown);

        // Cleanup event listener on component unmount
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };

    }, [code])

    const handleKeyDown = (event) => {

        if (event.key === 'Enter' || event.keyCode === 13) {
            event.preventDefault();
            handleConfir(event);
        }


    }



    const handleConfir = (event) => {

        event.preventDefault();
        handleConfirmUser(code)
            .then(data => {
                console.log("success", data);
                window.location.href = '/Login_User';
            })
            .catch(err => {



                console.log("fail", err);

            })

    }







    return (


        <>

            <Header></Header>
            <div className="all">

                <div className="inner">
                    <form action=''>


                        <div className="form-wrapper">





                            <button id="google" value={google} onChange={(event) => setGoogle(event.target.value)} placeholder="" type="text" >Set up With Google</button>
                        </div>

                        <div className="separator">
                            <span> OR </span>

                        </div>

                        <div className="form-wrapper">

                            <input id="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" type="text" class="form-control"></input>





                            <div className="">

                                <input id="password" value={password} onChange={(event) => setPass(event.target.value)} placeholder="Password" type="text" class="form-control" ></input>
                                <span className="error_handler_label" id="password_label"> </span>
                            </div>


                        </div>


                        <div >

                            <button onClick={handleRegistration}  > Create an Account</button>

                        </div>
                        <a> By creating an account you are accepting our <span className="policy">Policy</span></a>

                    </form>
                </div>
            </div>






            <div>

            </div>

            <Footer></Footer>
        </>









    )


}
export default Confirm;