// All auth pages in a single file — split into individual files at import time
// This file exports Login, Register, VerifyOTP, ForgotPassword, ResetPassword
// ─────────────────────────────────────────────────────────────────────────────
// USAGE: pages/auth/Login.jsx  → just re-exports from here

export { Login as default } from './_authPages'
