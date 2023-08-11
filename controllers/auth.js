const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const router = require('express').Router()
const multer = require('multer')
const path = require('path')
require('dotenv').config();
const transporter = require('../mails/mailConfig')
const crypto = require('crypto')


//Configuration du stockages des fichiers uploader
const storage = multer.diskStorage({
    destination : 'uploads/',
    filename : (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
})

const upload = multer({storage});

//Génération du mot de passe
function generateRandomPassword(){
    const lenght = 10;
    const charset = 'abcdefghijkimnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ012345689'
    let password = "";
    for (let i = 0; i < lenght; i++){
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset.charAt(randomIndex)
    }
    return password;
}


//Register User
router.post('/register', upload.single("image"), async(req, res)=> {
    try{

        const image = req.file;

        const {
            firstName,
            lastName,
            email,
            friends,
            location,
            occupation
        } = req.body;

        const salt = await bcrypt.genSalt(10)
        const generatePassword = generateRandomPassword();
        const passwordHash = await bcrypt.hash(generatePassword, salt)

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath: image ? image.path : null,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000),
            secretKey: crypto.randomBytes(32).toString('hex')
        })

        const savedUser = await newUser.save();
        res.status(201).json(savedUser)

        const mailOptions = {
            from : process.env.MAIL_USER,
            to : req.body.email,
            subject : 'Détails de votre compte',
            html : `<div>
                        <p>Votre compte a été crée avec succès.</p>
                        <p>Voici vos identifiant </p>
                        <p>Email : ${req.body.email}</p>
                        <p>Mot de passe : ${generatePassword}<p>            
                    </div>`
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error){
                console.error("Erreur lors de l'envoi de l'email", error)
            }
            else {
                console.log('E-mail envoyé:', info.response)
            }
        });

    }catch(err){
        res.status(500).json({err: err.message});
    }
})

//Login User

router.post('/login', async(req, res)=>{
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email: email});

        if(!user) return res.status(400).json({message: "User doesn't exist."});

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({message: "Invalid credentials."})

        const token = jwt.sign({ id: user._id}, user.secretKey);
        
        delete user.password
        res.status(200).json(
            {token, 
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            picturePath: user.picturePath,
            friends: user.friends,
            location: user.location,
            occupation: user.occupation,
            viewedProfile: user.viewedProfile,
            impressions: user.impressions
            }
            )

    }catch(err){
        res.status(500).json({err: err.message});
    }
})

  module.exports = router


