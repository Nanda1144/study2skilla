
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "How does the AI Roadmap generation work?",
      a: "We utilize Google's advanced Gemini 3 Pro model to analyze current industry standards, university curriculums, and your specific domain choice to construct a personalized, semester-by-semester learning path."
    },
    {
      q: "Is the Resume analysis automated?",
      a: "Yes. Our Resume & AI Builder uses Gemini 2.5 Flash to parse your resume text or PDF, compare it against millions of job descriptions for your target role, and provide instant, actionable feedback."
    },
    {
      q: "Are the courses listed free?",
      a: "We curate a mix of high-quality Free (YouTube, OpenCourseWare) and Paid (Udemy, Coursera) resources. You can filter by 'Free' in the Courses tab to see only no-cost options."
    },
    {
      q: "How do I level up my profile?",
      a: "You earn XP by completing roadmap items, logging study hours, and maintaining a daily streak. Higher levels unlock advanced mock interview scenarios."
    }
  ];

  return (
    <div className="mt-12 bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-6">Frequently Asked Questions</h3>
      <div className="grid grid-cols-1 gap-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
            <button 
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              className="w-full flex justify-between items-center p-4 text-left hover:bg-slate-900 transition"
            >
              <span className="font-medium text-slate-200">{faq.q}</span>
              {openFaq === idx ? <ChevronUp size={16} className="text-indigo-400"/> : <ChevronDown size={16} className="text-slate-500"/>}
            </button>
            {openFaq === idx && (
              <div className="p-4 pt-0 text-sm text-slate-400 leading-relaxed border-t border-slate-800/50 bg-slate-900/30">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
