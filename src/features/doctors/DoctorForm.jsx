import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const DoctorForm = ({ isOpen, onClose, onSave, title, doctor }) => {
  if (!isOpen) return null;

  // التحقق من صحة البيانات باستخدام Yup
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    phone: Yup.string().matches(/^[0-9]{11}$/, 'Phone number must be 11 digits').required('Phone is required'),
    mobile: Yup.string().matches(/^[0-9]{11}$/, 'Mobile number must be 11 digits').required('Mobile is required'),
    experience: Yup.number().positive('Experience must be a positive number').required('Experience is required'),
    patients: Yup.number().positive('Number of patients must be a positive number').required('Number of patients is required'),
    about: Yup.string().required('About is required'),
    locationLink: Yup.string().url('Invalid URL').required('Location link is required'),
    whatsapp: Yup.string().url('Invalid URL').required('WhatsApp link is required'),
    status: Yup.string().required('Status is required'),
    specialty: Yup.string().required('Specialty is required')
  });

  const handleSubmit = (values) => {
    onSave(values);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-2 rounded-lg shadow-xl w-full max-w-xs"> {/* تم تصغير العرض إلى max-w-xs */}
        <h2 className="text-lg font-bold mb-3 text-sky-600 text-center">{title}</h2> {/* تم تقليص حجم العنوان */}
        
        <Formik
          initialValues={{
            name: doctor?.name || '',
            email: doctor?.email || '',
            phone: doctor?.phone || '',
            mobile: doctor?.mobile || '',
            experience: doctor?.experience || '',
            patients: doctor?.patients || '',
            about: doctor?.about || '',
            locationLink: doctor?.locationLink || '',
            whatsapp: doctor?.whatsapp || '',
            status: doctor?.status || 'Active', // قيمة افتراضية إذا كانت فارغة
            specialty: doctor?.specialty || ''
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className="space-y-2"> {/* تم تقليص المسافات بين الحقول */}
              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block text-xs font-medium text-gray-700">Name</label> {/* تم تقليص حجم الخط */}
                <Field
                  id="name"
                  name="name"
                  type="text"
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
                <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-gray-700">Email</label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              {/* Phone Input */}
              <div>
                <label htmlFor="phone" className="block text-xs font-medium text-gray-700">Phone</label>
                <Field
                  id="phone"
                  name="phone"
                  type="text"
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
                <ErrorMessage name="phone" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              {/* Mobile Input */}
              <div>
                <label htmlFor="mobile" className="block text-xs font-medium text-gray-700">Mobile</label>
                <Field
                  id="mobile"
                  name="mobile"
                  type="text"
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
                <ErrorMessage name="mobile" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              {/* Experience Input */}
              <div>
                <label htmlFor="experience" className="block text-xs font-medium text-gray-700">Experience (years)</label>
                <Field
                  id="experience"
                  name="experience"
                  type="number"
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
                <ErrorMessage name="experience" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              {/* Patients Input */}
              <div>
                <label htmlFor="patients" className="block text-xs font-medium text-gray-700">Patients</label>
                <Field
                  id="patients"
                  name="patients"
                  type="number"
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
                <ErrorMessage name="patients" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              {/* About Input */}
              <div>
                <label htmlFor="about" className="block text-xs font-medium text-gray-700">About</label>
                <Field
                  id="about"
                  name="about"
                  type="text"
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
                <ErrorMessage name="about" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              {/* Location Link Input */}
              <div>
                <label htmlFor="locationLink" className="block text-xs font-medium text-gray-700">Location Link</label>
                <Field
                  id="locationLink"
                  name="locationLink"
                  type="text"
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
                <ErrorMessage name="locationLink" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              {/* WhatsApp Link Input */}
              <div>
                <label htmlFor="whatsapp" className="block text-xs font-medium text-gray-700">WhatsApp Link</label>
                <Field
                  id="whatsapp"
                  name="whatsapp"
                  type="text"
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
                <ErrorMessage name="whatsapp" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              {/* Specialty Input */}
              <div>
                <label htmlFor="specialty" className="block text-xs font-medium text-gray-700">Specialty</label>
                <Field
                  id="specialty"
                  name="specialty"
                  type="text"
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
                <ErrorMessage name="specialty" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              {/* Status Input */}
              <div>
                <label htmlFor="status" className="block text-xs font-medium text-gray-700">Status</label>
                <Field
                  as="select"
                  id="status"
                  name="status"
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Field>
                <ErrorMessage name="status" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-between mt-4">
                <button
                  type="submit"
                  className="bg-sky-600 text-white px-4 py-1.5 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-1 focus:ring-sky-500"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-400 text-white px-4 py-1.5 rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default DoctorForm;
