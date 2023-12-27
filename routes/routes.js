const express = require('express');
const router = express.Router();
const tasksController = require('../controller/controller');

/**
 * @openapi
 * /api/signup:
 *   post:
 *     summary: Create a new user account
 *     tags: [Signup]
 *     description: Create a new user account with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's name
 *               organization:
 *                 type: string
 *                 description: User's organization
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 description: User's password (at least 8 characters long)
 *             required:
 *               - name
 *               - organization
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: Successful user registration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the operation
 *                 message:
 *                   type: string
 *                   description: A message describing the result of the operation
 *                 data:
 *                   type: object
 *                   description: Information about the registered user
 *
 *       '400':
 *         description: Bad request (e.g., empty input fields, invalid email, short password)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the operation
 *                 message:
 *                   type: string
 *                   description: A message describing the error
 *
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the operation
 *                 message:
 *                   type: string
 *                   description: A message describing the error
 */

router.post('/signup', tasksController.signup);

/**
 * @openapi
 * /api/login:
 *   post:
 *     summary: User Login
 *     tags: [Login]
 *     description: |
 *       Logs in a user with the provided email and password. Generates and sends an OTP for verification.
 *
 *     requestBody:
 *       description: User email and password
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 description: User's password
 *
 *     responses:
 *       '200':
 *         description: Login successful, OTP sent for verification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the operation
 *                 message:
 *                   type: string
 *                   description: A message describing the result of the operation
 *
 *       '400':
 *         description: Bad request (e.g., missing or invalid parameters)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the operation
 *                 message:
 *                   type: string
 *                   description: A message describing the error
 *
 *       '401':
 *         description: Unauthorized (e.g., invalid credentials)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the operation
 *                 message:
 *                   type: string
 *                   description: A message describing the error
 *
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the operation
 *                 message:
 *                   type: string
 *                   description: A message describing the error
 */

router.post('/login', tasksController.login);

/**
 * @openapi
 * /api/forgot-password:
 *   post:
 *     summary: Forgot Password
 *     tags: [Forgot Password]
 *     description: |
 *       Initiates the password reset process by sending an OTP to the user's email.
 *
 *     requestBody:
 *       description: User email
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *
 *     responses:
 *       '200':
 *         description: Password reset initiated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the operation
 *                 message:
 *                   type: string
 *                   description: A message describing the result of the operation
 *
 *       '400':
 *         description: Bad request (e.g., missing or invalid parameters)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the operation
 *                 message:
 *                   type: string
 *                   description: A message describing the error
 *
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the operation
 *                 message:
 *                   type: string
 *                   description: A message describing the error
 */

router.post('/forgot-password', tasksController.forgotPassword);

/**
 * @openapi
 * /api/reset-password:
 *   post:
 *     summary: Reset Password
 *     tags: [Reset Password]
 *     description: |
 *       Resets the user's password with the provided email and new password.
 *
 *     requestBody:
 *       description: User email and new password
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 description: New password for the user
 *
 *     responses:
 *       '200':
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the operation
 *                 message:
 *                   type: string
 *                   description: A message describing the result of the operation
 *
 *       '400':
 *         description: Bad request (e.g., missing or invalid parameters)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the operation
 *                 message:
 *                   type: string
 *                   description: A message describing the error
 *
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the operation
 *                 message:
 *                   type: string
 *                   description: A message describing the error
 */

router.post('/reset-password', tasksController.resetPassword);

/**
 * @swagger
 * /api/verify-issuer:
 *   post:
 *     summary: Verify issuer with email and code
 *     tags: [2 Factor Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               code:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Verification successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: PASSED
 *                 message:
 *                   type: string
 *                   example: Verification successful
 *       400:
 *         description: Bad Request - Invalid email or code
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: FAILED
 *                 message:
 *                   type: string
 *                   example: Verification failed
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: FAILED
 *                 message:
 *                   type: string
 *                   example: An error occurred during the verification
 */

router.post('/verify-issuer', tasksController.verifyIssuer);

/**
 * @swagger
 * /api/issue-certificate:
 *   post:
 *     summary: Issue a certificate
 *     tags: [Issue Certificate]
 *     description: Issue a certificate for a user.
 *     parameters:
 *       - in: body
 *         name: certificateDetails
 *         description: Certificate details
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             transactionHash:
 *               type: string
 *             certificateHash:
 *               type: string
 *             certificateNumber:
 *               type: string
 *             name:
 *               type: string
 *             course:
 *               type: string
 *             grantDate:
 *               type: string
 *             expirationDate:
 *               type: string
 *     responses:
 *       200:
 *         description: Certificate issued successfully
 *         content:
 *           application/json:
 *             example:
 *               status: SUCCESS
 *               message: Certificate Issued successful
 *               data:
 *                 id: "user_id"
 *                 organization: "user_organization"
 *                 transactionHash: "transaction_hash"
 *                 certificateHash: "certificate_hash"
 *                 certificateNumber: "certificate_number"
 *                 name: "user_name"
 *                 course: "course_name"
 *                 grantDate: "grant_date"
 *                 expirationDate: "expiration_date"
 *                 issueDate: "issue_date"
 *       400:
 *         description: Invalid input fields
 *         content:
 *           application/json:
 *             example:
 *               status: FAILED
 *               message: Empty input fields!
 *       404:
 *         description: Certificate already issued or user not approved
 *         content:
 *           application/json:
 *             example:
 *               status: FAILED
 *               message: Certificate Issued with Number (or) User not approved!
 *       500:
 *         description: An error occurred during the certificate issuance
 *         content:
 *           application/json:
 *             example:
 *               status: FAILED
 *               message: An error occurred during the certificate issuance!
 */

router.post('/issue-certificate', tasksController.issueCertificate);

module.exports=router;