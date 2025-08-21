// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useJobs } from '../hooks/useJobs';
import { Link } from 'react-router-dom';
import {
  Edit,
  PlusCircle,
  FileText,
  MapPin,
  Briefcase,
  Award,
  User,
  GraduationCap,
} from 'lucide-react';
import formatDate from '../utils/formatDate';
import EducationList from '../components/Profile/EducationList';
import EmploymentList from '../components/Profile/EmploymentList';

const Profile = () => {
  const { user, setUser } = useAuth();
  const { jobs } = useJobs();

  // ✅ Initial avatarPreview from user.avatar
  const [avatarPreview, setAvatarPreview] = useState(
    user?.avatar ? `http://localhost:8000${user.avatar}` : ''
  );
  const [resumeFile, setResumeFile] = useState(user?.resume || '');

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/users/me`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUser(res.data);
        setResumeFile(res.data.resume || '');
      } catch (err) {
        console.error('Fetch user error:', err);
      }
    };
    fetchUser();
  }, [setUser]);

  // ✅ Update avatarPreview whenever user.avatar changes
  useEffect(() => {
    if (user?.avatar) {
      setAvatarPreview(`http://localhost:8000${user.avatar}`);
    }
  }, [user]);

  // Avatar Upload
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const tempUrl = URL.createObjectURL(file);
    setAvatarPreview(tempUrl); // show temp preview

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await axios.put(
        'http://localhost:8000/api/users/me/photo',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      // Update preview & user from backend
      setAvatarPreview(
        res.data.avatar ? `http://localhost:8000${res.data.avatar}` : ''
      );
      setUser(res.data.user);
    } catch (err) {
      console.error('Avatar upload error:', err);
      // Rollback to backend avatar
      setAvatarPreview(
        user?.avatar ? `http://localhost:8000${user.avatar}` : ''
      );
    }
  };

  // Resume Upload
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setResumeFile(file.name);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await axios.put(
        'http://localhost:8000/api/users/me/resume',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setResumeFile(res.data.resume || '');
      setUser(res.data.user);
    } catch (err) {
      console.error('Resume upload error:', err);
      setResumeFile(user?.resume || '');
    }
  };

  // Profile Completion
  const profileFields = [
    user?.name,
    user?.email,
    user?.role,
    user?.location,
    user?.skills && user.skills.length > 0 ? true : null,
    user?.bio,
    resumeFile,
  ];
  const completed = profileFields.filter(Boolean).length;
  const total = profileFields.length;
  const completionPercent = Math.round((completed / total) * 100);

  const filteredJobs =
    user?.role === 'recruiter'
      ? jobs.filter((job) => job.postedBy === user?._id)
      : jobs.filter((job) => job.applicants?.includes(user?._id));

  return (
    <div className="flex max-w-7xl mx-auto py-10 px-4 gap-6">
      {/* Sidebar */}
      <aside className="hidden md:block w-1/4 bg-white rounded-2xl shadow p-6 sticky top-20 h-fit">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Quick Links</h2>
        <ul className="space-y-3 text-gray-600">
          <li>
            <a href="#resume" className="flex items-center gap-2 hover:text-teal-600">
              <FileText size={16} /> Resume
            </a>
          </li>
          <li>
            <a href="#skills" className="flex items-center gap-2 hover:text-teal-600">
              <Award size={16} /> Skills
            </a>
          </li>
          <li>
            <a href="#employment" className="flex items-center gap-2 hover:text-teal-600">
              <Briefcase size={16} /> Employment
            </a>
          </li>
          <li>
            <a href="#education" className="flex items-center gap-2 hover:text-teal-600">
              <GraduationCap size={16} /> Education
            </a>
          </li>
          <li>
            <a href="#about" className="flex items-center gap-2 hover:text-teal-600">
              <User size={16} /> About
            </a>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <div className="flex-1 space-y-8">
        {/* Profile Header */}
        <motion.div
          className="bg-white rounded-2xl shadow p-8 flex flex-col md:flex-row items-center gap-6 border-t-4 border-teal-500"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <img
              src={
                avatarPreview
                  ? avatarPreview
                  : user?.avatar
                  ? `http://localhost:8000${user.avatar}`
                  : 'https://via.placeholder.com/120'
              }
              alt="avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-teal-500"
            />
            <input
              type="file"
              id="avatarUpload"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
            <label
              htmlFor="avatarUpload"
              className="absolute bottom-2 right-2 bg-teal-600 text-white p-2 rounded-full cursor-pointer hover:bg-teal-700"
            >
              <Edit size={16} />
            </label>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2 justify-center md:justify-start">
              {user?.name}
            </h2>
            <p className="text-gray-500">{user?.role || 'Frontend Developer'}</p>
            <p className="text-sm text-gray-400 mt-1">
              Member since {formatDate(user?.createdAt)}
            </p>
            {user?.location && (
              <p className="flex items-center gap-1 text-sm mt-1 text-gray-600 justify-center md:justify-start">
                <MapPin size={14} /> {user.location}
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-3 justify-center md:justify-start">
              <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition">
                <Edit size={16} /> Edit Profile
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
                <PlusCircle size={16} /> Add Section
              </button>
            </div>
          </div>
        </motion.div>

        {/* Profile Completion */}
        <motion.div
          className="bg-white rounded-2xl shadow p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Profile Completeness</h3>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-teal-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${completionPercent}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">{completionPercent}% complete</p>
        </motion.div>

        {/* Resume Section */}
        <motion.div
          id="resume"
          className="bg-white rounded-2xl shadow p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            <FileText size={20} /> Resume
          </h3>
          {resumeFile ? (
            <p className="text-teal-600">📄 {resumeFile}</p>
          ) : (
            <p className="text-gray-500">No resume uploaded.</p>
          )}
          <input
            type="file"
            id="resumeUpload"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={handleResumeUpload}
          />
          <label
            htmlFor="resumeUpload"
            className="mt-3 inline-block px-4 py-2 bg-teal-600 text-white rounded-lg cursor-pointer hover:bg-teal-700 transition"
          >
            Upload Resume
          </label>
        </motion.div>

        {/* About Section */}
        <motion.div
          id="about"
          className="bg-white rounded-2xl shadow p-6 space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-xl font-bold text-gray-800">About</h3>
          <p className="text-gray-600">{user?.bio || 'Add a short bio about yourself...'}</p>
        </motion.div>

        {/* Skills Section */}
        <motion.div
          id="skills"
          className="bg-white rounded-2xl shadow p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-xl font-bold text-gray-800 mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {user?.skills?.length ? (
              user.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm shadow-sm"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-gray-500">No skills added yet.</p>
            )}
          </div>
        </motion.div>

        {/* Employment */}
        <motion.div
          id="employment"
          className="bg-white rounded-2xl shadow p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-xl font-bold text-gray-800 mb-3">Employment</h3>
          <EmploymentList user={user} setUser={setUser} />
        </motion.div>

        {/* Education */}
        <motion.div
          id="education"
          className="bg-white rounded-2xl shadow p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <EducationList user={user} setUser={setUser} />
        </motion.div>

        {/* Jobs */}
        <motion.div
          className="bg-white rounded-2xl shadow p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            {user?.role === 'recruiter' ? 'My Posted Jobs' : 'My Applications'}
          </h2>
          {filteredJobs.length > 0 ? (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <div
                  key={job._id}
                  className="border rounded-lg p-4 hover:shadow-md transition"
                >
                  <h3 className="text-lg font-semibold text-teal-700">{job.title}</h3>
                  <p className="text-gray-500 mb-2">{job.company}</p>
                  <p className="text-sm text-gray-400">
                    Posted on {formatDate(job.createdAt)}
                  </p>
                  <Link
                    to={`/jobs/${job._id}`}
                    className="text-teal-600 hover:underline mt-2 inline-block"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No jobs found.</p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
