// import emailjs from '@emailjs/browser';

// Initialize EmailJS with your public key
// emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

interface SupportFormData {
  name: string;
  description: string;
}

export const EmailService = {
  async sendSupportEmail(formData: SupportFormData): Promise<void> {
    try {
      // TODO: Implement email sending functionality
      console.log('Support form submission:', formData);
      
      // Example of how it would work with EmailJS:
      /*
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name || 'Anonymous User',
          message: formData.description,
          to_name: 'MA₿',
          reply_to: 'stacktrackhelp@codebymab.aleeas.com',
        }
      );
      */
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new Error('Failed to send support email');
    }
  }
}; 