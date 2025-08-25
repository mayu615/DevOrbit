// modules/messages/aiMessage.service.js
import { sendMessageDB } from "./message.service.js";

/**
 * AI Response Generator for Job-related Queries
 */
export class AIMessageService {
  constructor() {
    this.jobKeywords = [
      'job', 'career', 'position', 'role', 'salary', 'interview', 'skills',
      'experience', 'qualification', 'hire', 'employment', 'work', 'company',
      'application', 'resume', 'cv', 'portfolio', 'opening', 'vacancy',
      'opportunity', 'benefits', 'training', 'promotion', 'internship'
    ];

    this.jobResponses = {
      greeting: [
        "Hello! I'm here to help you with your career journey. What specific role or opportunity interests you?",
        "Hi there! I'd be happy to assist you with job-related inquiries. How can I help you today?",
        "Welcome! I specialize in career guidance and job opportunities. What would you like to know?"
      ],
      
      salary: [
        "Salary ranges vary based on experience, location, and specific skills. Could you tell me more about the position you're interested in?",
        "I'd be happy to discuss compensation. What role and experience level are you considering?",
        "Salary depends on several factors. Let me help you understand the market rates for your target position."
      ],
      
      interview: [
        "Great question about interviews! I can help you prepare. What type of role are you interviewing for?",
        "Interview preparation is crucial for success. Would you like tips for technical, behavioral, or general interview questions?",
        "I'd be happy to help you ace your interview! What specific aspects would you like to focus on?"
      ],
      
      skills: [
        "Skills are key to career growth! What field or role are you looking to develop skills for?",
        "I can guide you on relevant skills for your career path. Which industry or position interests you?",
        "Building the right skillset is important. Tell me about your career goals and I'll suggest relevant skills."
      ],
      
      general: [
        "That's a great career-focused question! Let me help you find the right information and guidance.",
        "I'd be happy to assist with that job-related inquiry. Could you provide a bit more context?",
        "Excellent question about your career journey! How can I best support your professional goals?",
        "I'm here to help with your career development. What specific guidance are you looking for?",
        "That's an important career consideration. Let me provide you with relevant insights and advice."
      ],
      
      application: [
        "Application process questions are important! Which company or position are you applying for?",
        "I can guide you through the application process. What stage are you currently at?",
        "Great that you're taking action on your career! What specific application help do you need?"
      ],
      
      experience: [
        "Experience is valuable in any career path. What type of experience are you looking to gain or highlight?",
        "I can help you leverage your experience effectively. What roles or industries are you targeting?",
        "Your experience matters! How can I help you showcase it for your career goals?"
      ]
    };

    this.rejectionMessages = [
      "I can only assist with job and career-related inquiries. Please ask about positions, interviews, skills, or other professional topics.",
      "I specialize in career guidance and job opportunities. Could you please ask something related to your professional development?",
      "I'm designed to help with employment-related questions. Please share your career or job-related concerns.",
      "For the best assistance, please ask about job opportunities, career advice, or professional development topics.",
      "I focus on career and employment topics. What job-related question can I help you with today?"
    ];
  }

  /**
   * Analyze message content and determine if it's job-related
   */
  isJobRelated(message) {
    const lowerMessage = message.toLowerCase();
    return this.jobKeywords.some(keyword => lowerMessage.includes(keyword));
  }

  /**
   * Determine the category of job-related query
   */
  categorizeQuery(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('salary') || lowerMessage.includes('pay') || lowerMessage.includes('compensation')) {
      return 'salary';
    }
    
    if (lowerMessage.includes('interview') || lowerMessage.includes('meeting') || lowerMessage.includes('discuss')) {
      return 'interview';
    }
    
    if (lowerMessage.includes('skill') || lowerMessage.includes('qualification') || lowerMessage.includes('requirement')) {
      return 'skills';
    }
    
    if (lowerMessage.includes('apply') || lowerMessage.includes('application') || lowerMessage.includes('resume')) {
      return 'application';
    }
    
    if (lowerMessage.includes('experience') || lowerMessage.includes('background') || lowerMessage.includes('work history')) {
      return 'experience';
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return 'greeting';
    }
    
    return 'general';
  }

  /**
   * Generate AI response based on message content
   */
  generateResponse(message) {
    if (!this.isJobRelated(message)) {
      return this.getRandomResponse(this.rejectionMessages);
    }

    const category = this.categorizeQuery(message);
    const responses = this.jobResponses[category] || this.jobResponses.general;
    
    return this.getRandomResponse(responses);
  }

  /**
   * Get random response from array
   */
  getRandomResponse(responseArray) {
    return responseArray[Math.floor(Math.random() * responseArray.length)];
  }

  /**
   * Process and send AI response
   */
  async processAIResponse(conversationId, userMessage, userId) {
    try {
      // Generate AI response
      const aiResponseText = this.generateResponse(userMessage);
      
      // Create AI message in database
      const aiMessage = await sendMessageDB({
        conversationId,
        sender: 'ai_assistant', // Special sender ID for AI
        receiver: userId,
        text: aiResponseText,
        delivered: true,
        isAI: true
      });

      return aiMessage;
    } catch (error) {
      console.error('AI response processing error:', error);
      
      // Fallback response
      return await sendMessageDB({
        conversationId,
        sender: 'ai_assistant',
        receiver: userId,
        text: "I apologize, but I'm experiencing technical difficulties. Please try again or contact support for assistance with your career inquiries.",
        delivered: true,
        isAI: true
      });
    }
  }

  /**
   * Should respond with AI (can include logic for when to respond)
   */
  shouldRespondWithAI(message, conversationHistory = []) {
    // Always respond for now, but can add logic like:
    // - Don't respond if last message was from AI
    // - Respond based on conversation context
    // - Respond based on user preferences
    
    const lastMessage = conversationHistory[conversationHistory.length - 1];
    return !lastMessage || lastMessage.sender !== 'ai_assistant';
  }
}

export default new AIMessageService();