export const validateEmail = (email: string): string | null => {
  if (!email) return 'ایمیل الزامی است';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'فرمت ایمیل نامعتبر است';
  }
  return null;
};

export const validatePhone = (phone: string): string | null => {
  if (!phone) return 'شماره تلفن الزامی است';
  const phoneRegex = /^09[0-9]{9}$/;
  if (!phoneRegex.test(phone)) {
    return 'فرمت شماره تلفن نامعتبر است (مثال: 09123456789)';
  }
  return null;
};