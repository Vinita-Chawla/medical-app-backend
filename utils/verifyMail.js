const nodemailer = require("nodemailer");

const verfiyMail = async(email,link,subject)=>{
    try{
        const transporter = nodemailer.createTransport({
            service:process.env.SERVICE,
            host: process.env.HOST,
            auth:{
                user:process.env.USER,
                pass:process.env.PASSWORD
            },
            port:Number(process.env.EMAIL_PORT),
            secure:Boolean(process.env.SECURE),
        })
        await transporter.sendMail({
            from:process.env.USER,    //sender email
            to:email,                 //receiver email
            subject:subject,
            text:"Welcome",
            html:`
            <div>
            <p>Hello</p>
            </br>
            <p>Follow this link to ${subject}</p>
            <a href=${link}>${link}</a>
            </div>
            `
        })
        console.log("Email Sent Successfully")
    }
    catch(err){
        console.log("Email failed to Sent")
        console.log(err)
    }
}

module.exports =  verfiyMail;