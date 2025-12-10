
// A simulated Email Service

export const sendEmail = async (to: string, subject: string, body: string) => {
    console.log(`[Email Service] Sending to ${to}...`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // In a real app, this would make an API call to SendGrid/AWS SES
    console.log(`
      ----------------------------------------------------
      FROM: no-reply@study2skills.com
      TO: ${to}
      SUBJECT: ${subject}
      BODY:
      ${body}
      ----------------------------------------------------
    `);

    return true;
};

export const sendOTP = async (identifier: string, otp: string, method: 'email' | 'phone' = 'email') => {
    const subject = "Your Verification Code - study2skills";
    const body = `Welcome to study2skills!\n\nYour verification code is: ${otp}\n\nThis code will expire in 10 minutes.`;
    
    // For demo purposes, we alert the OTP so the user can actually "receive" it
    const msg = `[DEMO ${method === 'phone' ? 'SMS' : 'EMAIL'}]\nTo: ${identifier}\n\nYour OTP code is: ${otp}`;
    alert(msg);
    
    if (method === 'phone') {
        console.log(`[SMS Service] Sending to ${identifier}...`);
        await new Promise(resolve => setTimeout(resolve, 800));
        return true;
    }

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