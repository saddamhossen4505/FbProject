

const nodemailer = require('nodemailer');


// Create Send_Mail function.
const resetPasswordMail = async ( to, data ) => {

    try {
        
        // Create Transport.
        const transport = nodemailer.createTransport({
            host : process.env.MAIL_HOST,
            port : process.env.MAIL_PORT,
            auth : {
                user : process.env.MAIL_ID,
                pass : process.env.MAIL_PASS
            }
        });

        await transport.sendMail({

            from : `Instagram <${process.env.MAIL_ID}>`,
            to : to,
            subject : 'Reset Password',
            html : `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Email</title>
            
                <style>
                    *{
                        margin: 0px;
                        padding: 0px;
                    }
                    ul{
                        margin: 0px;
                        padding: 0px;
                    }
                    li{
                        list-style: none;
                    }
                    a{
                        text-decoration: none;
                    }
                    .main_wrapper{
                        background-color: #e9e9e9;
                        height: 100vh;
                        overflow: hidden;
                    }
                    .wrapper{
                        background-color: #fff;
                        width: 500px;
                        height: auto;
                        margin: 0px auto;
                        margin: 30px auto;
                    }
                    .top_header{
                        text-align: center;
                        padding: 10px 0;
                        color: blue;
                    }
                    .top_header span{
                        color: blue;
                    }
                    .header{
                        background-color: blue;
                        text-align: center;
                        color: #fff;
                        padding: 15px 0;
                    }
            
                    .content{
                        padding: 20px 15px;
                        text-align: center;
                    }
            
                    .content h3{
                        padding: 10px 0;
                    }
                    .content p{
                        font-size: 16px;
                        margin-bottom: 20px;
                        font-family: sans-serif;
                    }
            
                    .content a {
                        background-color: red;
                        color: #fff;
                        padding: 10px 30px;
                        display: inline-block;
                        margin-bottom: 10px;
                    }
            
                    .info{
                        background-color: rgb(200, 200, 245);
                        padding: 20px 0;
                        text-align: center;
                    }
            
                    .info span{
                        font-size: 18px;
                        margin-bottom: 10px;
                    }
            
                    .info .social ul{
                        display: flex;
                        margin-left: 170px;
                        margin-top: 20px;
                    }
                    .info .social ul li a img {
                        width: 40px;
                        height: 40px;
                        border-radius: 3px;
                        margin-right: 10px;
                    }
                    .info p{
                        padding-top: 15px;
                    }
                    .footer{
                        background-color: blue;
                        padding: 20px 0;
                        color: #fff;
                        text-align: center;
                    }
            
                </style>
            
            </head>
            <body>
                
            
                <div class="main_wrapper">
                    <div class="wrapper">
                        <div class="top_header">
                            <a href=""><h3>www.developersaddam <span>.com</span></h3></a>
                        </div>
                        <div class="header">
                            <img src="https://cdn-icons-png.flaticon.com/128/3062/3062634.png" alt="">
                            <p>Thanks for with us.</p>
                            <h2>Verify Your E-mail Address.</h2>
                        </div>
                        <div class="content">
                            <p>Please verify your mail and reset password.</p>
                            <a href="${data.link}">Verify-Now</a>
                        </div>
                        <div class="info">
                            <span>Accout-Info</span>
                            <p>Your Cell-No: 01779911902 </p>
                            <div class="social">
                                <ul>
                                    <li><a href="#"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnS0-NZh9u9VWIAPmRAEju8m4k4XiW29aE3GAlS9z6kg&s" alt=""></a></li>
                                    <li><a href="#"><img src="https://static.vecteezy.com/system/resources/thumbnails/006/057/998/small/twitter-logo-on-transparent-background-free-vector.jpg" alt=""></a></li>
                                    <li><a href="#"><img src="https://cdn5.vectorstock.com/i/thumb-large/99/09/linkedin-social-media-icon-design-template-vector-22339909.jpg" alt=""></a></li>
                                </ul>
                            </div>
                        </div>
                        <div class="footer">
                            <p>&copy; Don't Avoid Tearms and Conditions.</p>
                        </div>
                    </div>
                </div>
            
            
            
            </body>
            </html>`

        });

    } catch (error) {
        console.log(error.message);
    }

};


// Exports-mailSend.
module.exports = resetPasswordMail;