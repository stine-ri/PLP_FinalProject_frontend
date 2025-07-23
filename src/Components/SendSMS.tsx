import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Input, Select, message } from 'antd';

const { TextArea } = Input;
const { Option } = Select;

interface Student {
  _id: string;
  name: string;
  parentPhone: string;
}

interface Performance {
  subject: string;
  score: number;
  total: number;
}
interface SendSMSProps {
  teacherId: string | null;
  studentId: string;
}


const SendSMS: React.FC<SendSMSProps> = ({  teacherId }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [smsContent, setSmsContent] = useState("");
  const [status, setStatus] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");


  // Fetch teacher's students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(
          `https://mama-shule.onrender.com/api/teachers/${teacherId}/students`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setStudents(res.data);
      } catch (err) {
  console.error(err);
  message.error("Failed to fetch students");
}

    };

    if (teacherId) fetchStudents();
  }, [teacherId, token]);

  // Update phone number when student is selected
  useEffect(() => {
    if (selectedStudent) {
      const student = students.find(s => s._id === selectedStudent);
      if (student) {
        setPhoneNumber(student.parentPhone);
      }
    }
  }, [selectedStudent, students]);

  // Send SMS
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("📤 Sending...");

    try {
      const res = await axios.post(
        "https://mama-shule.onrender.com/api/sms/send",
        { to: phoneNumber, message: smsContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success(`✅ ${res.data.status}`);
      setSmsContent("");
    } catch (err) {
      console.error("SMS Error:", err);
      message.error("❌ Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate feedback message
  const handleAutoMessage = async () => {
    if (!selectedStudent) {
      message.warning("Please select a student first");
      return;
    }

    try {
      const res = await axios.get(
        `https://mama-shule.onrender.com/api/performance/latest/${selectedStudent}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const { subject, score, total }: Performance = res.data;
      const performance = score / total;

      const feedback =
        performance >= 0.8
          ? `🎉 Great job! Your child scored ${score}/${total} in ${subject}.`
          : performance >= 0.5
          ? `👍 Your child scored ${score}/${total} in ${subject}. Encourage more practice.`
          : `⚠️ Attention: Your child scored ${score}/${total} in ${subject}. More support may help.`;

      setSmsContent(feedback);
    } catch (err) {
      console.error("Auto-feedback error:", err);
      message.error("❌ Could not generate feedback.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-purple-700 mb-6">Send SMS to Parents</h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Student</label>
        <Select
          value={selectedStudent}
          onChange={setSelectedStudent}
          className="w-full"
          placeholder="Select a student"
          loading={students.length === 0}
        >
          {students.map(student => (
            <Option key={student._id} value={student._id}>
              {student.name} - {student.parentPhone}
            </Option>
          ))}
        </Select>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Parent Phone Number</label>
        <Input
          value={phoneNumber}
          disabled
          className="w-full"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
        <TextArea
          value={smsContent}
          onChange={(e) => setSmsContent(e.target.value)}
          className="w-full"
          rows={6}
          placeholder="Type or generate message..."
          maxLength={160}
          showCount
        />
      </div>

      <div className="flex gap-3">
        <Button
          onClick={handleAutoMessage}
          className="bg-blue-600 text-white hover:bg-blue-700"
          disabled={!selectedStudent}
        >
          Generate Feedback
        </Button>
        <Button
          onClick={handleSubmit}
          className="bg-purple-700 text-white hover:bg-purple-800"
          loading={loading}
          disabled={!smsContent || !phoneNumber}
          type="primary"
        >
          Send SMS
        </Button>
      </div>

      {status && <p className="mt-4 text-center font-medium">{status}</p>}
    </div>
  );
};

export default SendSMS;