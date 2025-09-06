// Test Email Configuration
// Run this locally to test your email settings before deployment

const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmail() {
    console.log('🧪 Testing email configuration...');
    
    // Create transporter
    const transporter = nodemailer.createTransporter({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // Test connection
    try {
        await transporter.verify();
        console.log('✅ Email server connection successful!');
        
        // Send test email
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: process.env.EMAIL_USER, // Send to yourself for testing
            subject: 'Wellness Bot - Email Test',
            text: 'If you receive this email, your email configuration is working correctly!',
            html: `
                <h2>🎉 Email Configuration Test Successful!</h2>
                <p>Your Wellness Bot email setup is working correctly.</p>
                <p><strong>Configuration details:</strong></p>
                <ul>
                    <li>Host: ${process.env.EMAIL_HOST}</li>
                    <li>Port: ${process.env.EMAIL_PORT}</li>
                    <li>User: ${process.env.EMAIL_USER}</li>
                    <li>From: ${process.env.EMAIL_FROM}</li>
                </ul>
                <p>You're ready for deployment! 🚀</p>
            `
        });

        console.log('✅ Test email sent successfully!');
        console.log('📧 Message ID:', info.messageId);
        console.log('📬 Check your inbox for the test email');
        
    } catch (error) {
        console.error('❌ Email configuration error:');
        console.error(error.message);
        
        // Common error solutions
        if (error.code === 'EAUTH') {
            console.log('\n💡 Authentication failed. Check:');
            console.log('   - EMAIL_USER is correct');
            console.log('   - EMAIL_PASS is an app password (not regular password)');
            console.log('   - 2FA is enabled on Gmail');
        }
        
        if (error.code === 'ECONNECTION') {
            console.log('\n💡 Connection failed. Check:');
            console.log('   - EMAIL_HOST is correct');
            console.log('   - EMAIL_PORT is correct');
            console.log('   - Internet connection is working');
        }
    }
}

// Run the test
testEmail();
