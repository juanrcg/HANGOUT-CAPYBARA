import React from "react";
import { jwtDecode } from "jwt-decode"; 

import AccountContext from "../Context/AccountContext"
import userPool from "./UserPool";
import { AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import {  CognitoUserAttribute } from "amazon-cognito-identity-js"

import { CognitoIdentityServiceProvider } from 'aws-sdk';
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const { CognitoUserPool } = AmazonCognitoIdentity;
const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider({ region: "us-east-1" });


const UserPoolId = "us-east-1_E4tHXcNqJ";
const ClientID = "2bbfea4ceslu5avrju1vc0d3e2";


AWS.config.update({
        
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    region: 'us-east-1',
   
});


const AccountState = (props) => {

    AWS.config.update({ region: 'us-east-1' });

 

    AWS.config.update({
        
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
        region: 'us-east-1',
       
    });


    const userPool = new CognitoUserPool({
        UserPoolId: UserPoolId,
        ClientId: ClientID,
        region: "us-east-1"
    });

    const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();




    const signout = async (attribute_insert, attribute_value) => {
        return await new Promise((resolve, reject) => {



            const user = userPool.getCurrentUser();

            if (user) {

                if (localStorage.getItem("cognito_id_token")) {
                    localStorage.removeItem("cognito_id_token");
                }
            
                if (localStorage.getItem("cognito_access_token")) {
                    localStorage.removeItem("cognito_access_token");
                }

                user.signOut();

                resolve();
                console.log("success")

            }

            else {

                reject();
                console.log("fail");

            }

        })

    }


    const handleConfirmUser = async (username,confirmationCode) => {
        const params = {
            ClientId: ClientID,
            Username: username,
            ConfirmationCode: confirmationCode,
        };

        try {
            await cognito.confirmSignUp(params).promise();
            alert("User confirmed successfully.");
        } catch (error) {
            console.error("Error confirming user:", error);
            alert("Error confirming user.");
        }
    };


    const updateUser = async (email,attribute_insert,attribute_value) => {
        return await new Promise((resolve, reject) => {

            const user = userPool.getCurrentUser();

            if (user) {

                user.getSession(async (err, session) => {

                    if (err) {

                        reject(err);
                    }
                        else {

                        if (attribute_insert == "password") {

                          

                          
                            const user = new CognitoUser({
                                Username: email,
                                Pool: userPool,



                            })

                            user.forgotPassword({

                                onSuccess: () => {
                                    console.log("success");
                                    alert("Data changed successful");
                                },
                                onFailure: () => {


                                    console.log("fail");

                                }


                            })  

                            



                        }

                        else {

                            const attributeList = [];
                            const toinsert_attribute = new CognitoUserAttribute({

                                Name: attribute_insert,
                                Value: attribute_value


                            });

                            attributeList.push(toinsert_attribute);

                            user.updateAttributes(attributeList, (err, result) => {

                                if (err) {
                                    console.log("fail", err);
                                } else {

                                    console.log("sucess", result);
                                    alert("Data changed successful");

                                }
                            })

                        }
                    
                    }



                })


            }
            else {

                reject();
            }


        })
    }


    const getSession = async () => {
        return new Promise((resolve, reject) => {
            const user = userPool.getCurrentUser();
    
            if (!user) {
            /*    const loginUrl = "https://hangiando.netlify.app/Login_User";
                const signUrl = "https://hangiando.netlify.app/SignUp_user";
              // Check if the current URL is neither the login page nor the sign-up page
    if (window.location.href !== loginUrl && window.location.href !== signUrl) {
        window.location.href = loginUrl; // Redirect to login if the user isn't on the login or sign-up page
    }
    */
                reject("No user found.");
                return;
            }
    
            user.getSession((err, session) => {
                if (err) {
                    console.error("Session error:", err.message);
                    reject("Failed to get session: " + err.message);
                    return;
                }
    
                if (session.isValid()) {
                  //  console.log("Returning valid session:", session);
    
                    // If session is valid, attempt to get stored attributes
                    user.getUserAttributes((err, attributes) => {
                        if (err) {
                            console.error("Error getting user attributes:", err.message);
                            reject("Failed to get user attributes: " + err.message);
                            return;
                        }
    
                        const results = {};
                        attributes.forEach(attribute => {
                            results[attribute.Name] = attribute.Value;
                        });
    
                      //  console.log("User attributes:", results);
                        resolve({ user, session, ...results }); // Ensures the format is always consistent
                    });
    
                    return;
                }
    
                // If session isn't valid, we fetch attributes as well (redundant case but ensures consistency)
                user.getUserAttributes((err, attributes) => {
                    if (err) {
                        console.error("Error getting user attributes:", err.message);
                        reject("Failed to get user attributes: " + err.message);
                        return;
                    }
    
                    const results = {};
                    attributes.forEach(attribute => {
                        results[attribute.Name] = attribute.Value;
                    });
    
                    console.log("User attributes:", results);
                    resolve({ user, session, ...results });
                });
            });
        });
    };
    


  
    
    const signup = async (email, passx) => {

        return await new Promise((resolve, reject) => {
            const attributeList = [];




            let UserName = {

                Name: "email",
                Value: email

            }

            attributeList.push(UserName);
            userPool.signUp(email, passx, attributeList, null, (err, data) => {

                if (err) {
                    console.log("failed", err.message);

                    document.getElementById("password_label").innerHTML = err.message;
                    reject();
                } else {

                    console.log("Success", data);
                    resolve();
                }


            })
        })

    }


   const login = async  (username, password) => {
        const userPool = new CognitoUserPool({
            UserPoolId: UserPoolId,
            ClientId: ClientID 
        });
        const authenticationData = {
            Username: username,
            Password: password
        };

        const user = new CognitoUser({ Username: username, Pool: userPool });
        const authenticationDetails = new AuthenticationDetails(authenticationData);

       return await new Promise((resolve, reject) => (
            user.authenticateUser(authenticationDetails, {
                onSuccess: (result) => resolve(result),
                onFailure: (err) => reject(err),
            })
        ));
    }







    const verify = async (userx,code) => {

        return await new Promise((resolve, reject) => {

            const usera = new CognitoUser({
                Username: userx,
                Pool: userPool,





            })

            usera.confirmRegistration(code, true, (err, data) => {

                if (err) {
                    console.log("failed", err.message);
                    reject();
                } else {

                    console.log("Success", data);
                    resolve();
                }


           

            })
        })

    }

   
    


    const authenticate = async (Usern, password) => {
    

      
       
        return await new Promise((resolve, reject) => {

          

            const usera = new CognitoUser({
                Username: Usern,
                Pool: userPool,
             

                
                
               
            })


           

          
            const authDetails = new AuthenticationDetails({

                Username: Usern,
                password
             
            })

            usera.authenticateUser(authDetails, {
                onSuccess: (data) => {

                    console.log("success", data);
                    resolve(data);


                },
                onFailure: (err) => {

                    console.log("fail");
                    reject(err);

                },

                newPasswordRequired: (data) => {
                    console.log("new pass required", data)
                    resolve(data);
                }
            })
        })
    }

    const fetchAttributeValue = async (attribute) => {
        const user = userPool.getCurrentUser();
    
        if (!user) {
            throw new Error('User is not authenticated. Please log in.');
        }
    
        // Check if the session is valid
        try {
            const session = await new Promise((resolve, reject) => {
                user.getSession((err, session) => {
                    if (err) reject(err);
                    else resolve(session);
                });
            });
    
            if (!session.isValid()) {
                throw new Error('Session is invalid or expired.');
            }
    
            // If session is valid, proceed to fetch attributes
            const attributes = await new Promise((resolve, reject) => {
                user.getUserAttributes((err, attrs) => {
                    if (err) reject(err);
                    else resolve(attrs);
                });
            });
    
            // Search for the attribute
            const attr = attributes.find((attr) => attr.Name === attribute);
    
            if (attr) {
                return attr.Value;
            } else {
                throw new Error(`Attribute "${attribute}" not found.`);
            }
    
        } catch (err) {
            // Catch any session or attribute fetching errors
            throw new Error(`Error fetching attribute: ${err.message}`);
        }
    };

    const CLIENT_ID = ClientID; // Your Cognito User Pool App Client ID
    const REDIRECT_URI = "https://hangiando.netlify.app/feed"; // Your redirect URI
    const DOMAIN = "us-east-1e4thxcnqj.auth.us-east-1.amazoncognito.com"; // Cognito domain
    const REGION = "us-east-1";

    const handleGoogleSignIn = () => {
        const url = `https://${DOMAIN}/oauth2/authorize?identity_provider=Google&response_type=token&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=email+openid+profile+aws.cognito.signin.user.admin`;
        window.location.href = url; // Redirect the user to Google sign-in page
    };
    
  

  // Step 2: Handle the redirect and get tokens
async function handleRedirect() {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace("#", "?"));
    const idToken = params.get("id_token");
    const accessToken = params.get("access_token");

    if (idToken && accessToken) {
        console.log("Google ID Token:", idToken);
        console.log("Google Access Token:", accessToken);

        // Store tokens securely
        localStorage.setItem("cognito_id_token", idToken);
        localStorage.setItem("cognito_access_token", accessToken);

        // Register federated user with Cognito User Pool
        registerFederatedUser(idToken);
    } else {
        console.error("Tokens not found in URL.");
    }
}

// Step 3: Register federated user with Cognito User Pool
async function registerFederatedUser(idToken) {
    // Extract email from the ID token (Google users are identified by email)
    const payload = JSON.parse(atob(idToken.split(".")[1]));
    const username = payload.email;

    // Create a CognitoUser instance
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
        Username: username,
        Pool: userPool // Your Cognito User Pool
    });

    // Manually create the Cognito session
    const session = new AmazonCognitoIdentity.CognitoUserSession({
        IdToken: new AmazonCognitoIdentity.CognitoIdToken({ IdToken: idToken }),
        AccessToken: new AmazonCognitoIdentity.CognitoAccessToken({ AccessToken: localStorage.getItem("cognito_access_token") }),
        RefreshToken: new AmazonCognitoIdentity.CognitoRefreshToken({ RefreshToken: "" }) // Federated users don't have refresh tokens
    });

    // Set the session for the Cognito user
    cognitoUser.setSignInUserSession(session);

    console.log("Google user session set successfully in Cognito.");

    // You can now get user attributes and other session data here
    cognitoUser.getUserAttributes((err, attributes) => {
        if (err) {
            console.error("Error getting user attributes:", err.message);
        } else {
            console.log("User attributes:", attributes);
        }
    });

    return session;
}

// Step 4: Check for URL hash and handle the redirect
if (window.location.hash) {
    handleRedirect();
}



        return (

            <AccountContext.Provider value={{ signup, signout, authenticate, verify, login, getSession, updateUser, fetchAttributeValue, userPool, cognitoIdentityServiceProvider, handleConfirmUser,handleGoogleSignIn,registerFederatedUser, handleRedirect }} >
                {props.children}

            </AccountContext.Provider>




        )
    
}

export default AccountState;

