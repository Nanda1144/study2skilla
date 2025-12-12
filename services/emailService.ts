import emailjs from '@emailjs/browser';

// ==============================================================================
// EMAIL CONFIGURATION
// ACTION REQUIRED: Replace the values below with your actual EmailJS credentials.
// ==============================================================================
const PUBLIC_KEY = "OJt1xcIBuKhJ7AbXA";
const SERVICE_ID = "service_hz6vn3i";
const TEMPLATE_ID = "template_flxwxd7";

// Initialize EmailJS
// We wrap this in a check to prevent errors if the key hasn't been set yet.
if (PUBLIC_KEY && PUBLIC_KEY !== "OJt1xcIBuKhJ7AbXA") {
    try {
        emailjs.init(PUBLIC_KEY);
    } catch (e) {
        console.warn("EmailJS init failed:", e);
    }
}

export const sendEmail = async (to: string, subject: string, body: string) => {
    // Fallback to simulation if credentials are not set
    if (PUBLIC_KEY === "OJt1xcIBuKhJ7AbXA" || SERVICE_ID === "service_hz6vn3i") {
        console.log(`[Email Simulation - Credentials Missing]`);
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Body: ${body}`);
        console.log(`%c[Tip] Go to services/emailService.ts to configure EmailJS keys.`, "color: yellow");
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        return true;
    }

    try {
        console.log(`[Email Service] Sending via EmailJS to ${to}...`);
        
        // Note: Ensure your EmailJS template variables match these keys:
        // {{to_email}}, {{subject}}, {{message}}
        const templateParams = {
            to_email: to,
            subject: subject,
            message: body,
        };

        const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
        console.log('Email sent successfully!', response.status, response.text);
        return true;
    } catch (error) {
        console.error('Failed to send email:', error);
        return false;
    }
};

export const sendOTP = async (identifier: string, otp: string, method: 'email' | 'phone' = 'email') => {
    const subject = "Your Verification Code - study2skills";
    const body = `Welcome to study2skills!\n\nYour verification code is: ${otp}\n\nThis code will expire in 10 minutes.`;
    
    // For phone, we still just alert in this demo, as EmailJS is primarily for emails.
    if (method === 'phone') {
        const msg = `[SMS Service]\nTo: ${identifier}\n\nYour OTP code is: ${otp}`;
        alert(msg);
        console.log(msg);
        await new Promise(resolve => setTimeout(resolve, 800));
        return true;
    }

    // For email, we use the integrated service
    // We also alert for convenience during development/demo
    alert(`[Email Sent to ${identifier}]\nSubject: ${subject}\nBody: ${body}`);
    
    return sendEmail(identifier, subject, body);
};

export const sendJobMatchNotification = async (email: string, jobTitle: string, company: string) => {
    const subject = `New Job Match: ${jobTitle} at ${company}`;
    const body = `We found a new job that matches your profile!\n\nRole: ${jobTitle}\nCompany: ${company}\n\nOur AI is currently analyzing this opportunity for you. Visit your Auto-Apply Hub to see details.`;
    return sendEmail(email, subject, body);
};

export const sendMentorshipConfirmation = async (email: string, mentorName: string) => {
    const subject = "Mentorship Request Sent";
    const body = `Your request to connect with ${mentorName} has been sent. We will notify you once they accept.`;
    return sendEmail(email, subject, body);
};

export const sendProgressUpdate = async (email: string, progress: number) => {
    const subject = "Weekly Progress Update";
    const body = `Great job! You have completed ${progress}% of your semester roadmap. Keep it up!`;
    return sendEmail(email, subject, body);
};