// backend/routes/user.js
const express = require('express');

const router = express.Router();
const zod = require("zod");
const { User } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const  { authMiddleware } = require("../middleware");

// const signupBody = zod.object({
//     username: zod.string().email(),
// 	firstName: zod.string(),
// 	lastName: zod.string(),
// 	password: zod.string()
// })
const signupBody = zod.object({
    username: zod.string().email({ message: "Invalid email address" }),
    firstName: zod.string().min(1, { message: "First name is required" }),
    lastName: zod.string().min(1, { message: "Last name is required" }),
    password: zod.string().min(6, { message: "Password must be at least 6 characters long" })
});


// router.post("/signup", async (req, res) => {
//     const { success } = signupBody.safeParse(req.body)
//     if (!success) {
//         return res.status(411).json({
//             message: "Email already taken / Incorrect inputs"
//         })
//     }

//     const existingUser = await User.findOne({
//         username: req.body.username
//     })

//     if (existingUser) {
//         return res.status(411).json({
//             message: "Email already taken/Incorrect inputs"
//         })
//     }

//     const user = await User.create({
//         username: req.body.username,
//         password: req.body.password,
//         firstName: req.body.firstName,
//         lastName: req.body.lastName,
//     })
//     const userId = user._id;
//     const token = jwt.sign({
//         userId
//     }, JWT_SECRET);

//     res.json({
//         message: "User created successfully",
//         token: token,
//         firstName:user.firstName
//     })
// })

router.post("/signup", async (req, res) => {
    // 1. Validate the input
    const parseResult = signupBody.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({ // Use 400 for bad request
            message: "Incorrect inputs",
            errors: parseResult.error.flatten().fieldErrors, // Send detailed errors back
        });
    }

    try {
        // 2. Check if the user already exists
        const existingUser = await User.findOne({
            username: req.body.username
        });

        if (existingUser) {
            return res.status(409).json({ // Use 409 for conflict
                message: "An account with this email already exists."
            });
        }

        // 3. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // 4. Create the new user with the hashed password
        const user = await User.create({
            username: req.body.username,
            password: hashedPassword, // Store the hashed password
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        });

        // 5. Create a JWT token for the new user
        const userId = user._id;
        const token = jwt.sign({ userId }, JWT_SECRET);

        // 6. Send a success response
        res.status(201).json({ // Use 201 for resource created
            message: "User created successfully",
            token: token,
            firstName: user.firstName
        });

    } catch (error) {
        console.error("Signup Error:", error); // Log the actual error on the server
        return res.status(500).json({
            message: "An internal server error occurred. Please try again later."
        });
    }
});


const signinBody = zod.object({
    username: zod.string().email(),
	password: zod.string()
})

router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);
  
        res.json({
            token: token,
            firstName:user.firstName
        })
        return;
    }

    
    res.status(411).json({
        message: "Error while logging in"
    })
})

const updateBody = zod.object({
	password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

router.put("/update", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

    await User.updateOne({ _id: req.userId }, req.body);

    res.json({
        message: "Updated successfully"
    })
})

router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("firstName lastName username");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username
        });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});



module.exports = router;