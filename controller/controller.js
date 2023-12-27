
require('dotenv').config();
const app = require('express')();
const express = require("express");

const Web3 = require('web3');
const web3 = new Web3(process.env.RPC_URL);
// mongodb user model
const { User, Verification, Issues } = require("../config/schema");

const { sendEmail, generateAccount, generateOTP } = require('../models/tasks');

// Password handler
const bcrypt = require("bcrypt");


// Signup
const signup = async (req, res) => {
  let { name, organization, email, password } = req.body;
  
  const accountDetails = await generateAccount();
  name = name.trim();
  organization = organization.trim();
  email = email.trim();
  password = password.trim();
  id = accountDetails;
  approved = false;

  if (name == "" || organization == "" || email == "" || password == "") {
    res.json({
      status: "FAILED",
      message: "Empty input fields!",
    });
  } else if (!/^[a-zA-Z ]*$/.test(name)) {
    res.json({
      status: "FAILED",
      message: "Invalid name entered",
    });
  } else if (!/^[a-zA-Z ]*$/.test(organization)) {
    res.json({
      status: "FAILED",
      message: "Invalid organization entered",
    });
  } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    res.json({
      status: "FAILED",
      message: "Invalid email entered",
    });
  } else if (password.length < 8) {
    res.json({
      status: "FAILED",
      message: "Password is too short!",
    });
  } else {
    try {
      // Checking if user already exists
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        res.json({
          status: "FAILED",
          message: "User with the provided email already exists",
        });
        return; // Stop execution if user already exists
      }

      // generate OTP and sending to the email
      const generatedOtp = generateOTP();
      sendEmail(generatedOtp, email);

      // Save verification details
      const newVerification = new Verification({
        email,
        code: generatedOtp,
        verified: false,
      });

      const savedVerification = await newVerification.save();

      // password handling
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Save new user
      const newUser = new User({
        name,
        organization,
        email,
        password: hashedPassword,
        id, // Assuming you want to link the user to the verification entry
        approved: false,
      });

      const savedUser = await newUser.save();

      res.json({
        status: "SUCCESS",
        message: "Signup successful",
        data: savedUser,
      });
    } catch (error) {
      res.json({
        status: "FAILED",
        message: "An error occurred",
      });
    }  
  }
};

// Login
const login = async (req, res) => {
  let { email, password } = req.body;
  email = email.trim();
  password = password.trim();

  const verify = await Verification.findOne({ email });
  const generatedOtp = generateOTP();

  if (email == "" || password == "") {
    res.json({
      status: "FAILED",
      message: "Empty credentials supplied",
    });
  } else {
    // Checking if user exists  
    User.find({ email })
      .then((data) => {
        if (data.length && data[0].approved == true) {
          // User exists
          const hashedPassword = data[0].password;
          bcrypt
            .compare(password, hashedPassword)
            .then((result) => {
              if (result) {
                 // generate OTP and sending to the email
                sendEmail(generatedOtp, email);

                // Save verification details
                verify.code = generatedOtp;
                verify.save();

                // Password match
                res.json({
                  status: "SUCCESS",
                  message: "Valid User Credentials",
                });
              } else {
                res.json({
                  status: "FAILED",
                  message: "Invalid password entered!",
                });
              }
            })
            .catch((err) => {
              res.json({
                status: "FAILED",
                message: "An error occurred while comparing passwords",
              });
            });
          
        } else {
          res.json({
            status: "FAILED",
            message: "Invalid credentials entered! (or) User not approved!",
          });
        }
      })
      .catch((err) => {
        res.json({
          status: "FAILED",
          message: "An error occurred while checking for existing user",
        });
      });
  }
};


const verifyIssuer = async (req, res) => {
  let { email, code } = req.body;
  try {
    const verify = await Verification.findOne({ email });

    Verification.find({ email })
      .then((result) => {
        if (result.length && verify.code == code) {
          // A email already exists
          res.json({
                status: "PASSED",
                message: "Verification successful",
          });
          
          if(verify.verified == false) {
            verify.verified = true;
            verify.save();
          }
        } else {
          res.json({
            status: "FAILED",
            message: "Verification failed",
          });
         }
      })
      .catch((err) => {
        res.json({
          status: "FAILED",
          message: "An error occurred while checking for OTP",
        });
      });
    
    } catch (error) {
    res.json({
      status: 'FAILED',
      message: 'An error occurred during the verification!',
    });
  }
};

const forgotPassword = async (req, res) => {
  let { email } = req.body;
  const verify = await Verification.findOne({ email });
  const generatedOtp = generateOTP();
  try {
    const user = await User.findOne({ email });

    if (!verify || !user || !user.approved) {
      return res.json({
        status: 'FAILED',
        message: 'User not found (or) User not approved!',
      });
    }
    // password handling
    sendEmail(generatedOtp, email);

    // Save verification details
    verify.code = generatedOtp;
    verify.save();

    return res.json({
        status: 'PASSED',
        message: 'User found!',
      });

  } catch (error) {
    res.json({
      status: 'FAILED',
      message: 'An error occurred during password reset process!',
    });
  }
};

const resetPassword = async (req, res) => {
  let { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user || !user.approved) {
      return res.json({
        status: 'FAILED',
        message: 'User not found (or) User not approved!',
      });
    }
    // password handling
    const saltRounds = 10;
            bcrypt
              .hash(password, saltRounds)
              .then((hashedPassword) => {
                user.password = hashedPassword;
                user
                  .save()
                  .then(() => {
                    res.json({
                      status: "SUCCESS",
                      message: "Password reset successful"
                    });
                  })
                  .catch((err) => {
                    res.json({
                      status: "FAILED",
                      message: "An error occurred while saving user account!",
                    });
                  });
              })
              .catch((err) => {
                res.json({
                  status: "FAILED",
                  message: "An error occurred while hashing password!",
                });
              });

  } catch (error) {
    res.json({
      status: 'FAILED',
      message: 'An error occurred during password reset process!',
    });
  }
};

const issueCertificate = async (req, res) => {
  let { email, transactionHash, certificateHash, certificateNumber, name, course, grantDate, expirationDate} = req.body;
  
  if (email == "" || name == "" || transactionHash == "" || certificateHash == "" || certificateNumber == "" || course == "" || grantDate == "" || expirationDate == "") {
      res.json({
        status: "FAILED",
        message: "Empty input fields!",
      });
    } else {
    try {
      // Checking if user already exists
      const user = await User.findOne({ email });
      const issues = await Issues.findOne({ certificateNumber });

      if (user && user.approved && !issues) {
          // Save new user
          const newIssues = new Issues({
            id: user.id,
            organization: user.organization,
            transactionHash,
            certificateHash,
            certificateNumber,
            name: name,
            course: course,
            grantDate: grantDate,
            expirationDate: expirationDate,
            issueDate: new Date(),
          });

          const savedIssues = await newIssues.save();

          res.json({
            status: "SUCCESS",
            message: "Certificate Issued successful",
            data: savedIssues,
          });
        } else {
          res.json({
            status: "FAILED",
            message: "Certificate Issued with Number (or) User not approved!",
          });
        }

    } catch (error) {
      res.json({
        status: "FAILED",
        message: "An error occurred during the certificate issuance!",
      });
    }  
  }
};


module.exports = {
    signup,
    login,
    forgotPassword,
    resetPassword,
    verifyIssuer,
    issueCertificate
}

