'use client';

import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { fetchProjects } from '@/redux/Slices/projectSlice';
import { createProperty } from '@/redux/Slices/propertySlice';
import { Snackbar, Alert } from '@mui/material';

interface Project {
  id: string;
  name: string;
}

interface PropertyFormData {
  projectId: string;
  title: string;
  size: number ;
  price: number ;
  handoverDate: Date | null;
}

export default function PropertyForm() {
  const dispatch = useDispatch<AppDispatch>();
  const { projects, loading: projectsLoading } = useSelector((state: RootState) => state.projects);
  const { loading: propertyLoading, error: propertyError, success } = useSelector((state: RootState) => state.properties);

  const [formData, setFormData] = useState<PropertyFormData>({
    projectId: '',
    title: '',
    size: 0,
    price: 0,
    handoverDate: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // Fetch projects on mount
  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  // Handle success state
  useEffect(() => {
    if (success) {
      showSnackbar('Property saved successfully!', 'success');
      resetForm();
      // dispatch(resetPropertyState());
    }
  }, [success, dispatch]);

  // Handle error state
  useEffect(() => {
    if (propertyError) {
      showSnackbar(propertyError, 'error');
      // dispatch(resetPropertyState());
    }
  }, [propertyError, dispatch]);

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const resetForm = () => {
    setFormData({
      projectId: '',
      title: '',
      size: 0,
      price: 0,
      handoverDate: null,
    });
    setErrors({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // For numeric fields, only allow numbers
    if (name === 'size' || name === 'price') {
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: numericValue === '' ? '' : Number(numericValue),
      }));
      validateField(name, numericValue === '' ? '' : Number(numericValue));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
      validateField(name, value);
    }
  };

  const handleDateChange = (date: Date | null) => {
    setFormData(prev => ({
      ...prev,
      handoverDate: date,
    }));
    validateField('handoverDate', date);
  };

  const validateField = (name: string, value: string | number | Date | null) => {
    let error = '';
    
    switch (name) {
      case 'projectId':
        error = value ? '' : 'Project is required';
        break;
      case 'title':
        error = typeof value === 'string' && value.trim() ? '' : 'Title is required';
        break;
      case 'size':
        error = typeof value === 'number' && value > 0 ? '' : 'Size must be a positive number';
        break;
      case 'price':
        error = typeof value === 'number' && value > 0 ? '' : 'Price must be a positive number';
        break;
      case 'handoverDate':
        error = value instanceof Date && value > new Date() ? '' : 'Handover date must be in the future';
        break;
    }
  
    setErrors(prev => ({
      ...prev,
      [name]: error,
    }));
  };

  const validateForm = () => {
    return (
      formData.projectId &&
      formData.title.trim() &&
      formData.size > 0 &&
      formData.price > 0 &&
      formData.handoverDate &&
      formData.handoverDate > new Date() &&
      Object.values(errors).every(error => !error)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    try {
      const resultAction = await dispatch(createProperty({
        propertyData: {
          project_id: formData.projectId,
          title: formData.title,
          size: formData.size,
          price: formData.price,
          handover_date: formData.handoverDate?.toISOString(),
        },
        headers: {
          'X-API-KEY': 'test123',
          'Content-Type': 'application/json'
        }
      }));
  
      if (createProperty.rejected.match(resultAction)) {
        const error = resultAction.payload || 'Failed to save property';
        showSnackbar(error as string, 'error');
      }
    } catch (error) {
      showSnackbar('An unexpected error occurred', 'error');
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Property</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Project Dropdown */}
              <div>
                <label htmlFor="projectId" className="block text-sm font-medium text-gray-700">
                  Project
                </label>
                <select
                  id="projectId"
                  name="projectId"
                  value={formData.projectId}
                  onChange={handleChange}
                  className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${
                    errors.projectId ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md`}
                  disabled={projectsLoading}
                >
                  <option value="">Select a project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
                {errors.projectId && <p className="mt-2 text-sm text-red-600">{errors.projectId}</p>}
              </div>

              {/* Title Input */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Property Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title}</p>}
              </div>

              {/* Size Input */}
              <div>
                <label htmlFor="size" className="block text-sm font-medium text-gray-700">
                  Size (sq. ft.)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  id="size"
                  name="size"
                  value={formData.size === 0 ? '' : formData.size}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${
                    errors.size ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {errors.size && <p className="mt-2 text-sm text-red-600">{errors.size}</p>}
              </div>

              {/* Price Input */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price ($)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    id="price"
                    name="price"
                    value={formData.price === 0 ? '' : formData.price}
                    onChange={handleChange}
                    className={`block w-full pl-7 pr-12 border ${
                      errors.price ? 'border-red-500' : 'border-gray-300'
                    } rounded-md py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  />
                </div>
                {errors.price && <p className="mt-2 text-sm text-red-600">{errors.price}</p>}
              </div>

              {/* Handover Date */}
              <div>
                <label htmlFor="handoverDate" className="block text-sm font-medium text-gray-700">
                  Handover Date
                </label>
                <DatePicker
                  selected={formData.handoverDate}
                  onChange={handleDateChange}
                  minDate={new Date()}
                  className={`mt-1 block w-full border ${
                    errors.handoverDate ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholderText="Select a date"
                  id="handoverDate"
                />
                {errors.handoverDate && <p className="mt-2 text-sm text-red-600">{errors.handoverDate}</p>}
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={!validateForm() || propertyLoading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    validateForm() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  {propertyLoading ? 'Saving...' : 'Save Property'}
                </button>
              </div>
            </form>
          </div>

          {/* Live Preview Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Live Preview</h2>
            <div className="border border-gray-200 rounded-lg p-4">
              {formData.projectId ? (
                <>
                  <h3 className="text-xl font-semibold mb-2">
                    {projects.find(p => p.id === formData.projectId)?.name || 'Project'}
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Property:</span> {formData.title || 'N/A'}
                    </p>
                    <p>
                      <span className="font-medium">Size:</span>{' '}
                      {formData.size ? `${formData.size} sq. ft.` : 'N/A'}
                    </p>
                    <p>
                      <span className="font-medium">Price:</span>{' '}
                      {formData.price ? `$${formData.price.toLocaleString()}` : 'N/A'}
                    </p>
                    <p>
                      <span className="font-medium">Handover Date:</span>{' '}
                      {formData.handoverDate ? formatDate(formData.handoverDate) : 'N/A'}
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-gray-500">Select a project to see preview</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}