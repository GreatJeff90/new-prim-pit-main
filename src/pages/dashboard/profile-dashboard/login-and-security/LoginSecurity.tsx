import React, { useState } from 'react';
import { useApi } from '../../../../context/AppContext'; 
import { toast } from 'react-hot-toast';

const LoginSecurity: React.FC = () => {
  const { resetPassword, updatePassword } = useApi(); 
  const [form, setForm] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const validate = (name: string, value: string) => {
    if (!value.trim()) return 'This field is required';
    if (name === 'confirmPassword' && value !== form.newPassword)
      return 'Passwords do not match';
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: validate(name, value) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = Object.keys(form).reduce((acc, key) => {
      const error = validate(key, form[key as keyof typeof form]);
      if (error) acc[key] = error;
      return acc;
    }, {} as typeof errors);
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      setIsLoading(true);
      await updatePassword({
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword
      });
      
      toast.success('Password updated successfully!');
      setForm({ newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Failed to update password:', error);
      toast.error('Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      setIsResetting(true);
      await resetPassword();
      toast.success('Password has been reset to your original signup password');
    } catch (error) {
      console.error('Failed to reset password:', error);
      toast.error('Failed to reset password');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {['newPassword', 'confirmPassword'].map((field) => (
        <div key={field} className="mb-4">
          <label className="block text-sm mb-1 capitalize">
            {field.replace(/([A-Z])/g, ' $1')}
          </label>
          <input
            name={field}
            type="password"
            value={form[field as keyof typeof form]}
            onChange={handleChange}
            className="w-full bg-[#EDF2F6] text-black border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading || isResetting}
          />
          {errors[field] && (
            <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
          )}
        </div>
      ))}

      <div className="flex gap-4 mt-20">
        <button
          type="submit"
          className="bg-[#D74632] hover:bg-red-600 text-white px-4 py-2 rounded shadow disabled:opacity-50"
          disabled={isLoading || isResetting}
        >
          {isLoading ? 'Updating...' : 'Update Password'}
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="text-sm text-white cursor-pointer disabled:opacity-50"
          disabled={isLoading || isResetting}
        >
          {isResetting ? 'Resetting...' : 'Reset Password'}
        </button>
      </div>
    </form>
  );
};

export default LoginSecurity;