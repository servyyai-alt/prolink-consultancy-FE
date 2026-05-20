import * as Yup from 'yup'

export const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/

export const sanitizeIndianMobileInput = (value = '') =>
  value.replace(/\D/g, '').slice(0, 10)

export const optionalIndianMobileSchema = (message = 'Enter a valid 10-digit mobile number') =>
  Yup.string()
    .transform((value) => (value || '').trim())
    .test('valid-indian-mobile', message, (value) => !value || INDIAN_MOBILE_REGEX.test(value))

export const requiredIndianMobileSchema = (
  requiredMessage = 'Mobile number is required',
  invalidMessage = 'Enter a valid 10-digit mobile number'
) =>
  Yup.string()
    .transform((value) => (value || '').trim())
    .required(requiredMessage)
    .test('valid-indian-mobile', invalidMessage, (value) => INDIAN_MOBILE_REGEX.test(value || ''))
